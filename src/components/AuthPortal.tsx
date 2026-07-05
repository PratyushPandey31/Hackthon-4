import React, { useState } from 'react';
import { Lock, Mail, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface AuthPortalProps {
  onLoginSuccess: (name: string, email: string) => void;
}

export const RadarLogo: React.FC<{ size?: number; className?: string }> = ({ size = 64, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`logo-rotate ${className}`}
      style={{ filter: 'drop-shadow(0 0 8px rgba(0, 210, 255, 0.4))' }}
    >
      {/* Outer rim */}
      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0, 210, 255, 0.2)" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="45" fill="none" stroke="url(#radarGradient)" strokeWidth="2" strokeDasharray="30 10 15 15" />
      
      {/* Inner rings */}
      <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(0, 245, 212, 0.15)" strokeWidth="1" strokeDasharray="5 5" />
      <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(0, 210, 255, 0.2)" strokeWidth="1" />
      
      {/* Crosshairs */}
      <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(0, 210, 255, 0.15)" strokeWidth="1" />
      <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(0, 210, 255, 0.15)" strokeWidth="1" />
      
      {/* Blip points */}
      <circle cx="35" cy="40" r="3" fill="#FF007A" className="pulse-blip" style={{ filter: 'drop-shadow(0 0 3px #FF007A)' }} />
      <circle cx="65" cy="60" r="2.5" fill="#00F5D4" className="pulse-blip-delay" style={{ filter: 'drop-shadow(0 0 3px #00F5D4)' }} />
      
      {/* Sweeping gradient wedge */}
      <path
        d="M 50 50 L 50 5 A 45 45 0 0 1 82 18 Z"
        fill="url(#sweepGradient)"
        opacity="0.6"
      />
      
      <defs>
        <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D2FF" />
          <stop offset="100%" stopColor="#9D4EDD" />
        </linearGradient>
        <radialGradient id="sweepGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="rgba(0, 210, 255, 0)" />
          <stop offset="80%" stopColor="rgba(0, 210, 255, 0.1)" />
          <stop offset="100%" stopColor="rgba(0, 245, 212, 0.4)" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export const AuthPortal: React.FC<AuthPortalProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('admin@floodpulse.in');
  const [password, setPassword] = useState('admin123');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (isLogin) {
        // Mock Login
        const storedUsers = JSON.parse(localStorage.getItem('floodpulse_users') || '[]');
        const user = storedUsers.find((u: any) => u.email === email && u.password === password);
        
        if (email === 'admin@floodpulse.in' && password === 'admin123') {
          onLoginSuccess('Pratyush Pandey', 'admin@floodpulse.in');
        } else if (user) {
          onLoginSuccess(user.name, user.email);
        } else {
          setError('Invalid email or password. Use demo credentials or register.');
          setLoading(false);
        }
      } else {
        // Mock Registration
        if (!name || !email || !password) {
          setError('Please fill in all fields.');
          setLoading(false);
          return;
        }

        const storedUsers = JSON.parse(localStorage.getItem('floodpulse_users') || '[]');
        if (storedUsers.some((u: any) => u.email === email) || email === 'admin@floodpulse.in') {
          setError('Email is already registered.');
          setLoading(false);
          return;
        }

        const newUser = { name, email, password };
        storedUsers.push(newUser);
        localStorage.setItem('floodpulse_users', JSON.stringify(storedUsers));
        
        setIsLogin(true);
        setError('');
        alert('Registration successful! Please login with your credentials.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      zIndex: 1
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow behind logo */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '150px',
          height: '150px',
          background: 'rgba(0, 210, 255, 0.15)',
          filter: 'blur(40px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        {/* Logo Section */}
        <div style={{ marginBottom: '24px', display: 'inline-block' }}>
          <RadarLogo size={72} />
        </div>

        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: 800,
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px',
          letterSpacing: '-0.025em'
        }}>
          FLOODPULSE MUMBAI
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '32px' }}>
          Unified Predictive Flood Command Center
        </p>

        {error && (
          <div className="glass-panel" style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.2)',
            color: '#F87171',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.85rem',
            textAlign: 'left'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '6px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: '#64748B' }} />
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Pratyush Pandey"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: '#64748B' }} />
              <input
                type="email"
                className="input-field"
                placeholder="e.g. analyst@floodpulse.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8' }}>
                Password
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: '#64748B' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '44px', paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '15px',
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
            {loading ? (
              <span className="spinner" style={{
                width: '18px',
                height: '18px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'rotate-slow 1s linear infinite',
                display: 'inline-block'
              }} />
            ) : (
              <>
                {isLogin ? 'Access Command Center' : 'Register Analyst Profile'}
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@floodpulse.in');
                  setPassword('admin123');
                  onLoginSuccess('Pratyush Pandey', 'admin@floodpulse.in');
                }}
                className="btn-secondary"
                style={{
                  width: '100%',
                  background: 'rgba(0, 210, 255, 0.05)',
                  borderColor: 'rgba(0, 210, 255, 0.2)',
                  color: 'var(--accent-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                Quick Login as Admin (Bypass)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('analyst@floodpulse.in');
                  setPassword('analyst123');
                  
                  // Add user to database if not present, so UserDirectory works
                  const storedUsers = JSON.parse(localStorage.getItem('floodpulse_users') || '[]');
                  if (!storedUsers.some((u: any) => u.email === 'analyst@floodpulse.in')) {
                    storedUsers.push({ name: 'Rohan Sharma', email: 'analyst@floodpulse.in', password: 'analyst123' });
                    localStorage.setItem('floodpulse_users', JSON.stringify(storedUsers));
                  }
                  
                  onLoginSuccess('Rohan Sharma', 'analyst@floodpulse.in');
                }}
                className="btn-secondary"
                style={{
                  width: '100%',
                  background: 'rgba(157, 78, 221, 0.05)',
                  borderColor: 'rgba(157, 78, 221, 0.2)',
                  color: 'var(--accent-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                Quick Login as Analyst (Bypass)
              </button>
            </div>
          )}
        </form>

        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '20px', fontSize: '0.85rem' }}>
          {isLogin ? (
            <p style={{ color: '#64748B' }}>
              First time deploying?{' '}
              <button
                onClick={() => { setIsLogin(false); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 600 }}
              >
                Create an account
              </button>
            </p>
          ) : (
            <p style={{ color: '#64748B' }}>
              Already registered?{' '}
              <button
                onClick={() => { setIsLogin(true); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 600 }}
              >
                Sign in instead
              </button>
            </p>
          )}
        </div>

        {isLogin && (
          <div className="glass-panel" style={{
            marginTop: '20px',
            background: 'rgba(255,255,255,0.02)',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.75rem',
            color: '#64748B',
            textAlign: 'left'
          }}>
            <span style={{ fontWeight: 600, color: '#94A3B8' }}>Demo Credentials:</span><br />
            Email: <span style={{ fontFamily: 'monospace' }}>admin@floodpulse.in</span><br />
            Password: <span style={{ fontFamily: 'monospace' }}>admin123</span>
          </div>
        )}
      </div>
    </div>
  );
};
