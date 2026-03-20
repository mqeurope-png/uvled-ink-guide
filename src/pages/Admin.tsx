import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { ADMIN_PASSWORD } from '@/lib/adminTypes';
import { isAdminAuthenticated, setAdminAuthenticated } from '@/lib/adminStorage';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(isAdminAuthenticated());
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAdminAuthenticated(true);
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setAuthenticated(false);
    setPassword('');
  };

  if (authenticated) {
    return <AdminLayout onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-display text-3xl">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">BOMEDIA Management</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card rounded-xl p-6 shadow-lg" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
          <label className="block text-sm font-medium mb-2">Password</label>
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter admin password"
              className={`w-full h-11 px-4 pr-10 rounded-lg text-sm transition-colors outline-none ${
                error
                  ? 'border-2 border-destructive'
                  : 'border border-[rgba(0,0,0,0.08)] focus:border-primary focus:ring-1 focus:ring-primary'
              }`}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && (
            <p className="text-destructive text-sm mb-4">Incorrect password</p>
          )}
          <button
            type="submit"
            className="w-full h-11 bg-primary text-white rounded-lg font-medium text-sm hover:brightness-[0.92] transition-all"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <a href="/" className="hover:text-primary transition-colors">← Back to website</a>
        </p>
      </motion.div>
    </div>
  );
}
