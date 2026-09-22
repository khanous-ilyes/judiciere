import React, { useEffect, useState } from 'react';
import { FileText, Download, Eye, Upload, Filter, Search } from 'lucide-react';
import { api } from '../services/api';
import type { Language } from '../i18n';

interface DocumentsPageProps {
  currentLang: Language;
}

interface Document {
  id: string;
  title: string;
  titleArabic: string;
  documentType: string;
  filePath: string;
  fileSizeBytes: number;
  createdAt: string;
  relatedDossierCode?: string;
  uploadedBy?: string;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({ currentLang: _currentLang }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Tous');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/documents');
      if (res.data?.success) {
        setDocuments(res.data.data || []);
      } else {
        setDocuments(getDemoDocuments());
      }
    } catch {
      setDocuments(getDemoDocuments());
    }
  };

  const getDemoDocuments = (): Document[] => [
    {
      id: '1',
      title: 'Conclusions en réponse - Affaire BATIMEX',
      titleArabic: 'مذكرة جوابية - قضية باتيمكس',
      documentType: 'Conclusions',
      filePath: '/docs/conclusions_batimex.pdf',
      fileSizeBytes: 1048576 * 2.5, // 2.5 MB
      createdAt: new Date().toISOString(),
      relatedDossierCode: 'AV-2026-0001',
      uploadedBy: 'Karim Benali',
    },
    {
      id: '2',
      title: 'Acte de Vente - Appartement Hydra',
      titleArabic: 'عقد بيع - شقة حيدرة',
      documentType: 'Minute',
      filePath: '/docs/acte_vente_hydra.pdf',
      fileSizeBytes: 1048576 * 1.2, // 1.2 MB
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      relatedDossierCode: 'NOT-2026-0001',
      uploadedBy: 'Karim Benali',
    },
    {
      id: '3',
      title: 'PV de Signification - Jugement 124',
      titleArabic: 'محضر تبليغ - حكم 124',
      documentType: 'PV',
      filePath: '/docs/pv_signification_124.pdf',
      fileSizeBytes: 1048576 * 0.8, // 0.8 MB
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      relatedDossierCode: 'HUI-2026-0001',
      uploadedBy: 'Karim Benali',
    },
    {
      id: '4',
      title: 'Facture Honoraires N° FAC-2026-015',
      titleArabic: 'فاتورة أتعاب رقم FAC-2026-015',
      documentType: 'FacturePDF',
      filePath: '/docs/fac_2026_015.pdf',
      fileSizeBytes: 1024 * 450, // 450 KB
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      relatedDossierCode: 'AV-2026-0001',
      uploadedBy: 'Comptabilité',
    },
  ];

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  const filteredDocs = documents.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (d.titleArabic && d.titleArabic.includes(searchTerm)) ||
                          (d.relatedDossierCode && d.relatedDossierCode.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'Tous' || d.documentType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(30,41,59,0.9))', border: '1px solid rgba(59,130,246,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', padding: '14px', borderRadius: '14px' }}>
            <FileText size={28} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#60a5fa' }}>GED & Documents</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Gestion Electronique des Documents (GED) — إدارة الوثائق الإلكترونية
            </p>
          </div>
        </div>
        <div>
          <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <Upload size={16} /> Uploader un document
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            className="input-field" 
            style={{ paddingLeft: '40px' }} 
            placeholder="Rechercher par nom, code dossier..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Filter size={18} color="var(--text-muted)" />
          <select className="input-field" style={{ width: '200px' }} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="Tous">Tous les types</option>
            <option value="Conclusions">Conclusions / Mémorandums</option>
            <option value="Minute">Minutes Notariales</option>
            <option value="PV">Procès-Verbaux (PV)</option>
            <option value="FacturePDF">Factures</option>
            <option value="PieceJointe">Pièces Jointes</option>
          </select>
        </div>
      </div>

      {/* Documents List */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Dossier Lié</th>
              <th>Type</th>
              <th>Taille</th>
              <th>Date d'ajout</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '10px', background: 'rgba(59,130,246,0.1)', borderRadius: '10px', color: '#60a5fa' }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{doc.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#fbbf24', direction: 'rtl' }}>{doc.titleArabic}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {doc.relatedDossierCode ? (
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#a78bfa', background: 'rgba(139,92,246,0.1)', padding: '4px 10px', borderRadius: '6px' }}>
                      {doc.relatedDossierCode}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>-</span>
                  )}
                </td>
                <td>
                  <span className="badge" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    {doc.documentType}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {formatSize(doc.fileSizeBytes)}
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
                  <div style={{ fontSize: '0.75rem' }}>par {doc.uploadedBy}</div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button className="btn-outline" style={{ padding: '8px', color: '#60a5fa', borderColor: 'rgba(59,130,246,0.3)' }} title="Aperçu">
                      <Eye size={16} />
                    </button>
                    <button className="btn-outline" style={{ padding: '8px', color: '#34d399', borderColor: 'rgba(16,185,129,0.3)' }} title="Télécharger">
                      <Download size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredDocs.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Aucun document trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
