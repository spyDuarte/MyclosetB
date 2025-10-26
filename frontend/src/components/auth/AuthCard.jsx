import { useEffect, useState } from 'react';
import { Apple, Eye, EyeOff, Mail, Chrome } from 'lucide-react';

const AuthToggle = ({ authMode, setAuthMode }) => (
  <div className="flex items-center justify-center gap-4 text-sm font-medium">
    <button
      type="button"
      onClick={() => setAuthMode('login')}
      className={`transition-colors ${
        authMode === 'login' ? 'text-primary-600' : 'text-slate-400'
      }`}
    >
      Entrar
    </button>
    <span className="text-slate-300">•</span>
    <button
      type="button"
      onClick={() => setAuthMode('signup')}
      className={`transition-colors ${
        authMode === 'signup' ? 'text-primary-600' : 'text-slate-400'
      }`}
    >
      Criar conta
    </button>
  </div>
);

const SocialButton = ({ onClick, variant, icon, label }) => {
  const variants = {
    google: 'bg-white text-slate-800 border border-slate-200 hover:-translate-y-0.5',
    apple: 'bg-black text-white hover:-translate-y-0.5',
    email:
      'bg-primary-600 text-white hover:bg-primary-600/90 hover:-translate-y-0.5'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold shadow-sm transition duration-200 hover:shadow-lg ${variants[variant]}`}
    >
      {icon}
      {label}
    </button>
  );
};

export const AuthCard = ({
  authMode,
  setAuthMode,
  handleEmailAuth,
  signInWithProvider,
  loading,
  errors,
  message,
  resetErrors
}) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    resetErrors();
    setForm({ email: '', password: '' });
  }, [authMode, resetErrors]);

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    handleEmailAuth(form);
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur">
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">
          Guarda-Roupa Digital
        </p>
        <h1 className="text-3xl font-display font-bold text-slate-900">
          {authMode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Organize suas peças favoritas em um só lugar.
        </p>
      </div>

      <AuthToggle authMode={authMode} setAuthMode={setAuthMode} />

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700">Email</label>
          <div className="relative mt-1">
            <input
              type="email"
              value={form.email}
              onChange={onChange('email')}
              className={`w-full rounded-lg border px-4 py-3 text-sm shadow-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20 ${
                errors.email ? 'border-red-400' : 'border-slate-200'
              }`}
              placeholder="seu@email.com"
              required
            />
            <Mail className="absolute right-3 top-3 h-5 w-5 text-slate-300" />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Senha</label>
          <div className="relative mt-1">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={onChange('password')}
              className={`w-full rounded-lg border px-4 py-3 text-sm shadow-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20 ${
                errors.password ? 'border-red-400' : 'border-slate-200'
              }`}
              placeholder="mínimo 6 caracteres"
              minLength={6}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 rounded-full p-1 text-slate-400 transition hover:text-primary-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-primary-600/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Carregando...' : authMode === 'login' ? 'Entrar' : 'Cadastrar'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-widest text-slate-400">
        <div className="h-px flex-1 bg-slate-200" />
        ou continue com
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="space-y-3">
        <SocialButton
          variant="google"
          onClick={() => signInWithProvider('google')}
          icon={<Chrome className="h-5 w-5" />}
          label="Continuar com Google"
        />
        <SocialButton
          variant="apple"
          onClick={() => signInWithProvider('apple')}
          icon={<Apple className="h-5 w-5" />}
          label="Continuar com Apple"
        />
        <SocialButton
          variant="email"
          onClick={() => handleEmailAuth(form)}
          icon={<Mail className="h-5 w-5" />}
          label="Continuar com Email"
        />
      </div>

      {message && (
        <p className="mt-4 rounded-lg bg-primary-600/5 px-4 py-2 text-center text-sm text-primary-600">
          {message}
        </p>
      )}
    </div>
  );
};
