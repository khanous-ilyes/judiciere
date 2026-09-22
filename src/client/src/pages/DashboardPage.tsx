import React, { useEffect, useState } from 'react';
import { Users, FolderKanban, FileCheck, DollarSign, Gavel, Stamp } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { api } from '../services/api';
import type { DashboardStats, ModuleType } from '../types';
import type { Language } from '../i18n';
import { translations } from '../i18n';

interface DashboardPageProps {
  currentLang: Language;
  activeModules: ModuleType[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ currentLang, activeModules }) => {
  const t = translations[currentLang];
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '24px' }}>Chargement du tableau de bord...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Active Modules Banner */}
      <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(59,130,246,0.15))' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {t.appTitle} — Vue d'ensemble du Cabinet
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Modules Métiers Activés (Cumul):
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {activeModules.map((mod) => (
            <span key={mod} className={`badge badge-${mod.toLowerCase()}`} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
              ✓ {mod}
            </span>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <StatsCard title={t.totalClients} value={stats?.totalClients || 0} icon={Users} color="#3b82f6" />
        <StatsCard title={t.totalDossiers} value={stats?.totalDossiers || 0} icon={FolderKanban} color="#8b5cf6" subtitle={`${stats?.dossiersOuverts || 0} en cours`} />
        {activeModules.includes('Avocat') && (
          <StatsCard title={t.audiencesUpcoming} value={stats?.audiencesUpcoming || 0} icon={Gavel} color="#f59e0b" subtitle="Rôle des audiences" />
        )}
        {activeModules.includes('Notaire') && (
          <StatsCard title={t.actesNotariesMonth} value={stats?.actesNotariesMois || 0} icon={FileCheck} color="#fbbf24" subtitle="Répertoire inviolable" />
        )}
        {activeModules.includes('Huissier') && (
          <StatsCard title={t.actesHuissierMonth} value={stats?.actesHuissierMois || 0} icon={Stamp} color="#10b981" subtitle="Loi 23-13 (Arabe)" />
        )}
        <StatsCard title={t.caMonth} value={`${(stats?.chiffreAffairesMoisDZD || 0).toLocaleString()} DZD`} icon={DollarSign} color="#10b981" />
      </div>

      {/* Recent Dossiers Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Derniers Dossiers Enregistrés</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mise à jour en temps réel</span>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Intitulé du Dossier</th>
              <th>Module</th>
              <th>Client</th>
              <th>Statut</th>
              <th>Date d'Ouverture</th>
            </tr>
          </thead>
          <tbody>
            {stats?.recentDossiers && stats.recentDossiers.length > 0 ? (
              stats.recentDossiers.map((dossier) => (
                <tr key={dossier.id}>
                  <td style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{dossier.code}</td>
                  <td>
                    <div>{dossier.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-gold)', direction: 'rtl', textTransform: 'uppercase' }}>{dossier.titleArabic}</div>
                  </td>
                  <td>
                    <span className={`badge badge-${dossier.moduleType.toLowerCase()}`}>
                      {dossier.moduleType}
                    </span>
                  </td>
                  <td>{dossier.clientName}</td>
                  <td>
                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, background: dossier.status === 'Ouvert' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)', color: dossier.status === 'Ouvert' ? '#34d399' : '#60a5fa' }}>
                      {dossier.status}
                    </span>
                  </td>
                  <td>{new Date(dossier.openingDate).toLocaleDateString(currentLang === 'ar' ? 'ar-DZ' : 'fr-FR')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>Aucun dossier récent</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
