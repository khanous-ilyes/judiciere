import React, { useEffect, useState } from 'react';
import { Receipt } from 'lucide-react';
import { api } from '../services/api';
import type { Facture } from '../types';
import type { Language } from '../i18n';
import { translations } from '../i18n';

interface FacturesPageProps {
  currentLang: Language;
}

export const FacturesPage: React.FC<FacturesPageProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [factures, setFactures] = useState<Facture[]>([]);

  useEffect(() => {
    fetchFactures();
  }, []);

  const fetchFactures = async () => {
    try {
      const res = await api.get('/factures');
      if (res.data.success) {
        setFactures(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch factures', err);
    }
  };

  const handleRecordPayment = async (id: string, amount: number) => {
    try {
      await api.post(`/factures/${id}/pay`, {
        amount,
        paymentMethod: 'Espèces',
        transactionReference: 'ENC-2026',
      });
      fetchFactures();
    } catch (err) {
      alert('Erreur lors du paiement');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981' }}>
            <Receipt size={24} /> {t.factures}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Gestion de la facturation et des honoraires en Dinars Algériens (DZD) avec calcul TVA 19%
          </p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Factures et Encaissements Clientèle</h3>

        <table className="custom-table">
          <thead>
            <tr>
              <th>N° Facture</th>
              <th>Client</th>
              <th>Date d'Émission</th>
              <th>Montant HT</th>
              <th>TVA (19%)</th>
              <th>Montant Total (TTC DZD)</th>
              <th>Statut Paiement</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {factures.map((f) => (
              <tr key={f.id}>
                <td style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{f.invoiceNumber}</td>
                <td>{f.clientName}</td>
                <td>{new Date(f.issueDate).toLocaleDateString(currentLang === 'ar' ? 'ar-DZ' : 'fr-FR')}</td>
                <td>{f.subTotal.toLocaleString()} DZD</td>
                <td>{f.taxAmount.toLocaleString()} DZD</td>
                <td style={{ fontWeight: 800, color: '#fbbf24' }}>{f.totalAmount.toLocaleString()} DZD</td>
                <td>
                  <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, background: f.status === 'Completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: f.status === 'Completed' ? '#34d399' : '#fbbf24' }}>
                    {f.status === 'Completed' ? 'Réglée' : 'En Attente'}
                  </span>
                </td>
                <td>
                  {f.status !== 'Completed' && (
                    <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => handleRecordPayment(f.id, f.balanceDue)}>
                      Encaisser ({f.balanceDue.toLocaleString()} DZD)
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
