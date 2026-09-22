import React, { useState } from 'react';
import { Scale } from 'lucide-react';
import { api } from '../services/api';
import type { User, ModuleType } from '../types';
import type { Language } from '../i18n';
import { translations } from '../i18n';

interface LoginPageProps {
  onLoginSuccess: (token: string, user: User, activeModules: ModuleType[]) => void;
  currentLang: Language;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, currentLang }) => {
  const t = translations[currentLang];
  const [isRegister, setIsRegister] = useState(false);

  // Login fields
  const [email, setEmail] = useState('maitre.benali@alinssaf-juridique.dz');
  const [password, setPassword] = useState('Cabinet123!');

  // Register fields
  const [cabinetName, setCabinetName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('Alger');
  const [primaryModule, setPrimaryModule] = useState<ModuleType>('Avocat');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const token = res.data.data.accessToken;
        const user: User = {
          id: res.data.data.userId,
          tenantId: res.data.data.tenantId,
          email: res.data.data.email,
          fullName: res.data.data.fullName,
          role: res.data.data.role,
          cabinetName: res.data.data.cabinetName,
        };
        const modules: ModuleType[] = res.data.data.activeModules || ['Avocat'];
        localStorage.setItem('jwt_token', token);
        onLoginSuccess(token, user, modules);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', {
        email,
        password,
        firstName,
        lastName,
        phone,
        cabinetName,
        wilaya,
        primaryModule,
      });

      if (res.data.success) {
        const token = res.data.data.accessToken;
        const user: User = {
          id: res.data.data.userId,
          tenantId: res.data.data.tenantId,
          email: res.data.data.email,
          fullName: res.data.data.fullName,
          role: res.data.data.role,
          cabinetName: res.data.data.cabinetName,
        };
        const modules: ModuleType[] = res.data.data.activeModules || [primaryModule];
        localStorage.setItem('jwt_token', token);
        onLoginSuccess(token, user, modules);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création du cabinet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 100px)', padding: '20px' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '460px', padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ background: 'linear-gradient(135deg, #d97706, #3b82f6)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <Scale size={32} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            {isRegister ? t.register : t.login}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {t.appSubtitle}
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.4)', color: '#f43f5e', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={isRegister ? handleRegister : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isRegister && (
            <>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Nom du Cabinet / Office</label>
                <input className="input-field" type="text" placeholder="Ex: Cabinet Me Benali" value={cabinetName} onChange={(e) => setCabinetName(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Prénom</label>
                  <input className="input-field" type="text" placeholder="Karim" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Nom</label>
                  <input className="input-field" type="text" placeholder="Benali" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Téléphone</label>
                  <input className="input-field" type="text" placeholder="0661234567" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Wilaya</label>
                  <input className="input-field" type="text" placeholder="Alger" value={wilaya} onChange={(e) => setWilaya(e.target.value)} required />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Profession / Module Principal</label>
                <select className="input-field" value={primaryModule} onChange={(e) => setPrimaryModule(e.target.value as ModuleType)}>
                  <option value="Avocat">Avocat (محامي)</option>
                  <option value="Notaire">Notaire (موثق)</option>
                  <option value="Huissier">Huissier de Justice (محضر قضائي)</option>
                  <option value="EcrivainPublic">Écrivain Public (كاتب عمومي)</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Email</label>
            <input className="input-field" type="email" placeholder="maitre@alinssaf-juridique.dz" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Mot de passe</label>
            <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px', padding: '14px' }} disabled={loading}>
            {loading ? 'Chargement...' : isRegister ? t.register : t.login}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
            {isRegister ? 'Déjà un compte ? Se connecter' : 'Nouveau cabinet ? Créer votre compte'}
          </button>
        </div>
      </div>
    </div>
  );
};
