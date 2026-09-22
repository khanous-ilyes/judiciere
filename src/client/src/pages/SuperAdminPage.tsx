import React, { useEffect, useState } from 'react';
import { Shield, RefreshCw, Power } from 'lucide-react';
import { api } from '../services/api';
import type { Tenant, ModuleType } from '../types';
import type { Language } from '../i18n';

interface SuperAdminPageProps {
  currentLang: Language;
}

export const SuperAdminPage: React.FC<SuperAdminPageProps> = ({ currentLang: _currentLang }) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  const modulesList: ModuleType[] = ['Avocat', 'Notaire', 'Huissier', 'EcrivainPublic'];

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const res = await api.get('/tenants');
      if (res.data.success) {
        setTenants(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load tenants', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleModule = async (tenantId: string, moduleType: ModuleType, currentStatus: boolean) => {
    try {
      await api.post(`/tenants/${tenantId}/toggle-module`, {
        moduleType,
        isActive: !currentStatus
      });
      fetchTenants();
    } catch (err) {
      alert('Erreur lors du changement de module');
    }
  };

  const handleToggleStatus = async (tenantId: string) => {
    try {
      await api.post(`/tenants/${tenantId}/toggle-status`);
      fetchTenants();
    } catch (err) {
      alert('Erreur lors de la suspension');
    }
  };

  if (loading) return <div style={{ padding: '24px' }}>Chargement de la console Super-Admin...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield color="var(--accent-gold)" /> Console d'Administration Globale (Super-Admin)
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Gestion centralisée des cabinets (Tenants) et activation dynamique des 4 modules métiers
          </p>
        </div>
        <button className="btn-primary" onClick={fetchTenants}>
          <RefreshCw size={16} /> Actualiser
        </button>
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Liste des Cabinets Inscrits</h3>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Cabinet / Office</th>
              <th>Matricule / Agrément</th>
              <th>Wilaya</th>
              <th>Statut Cabinet</th>
              <th>Modules Actifs (Feature Flags)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => (
              <tr key={t.id}>
                <td>
                  <div style={{ fontWeight: 700 }}>{t.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.email}</div>
                </td>
                <td>{t.professionalRegistrationNumber || 'N/A'}</td>
                <td>{t.wilaya}</td>
                <td>
                  <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, background: t.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)', color: t.isActive ? '#34d399' : '#f43f5e' }}>
                    {t.isActive ? 'Actif' : 'Suspendu'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {modulesList.map((mod) => {
                      const isActive = t.activeModules?.includes(mod);
                      return (
                        <button
                          key={mod}
                          onClick={() => handleToggleModule(t.id, mod, !!isActive)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            background: isActive ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                            color: isActive ? '#60a5fa' : 'var(--text-muted)',
                          }}
                          title={`Cliquer pour ${isActive ? 'désactiver' : 'activer'} ${mod}`}
                        >
                          {isActive ? '✓ ' : '+ '}{mod}
                        </button>
                      );
                    })}
                  </div>
                </td>
                <td>
                  <button onClick={() => handleToggleStatus(t.id)} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', color: t.isActive ? '#f43f5e' : '#34d399' }}>
                    <Power size={14} /> {t.isActive ? 'Suspendre' : 'Activer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
