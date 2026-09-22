import React, { useEffect, useState } from 'react';
import { Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import type { Dossier } from '../types';
import type { Language } from '../i18n';
import { translations } from '../i18n';

interface NotairePageProps {
  currentLang: Language;
}

export const NotairePage: React.FC<NotairePageProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [actes, setActes] = useState<Dossier[]>([]);

  useEffect(() => {
    fetchActesNotaries();
  }, []);

  const fetchActesNotaries = async () => {
    try {
      const res = await api.get('/dossiers', { params: { module: 'Notaire' } });
      if (res.data.success) {
        setActes(res.data.data.items);
      }
    } catch (err) {
      console.error('Failed to fetch notary acts', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(217,119,6,0.2), rgba(30,41,59,0.9))', border: '1px solid rgba(217,119,6,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={24} /> {t.repertoireInviolable}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Conforme à la Loi n° 06-02 encadrant le notariat en Algérie — Numérotation chronologique continue, horodatage certifié et empreinte SHA-256.
            </p>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 600 }}>
            <ShieldCheck size={20} /> Registre Coté & Paraphé
          </div>
        </div>
      </div>

      {/* Actes Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Répertoire des Actes Authenticité Notariale</h3>

        <table className="custom-table">
          <thead>
            <tr>
              <th>N° Répertoire Légual</th>
              <th>Date de l'Acte</th>
              <th>Intitulé de l'Acte (FR / AR)</th>
              <th>Parties & Parties NIN</th>
              <th>Valeur Déclarée (DZD)</th>
              <th>Droits d'Enregistrement</th>
              <th>Empreinte SHA-256 d'Intégrité</th>
            </tr>
          </thead>
          <tbody>
            {actes.map((d) => {
              const details = d.notaireDetails;
              return (
                <tr key={d.id}>
                  <td style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fbbf24' }}>
                    #{details?.numeroRepertoire || '1001'}
                  </td>
                  <td>{new Date(d.openingDate).toLocaleDateString(currentLang === 'ar' ? 'ar-DZ' : 'fr-FR')}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{d.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-gold)', direction: 'rtl' }}>{details?.objetActeArabe || d.titleArabic}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{d.clientName}</div>
                    {details?.autresPartiesNIN && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NIN: {details.autresPartiesNIN}</div>
                    )}
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
                    {details ? details.valeurDeclaree.toLocaleString() : 0} DZD
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {details ? details.droitsEnregistrement.toLocaleString() : 0} DZD
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '6px', fontFamily: 'monospace' }}>
                      <CheckCircle2 size={12} /> {details?.codeRepertoireInviolable?.substring(0, 16) || 'SHA256-INVIOLABLE'}...
                    </div>
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
