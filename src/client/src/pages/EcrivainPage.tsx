import React, { useEffect, useState } from 'react';
import { PenTool } from 'lucide-react';
import { api } from '../services/api';
import type { Dossier } from '../types';
import type { Language } from '../i18n';
import { translations } from '../i18n';

interface EcrivainPageProps {
  currentLang: Language;
}

export const EcrivainPage: React.FC<EcrivainPageProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [prestations, setPrestations] = useState<Dossier[]>([]);

  useEffect(() => {
    fetchPrestations();
  }, []);

  const fetchPrestations = async () => {
    try {
      const res = await api.get('/dossiers', { params: { module: 'EcrivainPublic' } });
      if (res.data.success) {
        setPrestations(res.data.data.items);
      }
    } catch (err) {
      console.error('Failed to fetch public writer requests', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', color: '#a78bfa' }}>
            <PenTool size={24} /> {t.ecrivain} — Rédaction de Courriers & Formulaires
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Gestion souple et rapide des demandes administratives (CNAS, CASNOS, Wilaya, Visas)
          </p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Prestations & Demandes Clientèle</h3>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Client Beneficiaire</th>
              <th>Intitulé Prestation</th>
              <th>Administration Destinataire</th>
              <th>Tarif (DZD)</th>
              <th>Statut Livraison</th>
            </tr>
          </thead>
          <tbody>
            {prestations.map((d) => {
              const e = d.ecrivainDetails;
              return (
                <tr key={d.id}>
                  <td style={{ fontWeight: 600 }}>{d.clientName}</td>
                  <td>
                    <div>{d.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-gold)', direction: 'rtl' }}>{d.titleArabic}</div>
                  </td>
                  <td>{e?.destinataireAdministration || 'CNAS / Wilaya'}</td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
                    {e?.tarifPrestation || 1500} DZD
                  </td>
                  <td>
                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }}>
                      Prêt pour retrait
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
