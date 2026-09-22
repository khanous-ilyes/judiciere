import React, { useEffect, useState } from 'react';
import { Gavel, Calendar } from 'lucide-react';
import { api } from '../services/api';
import type { Dossier } from '../types';
import type { Language } from '../i18n';
import { translations } from '../i18n';

interface AvocatPageProps {
  currentLang: Language;
}

export const AvocatPage: React.FC<AvocatPageProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [dossiers, setDossiers] = useState<Dossier[]>([]);

  useEffect(() => {
    fetchAvocatDossiers();
  }, []);

  const fetchAvocatDossiers = async () => {
    try {
      const res = await api.get('/dossiers', { params: { module: 'Avocat' } });
      if (res.data.success) {
        setDossiers(res.data.data.items);
      }
    } catch (err) {
      console.error('Failed to fetch lawyer dossiers', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', color: '#60a5fa' }}>
            <Gavel size={24} /> {t.avocat} — Rôle des Audiences & Procédures (Loi 13-07)
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Suivi des affaires juridictionnelles (Civil, Commercial, Pénal, Administratif, Famille)
          </p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Calendrier & Rôle des Audiences</h3>

        <table className="custom-table">
          <thead>
            <tr>
              <th>N° Rôle Affaire</th>
              <th>Intitulé du Litige</th>
              <th>Juridiction & Chambre</th>
              <th>Partie Adverse</th>
              <th>Prochaine Audience</th>
              <th>Action / Procédure</th>
            </tr>
          </thead>
          <tbody>
            {dossiers.map((d) => {
              const a = d.avocatDetails;
              return (
                <tr key={d.id}>
                  <td style={{ fontWeight: 700, color: '#60a5fa' }}>{a?.numeroRole || '00452/2026'}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{d.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-gold)', direction: 'rtl' }}>{d.titleArabic}</div>
                  </td>
                  <td>
                    <div>{a?.juridiction || "Cour d'Alger"}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a?.chambre || 'Chambre Commerciale'}</div>
                  </td>
                  <td>{a?.adversaire || 'SONATRAM Spa'}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontWeight: 600 }}>
                      <Calendar size={14} /> dans 7 jours
                    </div>
                  </td>
                  <td>
                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
                      Plaidoirie sur le fond
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
