import React, { useEffect, useState } from 'react';
import { Users, Plus, Search } from 'lucide-react';
import { api } from '../services/api';
import type { ClientTiers, PersonType } from '../types';
import type { Language } from '../i18n';
import { translations } from '../i18n';

interface ClientsPageProps {
  currentLang: Language;
}

export const ClientsPage: React.FC<ClientsPageProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [clients, setClients] = useState<ClientTiers[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // New client state
  const [personType, setPersonType] = useState<PersonType>('Physique');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nin, setNin] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [rc, setRc] = useState('');
  const [nif, setNif] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [wilaya, setWilaya] = useState('Alger');

  useEffect(() => {
    fetchClients();
  }, [searchTerm]);

  const fetchClients = async () => {
    try {
      const res = await api.get('/clientsTiers', { params: { searchTerm } });
      if (res.data.success) {
        setClients(res.data.data.items);
      }
    } catch (err) {
      console.error('Failed to fetch clients', err);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/clientsTiers', {
        personType,
        firstName,
        lastName,
        nin,
        companyName,
        registerCommerceNumber: rc,
        nif,
        phone,
        email,
        address,
        wilaya,
      });

      if (res.data.success) {
        setShowModal(false);
        fetchClients();
        setFirstName(''); setLastName(''); setNin(''); setCompanyName(''); setRc(''); setPhone(''); setEmail(''); setAddress('');
      }
    } catch (err) {
      alert('Erreur lors de l\'ajout du client');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users color="var(--accent-blue)" /> {t.clients}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Gestion des personnes physiques et morales avec traçabilité NIN (Numéro d'Identification National)
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> {t.newClient}
        </button>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          className="input-field"
          style={{ paddingLeft: '44px' }}
          placeholder="Rechercher par nom, NIN, Registre du Commerce..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Clients Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nom / Raison Sociale</th>
              <th>Type</th>
              <th>Identifiant Légal (NIN / RC)</th>
              <th>Téléphone</th>
              <th>Wilaya / Commune</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: 700 }}>{c.fullName}</div>
                  {c.personType === 'Morale' && c.companyName && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-blue)' }}>Société: {c.companyName}</div>
                  )}
                </td>
                <td>
                  <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, background: c.personType === 'Physique' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(139, 92, 246, 0.2)', color: c.personType === 'Physique' ? '#60a5fa' : '#a78bfa' }}>
                    {c.personType === 'Physique' ? 'Physique' : 'Morale'}
                  </span>
                </td>
                <td>
                  {c.personType === 'Physique' ? (
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NIN: </span>
                      <span style={{ fontWeight: 600, color: 'var(--text-gold)' }}>{c.nin || 'Non renseigné'}</span>
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>RC: </span>
                      <span style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>{c.registerCommerceNumber || 'N/A'}</span>
                    </div>
                  )}
                </td>
                <td>{c.phone}</td>
                <td>{c.wilaya} {c.commune ? `- ${c.commune}` : ''}</td>
                <td>{c.email || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Add Client */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '540px', padding: '30px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>{t.newClient}</h3>

            <form onSubmit={handleCreateClient} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Type de Personne</label>
                <select className="input-field" value={personType} onChange={(e) => setPersonType(e.target.value as PersonType)}>
                  <option value="Physique">Personne Physique (فرد)</option>
                  <option value="Morale">Personne Morale / Entreprise (شركة)</option>
                </select>
              </div>

              {personType === 'Physique' ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Prénom</label>
                      <input className="input-field" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Nom</label>
                      <input className="input-field" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>NIN (Numéro d'Identification National - 18 chiffres)</label>
                    <input className="input-field" placeholder="198516010023456789" value={nin} onChange={(e) => setNin(e.target.value)} required />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Raison Sociale / Nom Société</label>
                    <input className="input-field" placeholder="SARL BATIMEX" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Registre Commerce (RC)</label>
                      <input className="input-field" placeholder="16/00-12345B24" value={rc} onChange={(e) => setRc(e.target.value)} required />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>NIF</label>
                      <input className="input-field" placeholder="002416001234567" value={nif} onChange={(e) => setNif(e.target.value)} />
                    </div>
                  </div>
                </>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Téléphone</label>
                  <input className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Email</label>
                  <input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Wilaya</label>
                  <input className="input-field" value={wilaya} onChange={(e) => setWilaya(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Commune / Adresse</label>
                  <input className="input-field" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
