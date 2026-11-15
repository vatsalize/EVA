/**
 * Predefined Demonstration Accounts for EVA Platform
 * Sourced directly from data/dummy/students.json and data/dummy/coordinators.json
 */

export const DEMO_STUDENT_PASSWORD = 'Student@2026';
export const DEMO_COORDINATOR_PASSWORD = 'EVA-Demo@2026';

export const DEMO_COORDINATOR_ACCOUNTS = [
  {
    id: 'COO001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@eva-demo.test',
    club: 'Coding Club',
    clubId: 'CLB001',
    role: 'Coordinator'
  },
  {
    id: 'COO002',
    name: 'Diya Verma',
    email: 'diya.verma@eva-demo.test',
    club: 'Robotics Club',
    clubId: 'CLB002',
    role: 'Coordinator'
  },
  {
    id: 'COO003',
    name: 'Kabir Mehta',
    email: 'kabir.mehta@eva-demo.test',
    club: 'Cultural Club',
    clubId: 'CLB003',
    role: 'Coordinator'
  },
  {
    id: 'COO004',
    name: 'Ananya Rao',
    email: 'ananya.rao@eva-demo.test',
    club: 'Literary Society',
    clubId: 'CLB004',
    role: 'Coordinator'
  },
  {
    id: 'COO005',
    name: 'Reyansh Gupta',
    email: 'reyansh.gupta@eva-demo.test',
    club: 'Entrepreneurship Cell',
    clubId: 'CLB005',
    role: 'Coordinator'
  },
  {
    id: 'COO006',
    name: 'Myra Kapoor',
    email: 'myra.kapoor@eva-demo.test',
    club: 'Photography Club',
    clubId: 'CLB006',
    role: 'Coordinator'
  }
];

export const DEMO_STUDENT_ACCOUNTS = [
  {
    id: 'STU001',
    name: 'Ishita Singh',
    email: 'ishita.singh@student.eva-demo.test',
    department: 'Computer Engineering',
    year: 2,
    role: 'Student'
  },
  {
    id: 'STU002',
    name: 'Aditya Khanna',
    email: 'aditya.khanna@student.eva-demo.test',
    department: 'Electronics Engineering',
    year: 3,
    role: 'Student'
  },
  {
    id: 'STU003',
    name: 'Meera Joshi',
    email: 'meera.joshi@student.eva-demo.test',
    department: 'Computer Engineering',
    year: 4,
    role: 'Student'
  },
  {
    id: 'STU004',
    name: 'Rohan Bhatia',
    email: 'rohan.bhatia@student.eva-demo.test',
    department: 'Mechanical Engineering',
    year: 1,
    role: 'Student'
  },
  {
    id: 'STU005',
    name: 'Sana Ali',
    email: 'sana.ali@student.eva-demo.test',
    department: 'Electrical Engineering',
    year: 2,
    role: 'Student'
  },
  {
    id: 'STU006',
    name: 'Arjun Malhotra',
    email: 'arjun.malhotra@student.eva-demo.test',
    department: 'Computer Engineering',
    year: 3,
    role: 'Student'
  },
  {
    id: 'STU007',
    name: 'Naina Sethi',
    email: 'naina.sethi@student.eva-demo.test',
    department: 'Civil Engineering',
    year: 4,
    role: 'Student'
  },
  {
    id: 'STU008',
    name: 'Vivaan Kapoor',
    email: 'vivaan.kapoor@student.eva-demo.test',
    department: 'Computer Engineering',
    year: 1,
    role: 'Student'
  },
  {
    id: 'STU009',
    name: 'Aisha Khan',
    email: 'aisha.khan@student.eva-demo.test',
    department: 'Chemical Engineering',
    year: 2,
    role: 'Student'
  },
  {
    id: 'STU010',
    name: 'Krish Patel',
    email: 'krish.patel@student.eva-demo.test',
    department: 'Electronics Engineering',
    year: 3,
    role: 'Student'
  },
  {
    id: 'STU011',
    name: 'Tara Menon',
    email: 'tara.menon@student.eva-demo.test',
    department: 'Computer Engineering',
    year: 4,
    role: 'Student'
  },
  {
    id: 'STU012',
    name: 'Devansh Rao',
    email: 'devansh.rao@student.eva-demo.test',
    department: 'Mechanical Engineering',
    year: 1,
    role: 'Student'
  }
];

export function getInitials(name) {
  if (!name) return 'ST';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
