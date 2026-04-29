import React from 'react';

interface SectionHeaderProps {
  title: string;
  icon: React.ReactNode;
  colorClass: string;
  children?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon, colorClass, children }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 mb-5 shrink-0">
    <h2 className={`text-[11px] font-bold uppercase tracking-[0.15em] ${colorClass} flex items-center gap-1.5 whitespace-nowrap`}>
      {icon} {title}
    </h2>
    {children}
  </div>
);
