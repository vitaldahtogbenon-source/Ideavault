import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const CATEGORIES = [
  { id: 'app', label: 'App', emoji: '📱', color: '#FF6B6B' },
  { id: 'jeu', label: 'Jeu', emoji: '🎮', color: '#4ECDC4' },
  { id: 'outil', label: 'Outil', emoji: '🔧', color: '#FFE66D' },
  { id: 'creative', label: 'Créatif', emoji: '🎨', color: '#A78BFA' },
  { id: 'business', label: 'Business', emoji: '💡', color: '#F97316' },
  { id: 'autre', label: 'Autre', emoji: '✨', color: '#94A3B8' },
];

const PRIORITIES = [
  { value: 1, label: 'Un jour...', stars: '☆☆☆' },
  { value: 2, label: 'Intéressant', stars: '★☆☆' },
  { value: 3, label: 'À faire !', stars: '★★☆' },
  { value: 4, label: 'Urgent !', stars: '★★★' },
];

export default function Ideas({ session }) {
  const [ideas, setIdeas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'app', priority: 2 });

  useEffect(() => { fetchIdeas(); }, []);

  const fetchIdeas = async () => {
    const { data } = await supabase
      .from('ideas')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    if (data) setIdeas(data);
  };

  const addIdea = async () => {
    if (!form.title.trim()) return;
    await supabase.from('ideas').insert([{ ...form, user_id: session.user.id }]);
    setForm({ title: '', description: '', category: 'app', priority: 2 });
    setShowForm(false);
    fetchIdeas();
  };

  const deleteIdea = async (id) => {
    await supabase.from('ideas').delete().eq('id', id);
    fetchIdeas();
  };

  const getCat = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[5];
  const getPrio = (v) => PRIORITIES.find(p => p.value === v) || PRIORITIES[1];

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', fontFamily: 'Georgia, serif', color: '#F0EDE6', padding: '40px 20px' }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: 4, color: '#FF6B6B', textTransform: 'uppercase', marginBottom: 6 }}>◈ Ton coffre</div>
            <h1 style={{ margin: 0, fontSize: 48, background: 'linear-gradient(135deg, #F0EDE6, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IdeaVault</h1>
            <p style={{ color: '#6B7280', marginTop: 6 }}>{ideas.length} idée{ideas.length > 1 ? 's' : ''}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexDirection: 'column', alignItems: 'flex-end' }}>
            <button onClick={() => setShowForm(!showForm)} style={{ background: showForm ? '#1F1F1F' : 'linear-gradient(135deg, #FF6B6B, #A78BFA)', border: 'none', borderRadius: 14, padding: '12px 20px', color: '#fff', fontSize: 14, fontFamily: 'Georgia, serif', fontWeight: 600, cursor: 'pointer' }}>
              {showForm ? '✕ Annuler' : '+ Nouvelle idée'}
            </button>
            <button onClick={() => supabase.auth.signOut()} style={{ background: 'transparent', border: '1px solid #2A2A2A', borderRadius: 10, padding: '8px 14px', color: '#6B7280', fontSize: 12, fontFamily: 'Georgia, serif', cursor: 'pointer' }}>
              Déconnexion
            </button>
          </div>
        </div>

        {showForm && (
          <div style={{ background: '#161616', border: '1px solid #2A2A2A', borderRadius: 24, padding: 28, marginBottom: 32 }}>
            <input placeholder="Le titre de ton idée..." value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              style={{ width: '100%', boxSizing: 'border-box', background: '#0D0D0D', border: '1px solid #2A2A2A', borderRadius: 12, padding: '12px 16px', color: '#F0EDE6', fontSize: 16, fontFamily: 'Georgia, serif', marginBottom: 12, outline: 'none' }} />
            <textarea placeholder="Description (optionnel)..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2}
              style={{ width: '100%', boxSizing: 'border-box', background: '#0D0D0D', border: '1px solid #2A2A2A', borderRadius: 12, padding: '12px 16px', color: '#F0EDE6', fontSize: 14, fontFamily: 'Georgia, serif', marginBottom: 16, outline: 'none', resize: 'none' }} />

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setForm(p => ({ ...p, category: cat.id }))}
                  style={{ background: form.category === cat.id ? cat.color + '33' : '#0D0D0D', border: `1px solid ${form.category === cat.id ? cat.color : '#2A2A2A'}`, borderRadius: 8, padding: '6px 10px', color: form.category === cat.id ? cat.color : '#6B7280', fontSize: 12, cursor: 'pointer' }}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {PRIORITIES.map(p => (
                <button key={p.value} onClick={() => setForm(prev => ({ ...prev, priority: p.value }))}
                  style={{ background: form.priority === p.value ? '#FF6B6B22' : '#0D0D0D', border: `1px solid ${form.priority === p.value ? '#FF6B6B' : '#2A2A2A'}`, borderRadius: 8, padding: '8px 12px', color: form.priority === p.value ? '#FF6B6B' : '#6B7280', fontSize: 12, cursor: 'pointer', textAlign: 'center' }}>
                  <div>{p.stars}</div>
                  <div style={{ fontSize: 10 }}>{p.label}</div>
                </button>
              ))}
            </div>

            <button onClick={addIdea} style={{ background: 'linear-gradient(135deg, #FF6B6B, #A78BFA)', border: 'none', borderRadius: 12, padding: '12px 24px', color: '#fff', fontSize: 15, fontFamily: 'Georgia, serif', fontWeight: 600, cursor: 'pointer' }}>
              Sauvegarder ✦
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gap: 16 }}>
          {ideas.map(idea => {
            const cat = getCat(idea.category);
            const prio = getPrio(idea.priority);
            return (
              <div key={idea.id} style={{ background: '#111', border: '1px solid #1E1E1E', borderLeft: `3px solid ${cat.color}`, borderRadius: 20, padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: cat.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {cat.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: 17, color: '#F0EDE6' }}>{idea.title}</h3>
                  {idea.description && <p style={{ margin: '0 0 8px', color: '#6B7280', fontSize: 14 }}>{idea.description}</p>}
                  <span style={{ fontSize: 12, color: '#4B5563' }}>{prio.stars} {prio.label}</span>
                </div>
                <button onClick={() => deleteIdea(idea.id)} style={{ background: '#1F1F1F', border: '1px solid #2A2A2A', borderRadius: 8, width: 30, height: 30, color: '#6B7280', fontSize: 14, cursor: 'pointer' }}>✕</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
   }
