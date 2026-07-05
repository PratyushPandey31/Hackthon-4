import React, { useState, useEffect } from 'react';
import { Users, UserMinus, ShieldAlert, Info } from 'lucide-react';

interface UserDirectoryProps {
  currentUserEmail: string;
}

export const UserDirectory: React.FC<UserDirectoryProps> = ({ currentUserEmail }) => {
  const [usersList, setUsersList] = useState<any[]>([]);

  // Load registered users from localStorage
  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('floodpulse_users') || '[]');
    setUsersList(storedUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDeleteUser = (email: string) => {
    if (email === currentUserEmail) {
      alert("System Block: You cannot revoke access for your own active administrative session.");
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to revoke system access for analyst: ${email}?`);
    if (!confirmed) return;

    const storedUsers = JSON.parse(localStorage.getItem('floodpulse_users') || '[]');
    const updatedUsers = storedUsers.filter((u: any) => u.email !== email);
    localStorage.setItem('floodpulse_users', JSON.stringify(updatedUsers));
    
    loadUsers();
    alert(`Access revoked. Analyst profile (${email}) removed from directory.`);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users style={{ color: 'var(--accent-blue)' }} size={20} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>System Analyst Directory</h2>
        </div>
        <span className="badge badge-info">Admin Controls</span>
      </div>

      <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'left' }}>
        <strong>Administrative Terminal:</strong> Manage system access credentials for emergency analysts. You can inspect active analyst profiles and revoke database writing permissions.
      </p>

      {usersList.length === 0 ? (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          color: '#64748B',
          background: 'rgba(0,0,0,0.2)',
          border: '1px dashed rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '40px'
        }}>
          <Info size={32} style={{ color: '#475569' }} />
          <h3 style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 600 }}>No Registered Users</h3>
          <p style={{ fontSize: '0.75rem', maxWidth: '300px', textAlign: 'center' }}>
            There are currently no standard analyst profiles registered in the system database. Use the Register tab on the Login Screen to add profiles.
          </p>
        </div>
      ) : (
        <div style={{ border: '1px solid var(--border-light)', borderRadius: '8px', overflow: 'hidden', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '12px' }}>Name</th>
                <th style={{ padding: '12px' }}>Email Address</th>
                <th style={{ padding: '12px' }}>Role/Clearance</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((user) => (
                <tr key={user.email} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: 'white' }}>{user.name}</td>
                  <td style={{ padding: '12px', color: '#94A3B8', fontFamily: 'monospace' }}>{user.email}</td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)' }}>
                      Analyst
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleDeleteUser(user.email)}
                      className="btn-secondary"
                      style={{
                        padding: '6px 10px',
                        fontSize: '0.75rem',
                        background: 'rgba(239, 68, 68, 0.08)',
                        borderColor: 'rgba(239, 68, 68, 0.2)',
                        color: 'var(--accent-red)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        borderRadius: '6px'
                      }}
                    >
                      <UserMinus size={12} /> Revoke Access
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Admin Safety Warning */}
      <div className="glass-panel" style={{
        marginTop: '20px',
        background: 'rgba(245, 158, 11, 0.04)',
        borderColor: 'rgba(245, 158, 11, 0.15)',
        padding: '12px 16px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        fontSize: '0.8rem',
        color: '#FBBF24',
        textAlign: 'left'
      }}>
        <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
        <span>
          <strong>Admin Clearance Notice:</strong> Revoking access will immediately delete the analyst credentials from local databases. If the analyst is currently logged in, they will be logged out upon their next session verification check.
        </span>
      </div>
    </div>
  );
};
