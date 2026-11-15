import React from 'react';

export function LoadingSpinner({ message = 'Loading...', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }[size] || 'w-8 h-8 border-3';

  return (
    <div className="flex flex-col items-center justify-center p-8 text-[#68635D]">
      <div
        className={`${sizeClasses} border-[#DFD0BE] border-t-[#B8956B] rounded-full animate-spin mb-3`}
      />
      {message && <p className="text-sm font-medium">{message}</p>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, actionText, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-[#FFFDFC] rounded-2xl border border-[#DFD0BE] shadow-xs my-4">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-[#EDE5D9] flex items-center justify-center text-[#87613B] mb-4">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h3 className="text-lg font-bold text-[#262B32] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#68635D] max-w-md mb-6">{description}</p>}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-[#262B32] hover:bg-[#191F24] text-white text-sm font-semibold rounded-xl transition-all shadow-xs cursor-pointer hover:scale-[1.01]"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export function Badge({ children, variant = 'default', size = 'sm' }) {
  const variants = {
    default: 'bg-[#EDE5D9] text-[#262B32] border-[#DFD0BE]',
    primary: 'bg-[#EACBA5]/30 text-[#87613B] border-[#B8956B]/40 font-semibold',
    success: 'bg-[#237451]/10 text-[#237451] border-[#237451]/30 font-semibold',
    warning: 'bg-[#966014]/10 text-[#966014] border-[#966014]/30 font-semibold',
    danger: 'bg-[#B83D3D]/10 text-[#B83D3D] border-[#B83D3D]/30 font-semibold',
    purple: 'bg-[#EDE5D9] text-[#87613B] border-[#DFD0BE] font-semibold',
    gold: 'bg-[#B8956B]/15 text-[#87613B] border-[#B8956B]/30 font-semibold',
  }[variant] || 'bg-[#EDE5D9] text-[#262B32] border-[#DFD0BE]';

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  }[size] || 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${variants} ${sizes}`}>
      {children}
    </span>
  );
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className={`bg-[#FFFDFC] rounded-2xl shadow-xl border border-[#DFD0BE] w-full ${maxWidth} overflow-hidden transform animate-in zoom-in-95`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#DFD0BE] bg-[#F6F3EE]">
            <h3 className="text-lg font-bold text-[#262B32]">{title}</h3>
            <button
              onClick={onClose}
              className="text-[#68635D] hover:text-[#262B32] hover:bg-[#EDE5D9] rounded-lg p-1.5 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
