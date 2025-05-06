import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plane, Lock, Mail, User, FileText } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'register';
}

export function AuthForm({ type: initialType }: AuthFormProps) {
  const [type, setType] = useState(initialType);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (type === 'register') {
        // First check if the CPF already exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('cpf')
          .eq('cpf', cpf)
          .maybeSingle();

        if (existingUser) {
          throw new Error('CPF já cadastrado');
        }

        // Create auth user first
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              cpf
            }
          }
        });

        if (signUpError) throw signUpError;

        if (!authData.user) {
          throw new Error('Erro ao criar usuário');
        }

        // Create user profile
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            name,
            cpf,
            role: 'student',
            status: 'approved',
            progress: [],
            completion_percentage: 0,
            bonusPoints: 0
          });

        if (insertError) {
          // If profile creation fails, we should clean up the auth user
          await supabase.auth.signOut();
          throw insertError;
        }
      } else {
        // Login flow
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;

        if (!data.user) {
          throw new Error('Erro ao fazer login');
        }

        // Verify if user profile exists
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (userError) throw userError;

        // If profile doesn't exist, create it
        if (!userData) {
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              name: data.user.email?.split('@')[0] || 'Usuário',
              cpf: '00000000000',
              role: 'student',
              status: 'approved',
              progress: [],
              completion_percentage: 0,
              bonusPoints: 0
            });

          if (insertError) throw insertError;
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      if (err instanceof Error) {
        if (err.message.includes('User already registered')) {
          setError('Este email já está cadastrado');
        } else if (err.message.includes('Invalid login credentials')) {
          setError('Email ou senha incorretos');
        } else if (err.message.includes('CPF já cadastrado')) {
          setError('Este CPF já está cadastrado');
        } else if (err.message.includes('weak_password')) {
          setError('A senha deve ter pelo menos 6 caracteres');
        } else {
          setError(err.message);
        }
      } else {
        setError('Ocorreu um erro. Por favor, tente novamente.');
      }
      // Em caso de erro, garantir que o usuário está deslogado
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full animate-float">
            <Plane className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {type === 'register' ? 'Cadastro' : 'Bem-vindo'}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {type === 'register' 
            ? 'Já tem uma conta?' 
            : 'Sistema de Capacitação para Mecânicos Aeronáuticos'}
        </p>
        <button
          onClick={() => {
            setType(type === 'register' ? 'login' : 'register');
            setError(null);
            setEmail('');
            setPassword('');
            setName('');
            setCpf('');
          }}
          className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
        >
          {type === 'register' ? 'Faça login' : 'Criar nova conta'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'register' && (
          <>
            <div className="relative">
              <div className="input-icon">
                <User className="h-5 w-5" />
              </div>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder="Nome Completo"
                required
              />
            </div>
            <div className="relative">
              <div className="input-icon">
                <FileText className="h-5 w-5" />
              </div>
              <input
                type="text"
                id="cpf"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="form-input"
                placeholder="CPF"
                required
              />
            </div>
          </>
        )}
        <div className="relative">
          <div className="input-icon">
            <Mail className="h-5 w-5" />
          </div>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="Email"
            required
          />
        </div>
        <div className="relative">
          <div className="input-icon">
            <Lock className="h-5 w-5" />
          </div>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="Senha"
            required
            minLength={6}
          />
        </div>
        {type === 'register' && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            A senha deve ter pelo menos 6 caracteres
          </p>
        )}
        {error && (
          <div className="error-message" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </div>
          ) : (
            type === 'register' ? 'Cadastrar' : 'Entrar'
          )}
        </button>
      </form>
    </div>
  );
}