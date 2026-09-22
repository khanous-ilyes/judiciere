import React, { useEffect, useState } from 'react';
import { Calculator, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import type { Dossier } from '../types';
import type { Language } from '../i18n';
import { translations } from '../i18n';

interface HuissierPageProps {
  currentLang: Language;
}

export const HuissierPage: React.FC<HuissierPageProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [actes, setActes] = useState<Dossier[]>([]);

  // Fee calculator
  const [selectedType, setSelectedType] = useState('Signification');
  const [baseTarif, setBaseTarif] = useState(2500);
  const [deplacement, setDeplacement] = useState(1000);
  const [enregistrement, setEnregistrement] = useState(500);

  useEffect(() => {
    fetchActesHuissier();
  }, []);

  const fetchActesHuissier = async () => {
    try {
      const res = await api.get('/dossiers', { params: { module: 'Huissier' } });
      if (res.data.success) {
        setActes(res.data.data.items);
      }
    } catch (err) {
      console.error('Failed to fetch huissier acts', err);
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    if (type === 'Signification') setBaseTarif(2500);
    else if (type === 'Sommation') setBaseTarif(4000);
    else if (type === 'PVCarence') setBaseTarif(5000);
    else if (type === 'Saisie') setBaseTarif(8000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Arabic Requirement Alert Banner */}
      <div className="glass-card" style={{ padding: '20px 24px', background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(30,41,59,0.9))', border: '1px solid rgba(16,185,129,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <AlertCircle size={26} color="#34d399" />
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>{t.arabeMandatoryNote}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              قانون رقم 06-03 المعدل والمتمم بالقانون رقم 23-13 — يجب تحرير المحاضر والأوراق القضائية باللغة العربية تحت طائلة البطلان.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Actes Huissier List */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>محاضر التبليغ والتنفيذ (سجل المحضر القضائي)</h3>

          <table className="custom-table">
            <thead>
              <tr>
                <th>رقم المحضر</th>
                <th>تاريخ وساعة التبليغ</th>
                <th>الشخص المكتلف بالتنفيذ / المبلغ له</th>
                <th>نوع المحضر والتكليف</th>
                <th>المبلغ الإجمالي (دج)</th>
              </tr>
            </thead>
            <tbody>
              {actes.map((d) => {
                const h = d.huissierDetails;
                return (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 800, color: '#34d399' }}>#{h?.numeroPV || 501}</td>
                    <td>{new Date(d.openingDate).toLocaleDateString('ar-DZ')} ({h?.heureSignification || '09:30'})</td>
                    <td>
                      <div style={{ fontWeight: 600, direction: 'rtl' }}>{h?.partieSignifiée || d.clientName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', direction: 'rtl' }}>{h?.adresseSignification || 'الجزائر'}</div>
                    </td>
                    <td>
                      <span className="badge badge-huissier">
                        {h?.typeActe || 'تبليغ رسمي'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--text-gold)' }}>
                      {h?.totalDZD ? h.totalDZD.toLocaleString() : '4,000'} دج
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Official Fee Calculator DZD */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24' }}>
            <Calculator size={20} /> {t.baremeLegal}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            حاسبة أتعاب المحضر القضائي طبقاً للتعريفة الرسمية المحددة في المرسوم التنفيذي
          </p>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>نوع المحضر / الإجراء</label>
            <select className="input-field" value={selectedType} onChange={(e) => handleTypeChange(e.target.value)}>
              <option value="Signification">تبليغ حكم / عقد (2,500 دج)</option>
              <option value="Sommation">إعذار استجوابي (4,000 دج)</option>
              <option value="PVCarence">محضر عدم وجود / معاينة (5,000 دج)</option>
              <option value="Saisie">حجز تنفيذي (8,000 دج + نسب متغيرة)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>مصاريف التنقل (دج)</label>
            <input className="input-field" type="number" value={deplacement} onChange={(e) => setDeplacement(Number(e.target.value))} />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>حقوق التسجيل والطابع (دج)</label>
            <input className="input-field" type="number" value={enregistrement} onChange={(e) => setEnregistrement(Number(e.target.value))} />
          </div>

          <div style={{ background: 'rgba(217, 119, 6, 0.15)', border: '1px solid rgba(217, 119, 6, 0.4)', padding: '16px', borderRadius: '12px', textAlign: 'center', marginTop: '10px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>المجموع الواجب تحصيله</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
              {(baseTarif + deplacement + enregistrement).toLocaleString()} دج
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
