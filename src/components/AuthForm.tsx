import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

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
        <h2 className="text-2xl font-bold text-gray-900">
          {type === 'register' ? 'Cadastro' : 'Login'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {type === 'register' ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'}{' '}
          <button
            onClick={() => {
              setType(type === 'register' ? 'login' : 'register');
              setError(null);
              setEmail('');
              setPassword('');
              setName('');
              setCpf('');
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            {type === 'register' ? 'Faça login' : 'Cadastre-se'}
          </button>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'register' && (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                CPF
              </label>
              <input
                type="text"
                id="cpf"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            minLength={6}
          />
          {type === 'register' && (
            <p className="mt-1 text-sm text-gray-500">
              A senha deve ter pelo menos 6 caracteres
            </p>
          )}
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Processando...' : type === 'register' ? 'Cadastrar' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}