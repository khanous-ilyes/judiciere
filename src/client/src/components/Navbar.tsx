import React from 'react';
import { Globe, LogOut, Shield, Moon, Sun, Scale } from 'lucide-react';
import type { User } from '../types';
import type { Language } from '../i18n';
import { translations } from '../i18n';

interface NavbarProps {
  user: User | null;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentLang,
  onLanguageChange,
  theme,
  onToggleTheme,
  onLogout,
}) => {
  const t = translations[currentLang];

  return (
    <header className="glass-card" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ background: 'linear-gradient(135deg, #d97706, #3b82f6)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Scale size={24} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, background: 'linear-gradient(135deg, #f8fafc 0%, #fbbf24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t.appTitle}
          </h1>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {user?.cabinetName || t.appSubtitle}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Language Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-secondary)', padding: '6px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <Globe size={16} color="var(--text-muted)" />
          {(['ar', 'fr', 'en'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              style={{
                background: currentLang === lang ? 'var(--accent-blue)' : 'transparent',
                color: currentLang === lang ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.75rem',
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Theme Toggle */}
        <button onClick={onToggleTheme} className="btn-outline" style={{ padding: '8px 12px' }}>
          {theme === 'dark' ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#3b82f6" />}
        </button>

        {/* User profile & logout */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '12px', borderLeft: '1px solid var(--border-color)' }}>
            <div style={{ textAlign: currentLang === 'ar' ? 'left' : 'right' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.fullName}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={12} /> {user.role}
              </div>
            </div>
            <button onClick={onLogout} className="btn-outline" style={{ padding: '8px', color: '#f43f5e' }} title={t.logout}>
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
