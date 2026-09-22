import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  subtitle?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color = '#3b82f6',
  subtitle,
}) => {
  return (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '6px' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.75rem', color: color, marginTop: '4px', fontWeight: 600 }}>
            {subtitle}
          </div>
        )}
      </div>
      <div style={{ background: `${color}20`, border: `1px solid ${color}40`, padding: '14px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={26} color={color} />
      </div>
    </div>
  );
};
