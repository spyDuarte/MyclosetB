import { useState } from 'react';
import { Eye, EyeOff, Mail, Apple, Loader2, LogIn } from 'lucide-react';

const inputClasses =
  'w-full rounded-lg border border-purple-200 bg-white/80 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-purple-400 focus:bg-white focus:shadow-glow transition';

export function AuthForm({
  mode,
  onModeChange,
  onSubmit,
  onSocial,
  loading,
  error
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isLogin = mode === 'login';

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ email, password, mode });
  };

  const SocialButton = ({ icon: Icon, label, variant = 'google' }) => {
    const baseStyles =
      'flex items-center justify-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 shadow-sm';
    const variants = {
      google: 'bg-white text-slate-700 border-slate-200 hover:shadow-lg',
      apple: 'bg-black text-white border-black hover:bg-slate-900',
      email: 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700'
    };

    return (
      <button
        type="button"
        onClick={() => onSocial(variant, { email, password, mode })}
        className={`${baseStyles} ${variants[variant]}`}
        disabled={loading}
      >
        <Icon className="h-5 w-5" />
        {label}
      </button>
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-purple-500">MyClosetB</p>
            <h1 className="text-3xl font-bold text-slate-900">
              {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Organize seu guarda-roupa com estilo e inteligência.
            </p>
          </div>
          <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-3 text-white shadow-lg">
            <LogIn className="h-6 w-6" />
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between rounded-xl bg-slate-100 p-1 text-sm font-medium text-slate-600">
          <button
            className={`flex-1 rounded-lg py-2 transition ${
              isLogin ? 'bg-white text-purple-600 shadow' : 'hover:text-purple-500'
            }`}
            onClick={() => onModeChange('login')}
            type="button"
          >
            Entrar
          </button>
          <button
            className={`flex-1 rounded-lg py-2 transition ${
              !isLogin ? 'bg-white text-purple-600 shadow' : 'hover:text-purple-500'
            }`}
            onClick={() => onModeChange('signup')}
            type="button"
          >
            Cadastrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@email.com"
                className={`${inputClasses} pl-10`}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Mínimo 6 caracteres"
                className={`${inputClasses} pr-10`}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-slate-400 transition hover:scale-110 hover:text-purple-500"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-purple-400"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isLogin ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          ou continue com
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="grid gap-3">
          <SocialButton icon={GoogleIcon} label="Continuar com Google" variant="google" />
          <SocialButton icon={Apple} label="Continuar com Apple" variant="apple" />
          <SocialButton icon={Mail} label="Continuar com Email" variant="email" />
        </div>
      </div>
    </div>
  );
}

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="h-5 w-5" {...props}>
      <path
        fill="#4285F4"
        d="M23.6 12.3c0-.8-.1-1.7-.3-2.4H12v4.6h6.6c-.3 1.6-1.3 3-2.9 3.9v3.2h4.7c2.7-2.5 4.2-6.1 4.2-9.3z"
      />
      <path fill="#34A853" d="M12 24c3.6 0 6.6-1.2 8.8-3.3l-4.7-3.2c-1.3.9-2.9 1.4-4.1 1.4-3.1 0-5.7-2.1-6.6-5H.6v3.2C2.8 21.4 7 24 12 24z" />
      <path fill="#FBBC05" d="M5.4 14.9c-.3-1-.5-2-.5-3s.2-2 .5-3V5.7H.6C-.4 7.9-.4 12 .6 14.2l4.8-3.2z" />
      <path fill="#EA4335" d="M12 4.7c1.8 0 3.5.6 4.7 1.8l3.5-3.5C18.6 1 15.6 0 12 0 7 0 2.8 2.6.6 6.3l4.8 3.2c.9-2.9 3.5-4.8 6.6-4.8z" />
    </svg>
  );
}
