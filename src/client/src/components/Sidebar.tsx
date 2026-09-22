import React from 'react';
import { LayoutDashboard, Users, FolderKanban, Gavel, FileText, Stamp, PenTool, Receipt, ShieldAlert, CalendarDays, Files, ShieldCheck } from 'lucide-react';
import type { ModuleType, User } from '../types';
import type { Language } from '../i18n';
import { translations } from '../i18n';

interface SidebarProps {
  user: User | null;
  activeModules: ModuleType[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentLang: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeModules,
  activeTab,
  onTabChange,
  currentLang,
}) => {
  const t = translations[currentLang];

  const hasModule = (mod: ModuleType) =>
    user?.role === 'SuperAdmin' || activeModules.includes(mod);

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard, show: true },
    { id: 'clients', label: t.clients, icon: Users, show: true },
    { id: 'dossiers', label: t.dossiers, icon: FolderKanban, show: true },

    // Dynamic Modules
    { id: 'avocat', label: t.avocat, icon: Gavel, show: hasModule('Avocat'), badge: 'Avocat' },
    { id: 'notaire', label: t.notaire, icon: FileText, show: hasModule('Notaire'), badge: 'Notaire' },
    { id: 'huissier', label: t.huissier, icon: Stamp, show: hasModule('Huissier'), badge: 'Huissier' },
    { id: 'ecrivain', label: t.ecrivain, icon: PenTool, show: hasModule('EcrivainPublic'), badge: 'Écrivain' },

    { id: 'agenda', label: 'Agenda', icon: CalendarDays, show: true },
    { id: 'documents', label: 'Documents & GED', icon: Files, show: true },
    { id: 'factures', label: t.factures, icon: Receipt, show: true },
    { id: 'audit', label: 'Audit Logs', icon: ShieldCheck, show: user?.role === 'SuperAdmin' || user?.role === 'AdminCabinet' },
    { id: 'superadmin', label: t.superadmin, icon: ShieldAlert, show: user?.role === 'SuperAdmin' },
  ];

  return (
    <aside className="glass-card" style={{ width: '260px', height: 'calc(100vh - 65px)', borderRadius: 0, borderTop: 0, borderBottom: 0, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', padding: '0 12px 8px 12px', textTransform: 'uppercase' }}>
        {t.activeModules}
      </div>

      {menuItems.filter(item => item.show).map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: isActive ? '1px solid var(--accent-blue)' : '1px solid transparent',
              background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              color: isActive ? 'var(--accent-blue)' : 'var(--text-main)',
              fontWeight: isActive ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: currentLang === 'ar' ? 'right' : 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Icon size={20} color={isActive ? 'var(--accent-blue)' : 'var(--text-muted)'} />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className={`badge badge-${item.id}`}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  );
};
