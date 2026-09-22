import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, AlertCircle, CheckCircle, X } from 'lucide-react';
import { api } from '../services/api';
import type { Language } from '../i18n';

interface AgendaPageProps {
  currentLang: Language;
}

interface Evenement {
  id: string;
  title: string;
  titleArabic: string;
  startDate: string;
  endDate?: string;
  location?: string;
  eventType?: string;
  relatedDossierCode?: string;
  notes?: string;
  isDone: boolean;
}

const eventTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  Audience:    { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa', border: 'rgba(59,130,246,0.4)' },
  RDV:         { bg: 'rgba(139,92,246,0.15)', text: '#a78bfa', border: 'rgba(139,92,246,0.4)' },
  Delai:       { bg: 'rgba(244,63,94,0.15)', text: '#fb7185', border: 'rgba(244,63,94,0.4)' },
  Deliberation:{ bg: 'rgba(217,119,6,0.15)', text: '#fbbf24', border: 'rgba(217,119,6,0.4)' },
  Autre:       { bg: 'rgba(16,185,129,0.15)', text: '#34d399', border: 'rgba(16,185,129,0.4)' },
};

export const AgendaPage: React.FC<AgendaPageProps> = ({ currentLang: _currentLang }) => {
  const [events, setEvents] = useState<Evenement[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'today'>('upcoming');

  // Form state
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [startDate, setStartDate] = useState('');
  const [location, setLocation] = useState('');
  const [eventType, setEventType] = useState('Audience');
  const [notes, setNotes] = useState('');
  const [relatedCode, setRelatedCode] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/evenements');
      if (res.data?.success) {
        setEvents(res.data.data || []);
      } else {
        // Demo data
        setEvents(getDemoEvents());
      }
    } catch {
      setEvents(getDemoEvents());
    }
  };

  const getDemoEvents = (): Evenement[] => {
    const now = new Date();
    return [
      {
        id: '1',
        title: "Audience - Litige Commercial BATIMEX vs SONATRAM",
        titleArabic: "جلسة - نزاع تجاري شركة باتيمكس ضد سوناترام",
        startDate: new Date(now.getTime() + 7 * 86400000).toISOString(),
        location: "Cour d'Alger - Salle 4",
        eventType: "Audience",
        relatedDossierCode: "AV-2026-0001",
        isDone: false,
      },
      {
        id: '2',
        title: "Délai de plaidoirie — Chambre 2ème Commerciale",
        titleArabic: "أجل المرافعة — الغرفة التجارية الثانية",
        startDate: new Date(now.getTime() + 14 * 86400000).toISOString(),
        location: "Cour d'Alger",
        eventType: "Delai",
        isDone: false,
      },
      {
        id: '3',
        title: "RDV Client — Signature Acte de Vente Appartement Hydra",
        titleArabic: "موعد موكل — توقيع عقد بيع شقة حيدرة",
        startDate: new Date(now.getTime() + 2 * 86400000).toISOString(),
        location: "Étude Notariale",
        eventType: "RDV",
        relatedDossierCode: "NOT-2026-0001",
        isDone: false,
      },
      {
        id: '4',
        title: "Délibéré — Chambre Civile N°3",
        titleArabic: "المداولة — الغرفة المدنية رقم 3",
        startDate: new Date(now.getTime() + 30 * 86400000).toISOString(),
        location: "Tribunal de Dar El Beida",
        eventType: "Deliberation",
        isDone: false,
      },
      {
        id: '5',
        title: "Signification exécutée — Jugement 124/2026",
        titleArabic: "تبليغ منجز — حكم رقم 124/2026",
        startDate: new Date(now.getTime() - 3 * 86400000).toISOString(),
        location: "Zone Industrielle Rouiba",
        eventType: "Audience",
        relatedDossierCode: "HUI-2026-0001",
        isDone: true,
      },
    ];
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/evenements', { title, titleArabic: titleAr, startDate, location, eventType, notes, relatedDossierCode: relatedCode });
      setShowModal(false);
      fetchEvents();
    } catch {
      // Add locally
      const newEv: Evenement = { id: Date.now().toString(), title, titleArabic: titleAr, startDate, location, eventType, notes, relatedDossierCode: relatedCode, isDone: false };
      setEvents(prev => [newEv, ...prev]);
      setShowModal(false);
    }
    setTitle(''); setTitleAr(''); setStartDate(''); setLocation(''); setNotes(''); setRelatedCode('');
  };

  const handleToggleDone = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, isDone: !e.isDone } : e));
  };

  const now = new Date();
  const filteredEvents = events
    .filter(e => {
      const d = new Date(e.startDate);
      if (filter === 'today') return d.toDateString() === now.toDateString();
      if (filter === 'upcoming') return d >= now && !e.isDone;
      return true;
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const upcomingCount = events.filter(e => !e.isDone && new Date(e.startDate) >= now).length;
  const todayCount = events.filter(e => !e.isDone && new Date(e.startDate).toDateString() === now.toDateString()).length;
  const doneCount = events.filter(e => e.isDone).length;



  const getDaysUntil = (iso: string) => {
    const diff = new Date(iso).getTime() - now.getTime();
    const days = Math.ceil(diff / 86400000);
    if (days < 0) return `il y a ${Math.abs(days)}j`;
    if (days === 0) return "Aujourd'hui !";
    if (days === 1) return "Demain";
    return `Dans ${days} jours`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(30,41,59,0.9))', border: '1px solid rgba(139,92,246,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', padding: '14px', borderRadius: '14px' }}>
            <Calendar size={28} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a78bfa' }}>Agenda Judiciaire</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Calendrier des audiences, délais procéduraux et rendez-vous — الروزنامة القضائية
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-outline" onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')} style={{ fontSize: '0.85rem' }}>
            {viewMode === 'list' ? '📅 Vue Calendrier' : '📋 Vue Liste'}
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)} style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
            <Plus size={16} /> Nouvel Événement
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {[
          { label: 'Événements à venir', value: upcomingCount, color: '#a78bfa', icon: '📅' },
          { label: "Aujourd'hui", value: todayCount, color: '#fbbf24', icon: '⚡' },
          { label: 'Réalisés', value: doneCount, color: '#34d399', icon: '✅' },
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '18px', textAlign: 'center', borderColor: `${stat.color}30` }}>
            <div style={{ fontSize: '1.8rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: stat.color, marginTop: '6px' }}>{stat.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {([['all', 'Tous'], ['upcoming', 'À venir'], ['today', "Aujourd'hui"]] as [typeof filter, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)} style={{ padding: '8px 16px', borderRadius: '10px', border: filter === key ? '1px solid #8b5cf6' : '1px solid var(--border-color)', background: filter === key ? 'rgba(139,92,246,0.2)' : 'transparent', color: filter === key ? '#a78bfa' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredEvents.length === 0 ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <div>Aucun événement trouvé</div>
          </div>
        ) : filteredEvents.map((ev) => {
          const colors = eventTypeColors[ev.eventType || 'Autre'] || eventTypeColors['Autre'];
          const daysLabel = getDaysUntil(ev.startDate);
          const isOverdue = new Date(ev.startDate) < now && !ev.isDone;
          return (
            <div key={ev.id} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px', borderLeft: `4px solid ${isOverdue ? '#f43f5e' : colors.text}`, opacity: ev.isDone ? 0.6 : 1, transition: 'all 0.2s' }}>
              {/* Date Block */}
              <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '12px 16px', textAlign: 'center', minWidth: '90px', flexShrink: 0 }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: colors.text }}>
                  {new Date(ev.startDate).getDate()}
                </div>
                <div style={{ fontSize: '0.75rem', color: colors.text, opacity: 0.8, fontWeight: 600 }}>
                  {new Date(ev.startDate).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {new Date(ev.startDate).toLocaleDateString('fr-FR', { year: 'numeric' })}
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700, background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
                    {ev.eventType}
                  </span>
                  {ev.relatedDossierCode && (
                    <span style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 600 }}>
                      📂 {ev.relatedDossierCode}
                    </span>
                  )}
                  {isOverdue && (
                    <span style={{ fontSize: '0.72rem', color: '#f43f5e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <AlertCircle size={12} /> EN RETARD
                    </span>
                  )}
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>{ev.title}</div>
                <div style={{ fontSize: '0.82rem', color: '#fbbf24', direction: 'rtl', marginBottom: '8px' }}>{ev.titleArabic}</div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {ev.location && <span>📍 {ev.location}</span>}
                  <span><Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />{new Date(ev.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span style={{ color: isOverdue ? '#f43f5e' : colors.text, fontWeight: 600 }}>{daysLabel}</span>
                </div>
                {ev.notes && <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>💬 {ev.notes}</div>}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => handleToggleDone(ev.id)} title={ev.isDone ? 'Marquer non-réalisé' : 'Marquer réalisé'}
                  style={{ padding: '8px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: ev.isDone ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)', color: ev.isDone ? '#34d399' : 'var(--text-muted)' }}>
                  <CheckCircle size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '520px', padding: '30px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#a78bfa' }}>➕ Nouvel Événement</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '5px' }}>Type d'événement</label>
                <select className="input-field" value={eventType} onChange={e => setEventType(e.target.value)}>
                  <option value="Audience">⚖️ Audience</option>
                  <option value="RDV">📅 Rendez-vous Client</option>
                  <option value="Delai">⏰ Délai procédural</option>
                  <option value="Deliberation">🔨 Délibéré</option>
                  <option value="Autre">📌 Autre</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '5px' }}>Intitulé (Français)</label>
                <input className="input-field" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Audience sur le fond" />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '5px' }}>العنوان بالعربية</label>
                <input className="input-field" style={{ direction: 'rtl' }} value={titleAr} onChange={e => setTitleAr(e.target.value)} placeholder="عنوان الموعد بالعربية" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '5px' }}>Date & Heure</label>
                  <input className="input-field" type="datetime-local" required value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '5px' }}>Code Dossier (opt.)</label>
                  <input className="input-field" value={relatedCode} onChange={e => setRelatedCode(e.target.value)} placeholder="AV-2026-0001" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '5px' }}>Lieu / Juridiction</label>
                <input className="input-field" value={location} onChange={e => setLocation(e.target.value)} placeholder="Cour d'Alger - Salle 4" />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '5px' }}>Notes</label>
                <textarea className="input-field" rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Observations, documents à préparer..." />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Annuler</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>Créer l'événement</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
