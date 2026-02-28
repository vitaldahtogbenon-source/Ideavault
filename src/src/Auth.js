import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

  const handleAuth = async () => {
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else setMessage('Vérifie tes emails pour confirmer ton compte !');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0D0D0D',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Georgia, serif', color: '#F0EDE6'
    }}>
      <div style={{
        background: '#161616', border: '1px solid #2A2A2A',
        borderRadius: 24, padding: 40, width: 340
      }}>
        <h1 style={{
          margin: '0 0 8px',
          background: 'linear-gradient(135deg, #F0EDE6, #A78BFA)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>IdeaVault</h1>
        <p style={{ color: '#6B7280', marginBottom: 28 }}>
          {isLogin ? 'Bienvenue ! Connecte-toi.' : 'Crée ton compte gratuitement.'}
        </p>

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: '#0D0D0D', border: '1px solid #2A2A2A',
            borderRadius: 12, padding: '12px 16px',
            color: '#F0EDE6', fontSize: 15, fontFamily: 'Georgia, serif',
            marginBottom: 12, outline: 'none'
          }}
        />
        <input
          placeholder="Mot de passe"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: '#0D0D0D', border: '1px solid #2A2A2A',
            borderRadius: 12, padding: '12px 16px',
            color: '#F0EDE6', fontSize: 15, fontFamily: 'Georgia, serif',
            marginBottom: 20, outline: 'none'
          }}
        />

        {message && (
          <p style={{ color: '#FF6B6B', fontSize: 13, marginBottom: 16 }}>{message}</p>
        )}

        <button onClick={handleAuth} style={{
          width: '100%', background: 'linear-gradient(135deg, #FF6B6B, #A78BFA)',
          border: 'none', borderRadius: 12, padding: '14px',
          color: '#fff', fontSize: 16, fontFamily: 'Georgia, serif',
          fontWeight: 600, cursor: 'pointer', marginBottom: 16
        }}>
          {isLogin ? 'Se connecter' : "S'inscrire"}
        </button>

        <p style={{ textAlign: 'center', color: '#6B7280', fontSize: 14 }}>
          {isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?'}{' '}
          <span onClick={() => setIsLogin(!isLogin)}
            style={{ color: '#A78BFA', cursor: 'pointer' }}>
            {isLogin ? "S'inscrire" : 'Se connecter'}
          </span>
        </p>
      </div>
    </div>
  );
}
