import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SuperAdminPage } from './pages/SuperAdminPage';
import { ClientsPage } from './pages/ClientsPage';
import { DossiersPage } from './pages/DossiersPage';
import { AvocatPage } from './pages/AvocatPage';
import { NotairePage } from './pages/NotairePage';
import { HuissierPage } from './pages/HuissierPage';
import { EcrivainPage } from './pages/EcrivainPage';
import { FacturesPage } from './pages/FacturesPage';
import { AgendaPage } from './pages/AgendaPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { AuditLogPage } from './pages/AuditLogPage';
import type { User, ModuleType } from './types';
import type { Language } from './i18n';

export const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'));
  const [user, setUser] = useState<User | null>(null);
  const [activeModules, setActiveModules] = useState<ModuleType[]>(['Avocat', 'Notaire', 'Huissier', 'EcrivainPublic']);
  const [currentLang, setCurrentLang] = useState<Language>('fr');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  useEffect(() => {
    // Handle RTL document attribute
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLang);
  }, [currentLang]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleLoginSuccess = (newToken: string, loggedUser: User, modules: ModuleType[]) => {
    setToken(newToken);
    setUser(loggedUser);
    setActiveModules(modules);
    if (loggedUser.role === 'SuperAdmin') {
      setActiveTab('superadmin');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <Navbar
          user={null}
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          onLogout={handleLogout}
        />
        <LoginPage onLoginSuccess={handleLoginSuccess} currentLang={currentLang} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <Navbar
        user={user}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onLogout={handleLogout}
      />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar
          user={user}
          activeModules={activeModules}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentLang={currentLang}
        />

        <main style={{ flex: 1, padding: '24px', overflowY: 'auto', maxHeight: 'calc(100vh - 65px)' }}>
          {activeTab === 'dashboard' && <DashboardPage currentLang={currentLang} activeModules={activeModules} />}
          {activeTab === 'superadmin' && <SuperAdminPage currentLang={currentLang} />}
          {activeTab === 'clients' && <ClientsPage currentLang={currentLang} />}
          {activeTab === 'dossiers' && <DossiersPage currentLang={currentLang} activeModules={activeModules} />}
          {activeTab === 'avocat' && <AvocatPage currentLang={currentLang} />}
          {activeTab === 'notaire' && <NotairePage currentLang={currentLang} />}
          {activeTab === 'huissier' && <HuissierPage currentLang={currentLang} />}
          {activeTab === 'ecrivain' && <EcrivainPage currentLang={currentLang} />}
          {activeTab === 'agenda' && <AgendaPage currentLang={currentLang} />}
          {activeTab === 'documents' && <DocumentsPage currentLang={currentLang} />}
          {activeTab === 'factures' && <FacturesPage currentLang={currentLang} />}
          {activeTab === 'audit' && <AuditLogPage currentLang={currentLang} />}
        </main>
      </div>
    </div>
  );
};

export default App;
