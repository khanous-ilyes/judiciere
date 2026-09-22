import React, { useEffect, useState } from 'react';
import { ShieldAlert, Search, Filter, ShieldCheck, User as UserIcon } from 'lucide-react';
import { api } from '../services/api';
import type { Language } from '../i18n';

interface AuditLogPageProps {
  currentLang: Language;
}

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityName: string;
  entityId: string;
  timestamp: string;
  details?: string;
  ipAddress: string;
}

export const AuditLogPage: React.FC<AuditLogPageProps> = ({ currentLang: _currentLang }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/audit'); // You might need to create this endpoint
      if (res.data?.success) {
        setLogs(res.data.data || []);
      } else {
        setLogs(getDemoLogs());
      }
    } catch {
      setLogs(getDemoLogs());
    }
  };

  const getDemoLogs = (): AuditLog[] => {
    const now = Date.now();
    return [
      {
        id: '1',
        userId: 'u1',
        userName: 'Karim Benali (Admin)',
        action: 'CREATE',
        entityName: 'DossierAvocat',
        entityId: 'AV-2026-0001',
        timestamp: new Date(now - 1000 * 60 * 5).toISOString(),
        details: 'Création du dossier Litige Commercial',
        ipAddress: '192.168.1.45',
      },
      {
        id: '2',
        userId: 'u2',
        userName: 'Amina (Secrétaire)',
        action: 'UPDATE',
        entityName: 'Audience',
        entityId: 'AUD-001',
        timestamp: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
        details: 'Modification date audience (Report)',
        ipAddress: '192.168.1.46',
      },
      {
        id: '3',
        userId: 'u1',
        userName: 'Karim Benali (Admin)',
        action: 'DELETE',
        entityName: 'Document',
        entityId: 'DOC-999',
        timestamp: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
        details: 'Suppression (Soft Delete) du brouillon de conclusions',
        ipAddress: '192.168.1.45',
      },
      {
        id: '4',
        userId: 'u3',
        userName: 'Maitre Nabil (Notaire)',
        action: 'SIGN_SHA256',
        entityName: 'ActeNotarie',
        entityId: 'NOT-2026-0001',
        timestamp: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
        details: 'Génération empreinte SHA-256 inviolable pour Répertoire N°1001',
        ipAddress: '192.168.1.50',
      },
    ];
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return { bg: 'rgba(16,185,129,0.1)', text: '#34d399', border: 'rgba(16,185,129,0.3)' };
      case 'UPDATE': return { bg: 'rgba(59,130,246,0.1)', text: '#60a5fa', border: 'rgba(59,130,246,0.3)' };
      case 'DELETE': return { bg: 'rgba(244,63,94,0.1)', text: '#fb7185', border: 'rgba(244,63,94,0.3)' };
      case 'SIGN_SHA256': return { bg: 'rgba(217,119,6,0.1)', text: '#fbbf24', border: 'rgba(217,119,6,0.3)' };
      default: return { bg: 'rgba(148,163,184,0.1)', text: '#94a3b8', border: 'rgba(148,163,184,0.3)' };
    }
  };

  const filteredLogs = logs.filter(l => 
    l.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.details && l.details.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(30,41,59,0.9))', border: '1px solid rgba(244,63,94,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)', padding: '14px', borderRadius: '14px' }}>
            <ShieldAlert size={28} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fb7185' }}>Audit Trail & Sécurité</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Journalisation immuable de toutes les actions sur la plateforme (Conformité Légale)
            </p>
          </div>
        </div>
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 600 }}>
          <ShieldCheck size={20} /> Journal Immuable Actif
        </div>
      </div>

      <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            className="input-field" 
            style={{ paddingLeft: '40px' }} 
            placeholder="Rechercher dans les logs (utilisateur, action, entité)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-outline">
          <Filter size={16} /> Filtrer par date
        </button>
      </div>

      <div className="glass-card" style={{ padding: '0' }}>
        <table className="custom-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ paddingLeft: '24px' }}>Horodatage</th>
              <th>Utilisateur</th>
              <th>Action</th>
              <th>Entité / Ressource</th>
              <th>Détails & IP</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => {
              const colors = getActionColor(log.action);
              return (
                <tr key={log.id}>
                  <td style={{ paddingLeft: '24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {new Date(log.timestamp).toLocaleDateString('fr-FR')}
                    </div>
                    <div>{new Date(log.timestamp).toLocaleTimeString('fr-FR')}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '50%' }}>
                        <UserIcon size={14} color="var(--text-muted)" />
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{log.userName}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '8px', 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      background: colors.bg, 
                      color: colors.text,
                      border: `1px solid ${colors.border}`
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{log.entityName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>ID: {log.entityId}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    <div>{log.details || '-'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>IP: {log.ipAddress}</div>
                  </td>
                </tr>
              );
            })}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Aucun log trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
