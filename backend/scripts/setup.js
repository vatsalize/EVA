import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory references
const backendDir = path.resolve(__dirname, '..');
const rootDir = path.resolve(backendDir, '..');
const frontendDir = path.resolve(rootDir, 'frontend');
const databaseDir = path.resolve(rootDir, 'database');
const dbFile = path.resolve(databaseDir, 'eva.db');

// Environment file references
const rootEnv = path.resolve(rootDir, '.env');
const rootEnvExample = path.resolve(rootDir, '.env.example');
const backendEnv = path.resolve(backendDir, '.env');
const backendEnvExample = path.resolve(backendDir, '.env.example');

// Frontend build references
const frontendDist = path.resolve(frontendDir, 'dist');
const frontendIndexHtml = path.resolve(frontendDist, 'index.html');

console.log('================================================================');
console.log('  EVA Platform — Automatic Pre-flight Setup & Health Check');
console.log('================================================================');

/**
 * Safely execute a shell command with inherited stdio
 */
function run(cmd, cwd = rootDir) {
  try {
    execSync(cmd, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Compute SHA-256 hash of a file
 */
function hashFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Locate a working Python 3 executable on PATH
 */
function findPython() {
  const candidates = process.platform === 'win32'
    ? ['python', 'py', 'python3']
    : ['python3', 'python'];

  for (const cmd of candidates) {
    try {
      const output = execSync(`${cmd} --version`, { stdio: 'pipe', encoding: 'utf-8' });
      if (output && output.toLowerCase().includes('python')) {
        return cmd;
      }
    } catch {
      // Continue to next candidate
    }
  }
  return null;
}

/**
 * Recursively find the newest mtime of files in a directory
 */
function getLatestMtime(dirPath, ignoreDirs = ['node_modules', 'dist', '.git']) {
  if (!fs.existsSync(dirPath)) return 0;
  let latest = 0;

  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (ignoreDirs.includes(entry.name)) continue;
      const fullPath = path.join(currentDir, entry.name);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          traverse(fullPath);
        } else if (stat.isFile()) {
          if (stat.mtimeMs > latest) {
            latest = stat.mtimeMs;
          }
        }
      } catch {
        // Skip inaccessible entries
      }
    }
  }

  traverse(dirPath);
  return latest;
}

// =============================================================================
// STEP 1: Automatic Environment Configuration
// =============================================================================
console.log('\n[1/4] Checking environment configuration (.env)...');

let envConfigured = false;

// Root .env check
if (!fs.existsSync(rootEnv)) {
  if (fs.existsSync(rootEnvExample)) {
    fs.copyFileSync(rootEnvExample, rootEnv);
    console.log('  [+] Created root .env from .env.example (configured with local dev defaults).');
    envConfigured = true;
  } else {
    console.warn('  [!] Warning: .env.example not found in root directory.');
  }
} else {
  console.log('  [OK] Root .env already exists. Preserving existing settings.');
}

// Backend .env check
if (!fs.existsSync(backendEnv)) {
  if (fs.existsSync(backendEnvExample)) {
    fs.copyFileSync(backendEnvExample, backendEnv);
    console.log('  [+] Created backend/.env from backend/.env.example.');
    envConfigured = true;
  }
} else {
  console.log('  [OK] Backend .env already exists. Preserving existing settings.');
}

if (envConfigured) {
  console.log('  [Note] Default port is 5000. JWT_SECRET configured for local development.');
}

// =============================================================================
// STEP 2: Automatic Dependency Verification & Installation
// =============================================================================
console.log('\n[2/4] Verifying project dependencies...');

function verifyAndInstallDependencies(targetDir, name, criticalPackages = []) {
  const nodeModulesDir = path.join(targetDir, 'node_modules');
  const pkgJson = path.join(targetDir, 'package.json');
  const pkgLock = path.join(targetDir, 'package-lock.json');
  const metaFile = path.join(nodeModulesDir, '.eva_setup_meta.json');

  let needsInstall = false;

  if (!fs.existsSync(nodeModulesDir)) {
    console.log(`  [!] ${name} node_modules not found.`);
    needsInstall = true;
  } else {
    // Check critical packages
    for (const pkg of criticalPackages) {
      if (!fs.existsSync(path.join(nodeModulesDir, pkg))) {
        console.log(`  [!] Missing package in ${name}: ${pkg}.`);
        needsInstall = true;
        break;
      }
    }

    // Check lockfile / package hash freshness
    if (!needsInstall && fs.existsSync(metaFile)) {
      try {
        const meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'));
        const currentLockHash = hashFile(pkgLock);
        const currentPkgHash = hashFile(pkgJson);

        if (meta.lockHash !== currentLockHash || meta.pkgHash !== currentPkgHash) {
          console.log(`  [!] Package definitions changed in ${name}. Outdated dependencies.`);
          needsInstall = true;
        }
      } catch {
        needsInstall = true;
      }
    } else if (!needsInstall && !fs.existsSync(metaFile)) {
      // node_modules exists and key packages exist; generate meta file to avoid unnecessary future reinstalls
      try {
        const meta = {
          lockHash: hashFile(pkgLock),
          pkgHash: hashFile(pkgJson),
          updatedAt: new Date().toISOString()
        };
        fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2));
      } catch {
        // non-fatal
      }
    }
  }

  if (needsInstall) {
    console.log(`  [*] Installing ${name} dependencies...`);
    const hasLock = fs.existsSync(pkgLock);
    
    // Attempt npm ci first if lockfile exists, otherwise fallback to npm install
    let success = false;
    if (hasLock) {
      console.log(`      Running "npm ci" in ${path.relative(rootDir, targetDir)}...`);
      success = run('npm ci', targetDir);
    }
    
    if (!success) {
      console.log(`      Running "npm install --no-audit" in ${path.relative(rootDir, targetDir)}...`);
      success = run('npm install --no-audit', targetDir);
    }

    if (!success) {
      console.error(`\n[FATAL] Failed to install dependencies for ${name}.`);
      console.error('Please check your network connection and npm configuration.');
      process.exit(1);
    }

    // Save meta tag
    try {
      const meta = {
        lockHash: hashFile(pkgLock),
        pkgHash: hashFile(pkgJson),
        updatedAt: new Date().toISOString()
      };
      fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2));
    } catch {
      // non-fatal
    }
    console.log(`  [OK] ${name} dependencies installed successfully.`);
  } else {
    console.log(`  [OK] ${name} dependencies are up to date.`);
  }
}

// Backend dependencies check
verifyAndInstallDependencies(
  backendDir,
  'Backend',
  ['express', 'cors', 'dotenv', 'jsonwebtoken', 'bcryptjs', 'qrcode']
);

// Frontend dependencies check
verifyAndInstallDependencies(
  frontendDir,
  'Frontend',
  ['react', 'react-dom', 'vite', 'tailwindcss']
);

// =============================================================================
// STEP 3: Automatic Database Initialization
// =============================================================================
console.log('\n[3/4] Verifying database status...');

if (fs.existsSync(dbFile)) {
  console.log(`  [OK] Database already exists at: ${path.relative(rootDir, dbFile)}.`);
  console.log('  [OK] Preserving all existing student accounts, coordinator profiles, events and bookings.');
  console.log('       (Destructive reset is NEVER run automatically).');
} else {
  console.log(`  [!] Database file not found at ${path.relative(rootDir, dbFile)}.`);
  console.log('  [*] Initializing safe SQLite database...');

  const pythonCmd = findPython();
  if (!pythonCmd) {
    console.error('\n[FATAL] Python 3 is required for database initialization.');
    console.error('No working "python", "py", or "python3" command was found on your PATH.');
    console.error('Please install Python 3 from https://www.python.org/ or ensure it is accessible in your PATH.');
    process.exit(1);
  }

  console.log(`      Found Python interpreter: ${pythonCmd}`);

  // 1. Safe Schema Creation (zero demo data)
  console.log('      Executing safe schema initialization (database/seed.py --init-only)...');
  const initSuccess = run(`${pythonCmd} database/seed.py --init-only`, rootDir);
  if (!initSuccess) {
    console.error('\n[FATAL] Database schema initialization failed.');
    process.exit(1);
  }

  // 2. Non-destructive baseline demo seeding
  console.log('      Populating non-destructive demo fixtures (database/seed.py)...');
  const seedSuccess = run(`${pythonCmd} database/seed.py`, rootDir);
  if (!seedSuccess) {
    console.error('\n[FATAL] Database baseline seeding failed.');
    process.exit(1);
  }

  if (fs.existsSync(dbFile)) {
    console.log(`  [OK] Database successfully initialized and seeded at: ${path.relative(rootDir, dbFile)}.`);
  } else {
    console.error('\n[FATAL] Database file was not created. Setup failed.');
    process.exit(1);
  }
}

// =============================================================================
// STEP 4: Automatic Frontend Production Build
// =============================================================================
console.log('\n[4/4] Verifying frontend production build...');

let needsBuild = false;

if (!fs.existsSync(frontendIndexHtml)) {
  console.log('  [!] Frontend production build (dist/index.html) not found.');
  needsBuild = true;
} else {
  // Check if frontend source files or configs are newer than built index.html
  const distStat = fs.statSync(frontendIndexHtml);
  const distMtime = distStat.mtimeMs;

  const srcMtime = getLatestMtime(path.join(frontendDir, 'src'));
  const rootIndexMtime = fs.existsSync(path.join(frontendDir, 'index.html'))
    ? fs.statSync(path.join(frontendDir, 'index.html')).mtimeMs
    : 0;
  const pkgMtime = fs.existsSync(path.join(frontendDir, 'package.json'))
    ? fs.statSync(path.join(frontendDir, 'package.json')).mtimeMs
    : 0;
  const viteMtime = fs.existsSync(path.join(frontendDir, 'vite.config.js'))
    ? fs.statSync(path.join(frontendDir, 'vite.config.js')).mtimeMs
    : 0;

  const newestSourceTime = Math.max(srcMtime, rootIndexMtime, pkgMtime, viteMtime);

  if (newestSourceTime > distMtime) {
    console.log('  [!] Frontend source files are newer than existing build.');
    needsBuild = true;
  }
}

if (needsBuild) {
  console.log('  [*] Building frontend bundle with Vite ("npm run build")...');
  const buildSuccess = run('npm run build', frontendDir);
  if (!buildSuccess || !fs.existsSync(frontendIndexHtml)) {
    console.error('\n[FATAL] Frontend production build failed.');
    console.error('Please check the frontend build logs above.');
    process.exit(1);
  }
  console.log('  [OK] Frontend production build complete.');
} else {
  console.log('  [OK] Frontend production build is up to date (serving from frontend/dist).');
}

// =============================================================================
// COMPLETION
// =============================================================================
console.log('\n================================================================');
console.log('  [SUCCESS] All pre-flight checks passed!');
console.log('  Starting EVA Platform Backend Server...');
console.log('================================================================\n');

process.exit(0);
