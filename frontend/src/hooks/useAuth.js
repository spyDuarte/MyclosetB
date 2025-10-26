import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const initialErrors = { email: '', password: '' };

export const useAuth = () => {
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(initialErrors);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    fetchSession();
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const resetErrors = () => {
    setErrors(initialErrors);
    setMessage('');
  };

  const validate = (email, password) => {
    let valid = true;
    const nextErrors = { ...initialErrors };

    if (!email) {
      nextErrors.email = 'Informe seu email';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Email inválido';
      valid = false;
    }

    if (!password) {
      nextErrors.password = 'Informe a senha';
      valid = false;
    } else if (password.length < 6) {
      nextErrors.password = 'A senha deve ter pelo menos 6 caracteres';
      valid = false;
    }

    setErrors(nextErrors);
    return valid;
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setMessage('Você saiu da sua conta.');
    } catch (error) {
      console.error(error);
      setMessage('Erro ao sair: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async ({ email, password }) => {
    resetErrors();
    if (!validate(email, password)) return;

    setLoading(true);
    try {
      if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage('Login realizado com sucesso!');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Cadastro realizado! Verifique seu email.');
      }
    } catch (error) {
      console.error(error);
      setMessage(error.message || 'Falha na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) throw error;
      setMessage('Redirecionando para autenticação ' + provider + '...');
    } catch (error) {
      console.error(error);
      setMessage('Não foi possível autenticar com ' + provider);
    } finally {
      setLoading(false);
    }
  };

  return {
    authMode,
    setAuthMode,
    user,
    loading,
    errors,
    message,
    handleEmailAuth,
    signOut,
    signInWithProvider,
    resetErrors
  };
};
