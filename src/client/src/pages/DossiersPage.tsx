import React, { useEffect, useState } from 'react';
import { FolderKanban, Plus, Filter } from 'lucide-react';
import { api } from '../services/api';
import type { Dossier, ModuleType, ClientTiers } from '../types';
import type { Language } from '../i18n';
import { translations } from '../i18n';

interface DossiersPageProps {
  currentLang: Language;
  activeModules: ModuleType[];
}

export const DossiersPage: React.FC<DossiersPageProps> = ({ currentLang, activeModules }) => {
  const t = translations[currentLang];
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [clients, setClients] = useState<ClientTiers[]>([]);
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('');

  const [showModal, setShowModal] = useState(false);

  // New Dossier Form
  const [title, setTitle] = useState('');
  const [titleArabic, setTitleArabic] = useState('');
  const [description, setDescription] = useState('');
  const [moduleType, setModuleType] = useState<ModuleType>(activeModules[0] || 'Avocat');
  const [clientId, setClientId] = useState('');

  // Sub-module specific fields
  // Avocat
  const [juridiction, setJuridiction] = useState("Cour d'Alger");
  const [numeroRole, setNumeroRole] = useState('00123/2026');
  const [adversaire, setAdversaire] = useState('');

  // Notaire
  const [objetActe, setObjetActe] = useState('Vente Immobilière');
  const [valeurDeclaree, setValeurDeclaree] = useState(15000000);

  // Huissier
  const [partieSignifiee, setPartieSignifiee] = useState('');
  const [adresseSignification, setAdresseSignification] = useState('');

  // Écrivain
  const [intitulePrestation, setIntitulePrestation] = useState('Redaction Demande');

  useEffect(() => {
    fetchDossiers();
    fetchClients();
  }, [selectedModuleFilter]);

  const fetchDossiers = async () => {
    try {
      const res = await api.get('/dossiers', { params: { module: selectedModuleFilter || undefined } });
      if (res.data.success) {
        setDossiers(res.data.data.items);
      }
    } catch (err) {
      console.error('Failed to fetch dossiers', err);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await api.get('/clientsTiers');
      if (res.data.success) {
        setClients(res.data.data.items);
        if (res.data.data.items.length > 0) {
          setClientId(res.data.data.items[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch clients', err);
    }
  };

  const handleCreateDossier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        title,
        titleArabic,
        description,
        moduleType,
        clientId,
      };

      if (moduleType === 'Avocat') {
        payload.avocatDetails = {
          typeAffaire: 'Commercial',
          juridiction,
          chambre: '1ère Chambre',
          numeroRole,
          adversaire,
          avocatAdversaire: 'Me Khelifi',
          demandeurDefendeur: 'Demandeur',
        };
      } else if (moduleType === 'Notaire') {
        payload.notaireDetails = {
          typeActe: 'VenteImmobiliere',
          formeActe: 'Minute',
          objetActe,
          objetActeArabe: titleArabic,
          valeurDeclaree: Number(valeurDeclaree),
          droitsEnregistrement: Number(valeurDeclaree) * 0.05,
          autresPartiesNIN: '1980160100999888',
        };
      } else if (moduleType === 'Huissier') {
        payload.huissierDetails = {
          typeActe: 'Signification',
          partieRequérante: 'Client Requérant',
          partieSignifiée: partieSignifiee,
          adresseSignification,
          qualiteRecepteur: 'En personne',
          contingencePV: titleArabic || 'محضر تبليغ رسمي معذرة بالوفاء',
          honoraireReglementaire: 2500,
          droitDEnregistrement: 500,
          fraisDeDeplacement: 1000,
        };
      } else if (moduleType === 'EcrivainPublic') {
        payload.ecrivainDetails = {
          typePrestation: 'RedactionCourrier',
          intitulePrestation,
          destinataireAdministration: 'Wilaya d\'Alger',
          documentTemplateUtilise: 'Demande_Visa_Standard',
          tarifPrestation: 1500,
        };
      }

      const res = await api.post('/dossiers', payload);
      if (res.data.success) {
        setShowModal(false);
        fetchDossiers();
      }
    } catch (err) {
      alert('Erreur lors de la création du dossier');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FolderKanban color="var(--accent-purple)" /> {t.dossiers}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Tous les dossiers selon vos modules métiers activés
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> {t.newDossier}
        </button>
      </div>

      {/* Filter by Module */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Filter size={16} color="var(--text-muted)" />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Filtrer par module:</span>
        <button className={`btn-outline ${selectedModuleFilter === '' ? 'btn-primary' : ''}`} onClick={() => setSelectedModuleFilter('')}>
          Tous
        </button>
        {activeModules.map((mod) => (
          <button
            key={mod}
            className={`btn-outline ${selectedModuleFilter === mod ? 'btn-primary' : ''}`}
            onClick={() => setSelectedModuleFilter(mod)}
          >
            {mod}
          </button>
        ))}
      </div>

      {/* Dossiers Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Code Dossier</th>
              <th>Intitulé (FR / AR)</th>
              <th>Module</th>
              <th>Client</th>
              <th>Détails Métier Spécifiques</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {dossiers.map((d) => (
              <tr key={d.id}>
                <td style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{d.code}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{d.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-gold)', direction: 'rtl' }}>{d.titleArabic}</div>
                </td>
                <td>
                  <span className={`badge badge-${d.moduleType.toLowerCase()}`}>
                    {d.moduleType}
                  </span>
                </td>
                <td>{d.clientName}</td>
                <td>
                  {d.avocatDetails && (
                    <div style={{ fontSize: '0.8rem' }}>
                      <div>⚖️ <strong>{d.avocatDetails.juridiction}</strong> (Rôle: {d.avocatDetails.numeroRole})</div>
                      <div style={{ color: 'var(--text-muted)' }}>vs {d.avocatDetails.adversaire}</div>
                    </div>
                  )}
                  {d.notaireDetails && (
                    <div style={{ fontSize: '0.8rem' }}>
                      <div>📜 Répertoire N°: <strong style={{ color: '#fbbf24' }}>{d.notaireDetails.numeroRepertoire}</strong></div>
                      <div style={{ color: 'var(--accent-emerald)' }}>Valeur: {d.notaireDetails.valeurDeclaree.toLocaleString()} DZD</div>
                    </div>
                  )}
                  {d.huissierDetails && (
                    <div style={{ fontSize: '0.8rem' }}>
                      <div>⚖️ PV N°: <strong>{d.huissierDetails.numeroPV}</strong> ({d.huissierDetails.langueObligatoire})</div>
                      <div style={{ color: 'var(--text-muted)' }}>Signifié à: {d.huissierDetails.partieSignifiée}</div>
                    </div>
                  )}
                  {d.ecrivainDetails && (
                    <div style={{ fontSize: '0.8rem' }}>
                      <div>✍️ {d.ecrivainDetails.intitulePrestation}</div>
                    </div>
                  )}
                </td>
                <td>
                  <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal New Dossier */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '560px', padding: '30px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>{t.newDossier}</h3>

            <form onSubmit={handleCreateDossier} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Module Métier Concerné</label>
                <select className="input-field" value={moduleType} onChange={(e) => setModuleType(e.target.value as ModuleType)}>
                  {activeModules.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Client / Moussadir</label>
                <select className="input-field" value={clientId} onChange={(e) => setClientId(e.target.value)} required>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.fullName} ({c.personType === 'Physique' ? `NIN: ${c.nin || 'N/A'}` : `RC: ${c.registerCommerceNumber || 'N/A'}`})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Intitulé du Dossier (Français)</label>
                <input className="input-field" placeholder="Ex: Litige Commercial" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Intitulé du Dossier (Arabe)</label>
                <input className="input-field" style={{ direction: 'rtl' }} placeholder="عنوان القضية بالعربية" value={titleArabic} onChange={(e) => setTitleArabic(e.target.value)} required />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Description & Observations</label>
                <textarea className="input-field" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              {/* Module-Specific Fields */}
              {moduleType === 'Avocat' && (
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#60a5fa', marginBottom: '12px' }}>⚖️ Champs Spécifiques Avocat</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem' }}>Juridiction</label>
                      <input className="input-field" value={juridiction} onChange={(e) => setJuridiction(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem' }}>Numéro de Rôle</label>
                      <input className="input-field" value={numeroRole} onChange={(e) => setNumeroRole(e.target.value)} />
                    </div>
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '0.8rem' }}>Partie Adverse</label>
                    <input className="input-field" placeholder="Nom de l'adversaire" value={adversaire} onChange={(e) => setAdversaire(e.target.value)} />
                  </div>
                </div>
              )}

              {moduleType === 'Notaire' && (
                <div style={{ background: 'rgba(217, 119, 6, 0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(217, 119, 6, 0.3)' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#fbbf24', marginBottom: '12px' }}>📜 Champs Spécifiques Notaire</h4>
                  <div>
                    <label style={{ fontSize: '0.8rem' }}>Objet de l'Acte</label>
                    <input className="input-field" value={objetActe} onChange={(e) => setObjetActe(e.target.value)} />
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '0.8rem' }}>Valeur Déclarée du Contrat (DZD)</label>
                    <input className="input-field" type="number" value={valeurDeclaree} onChange={(e) => setValeurDeclaree(Number(e.target.value))} />
                  </div>
                </div>
              )}

              {moduleType === 'Huissier' && (
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#34d399', marginBottom: '12px' }}>⚖️ Champs Spécifiques Huissier (En Arabe)</h4>
                  <div>
                    <label style={{ fontSize: '0.8rem' }}>Partie Signifiée (المبلغ له)</label>
                    <input className="input-field" value={partieSignifiee} onChange={(e) => setPartieSignifiee(e.target.value)} />
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '0.8rem' }}>Adresse de Signification</label>
                    <input className="input-field" value={adresseSignification} onChange={(e) => setAdresseSignification(e.target.value)} />
                  </div>
                </div>
              )}

              {moduleType === 'EcrivainPublic' && (
                <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#a78bfa', marginBottom: '12px' }}>✍️ Champs Spécifiques Écrivain Public</h4>
                  <div>
                    <label style={{ fontSize: '0.8rem' }}>Intitulé de la Prestation</label>
                    <input className="input-field" value={intitulePrestation} onChange={(e) => setIntitulePrestation(e.target.value)} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn-primary">Créer le Dossier</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
