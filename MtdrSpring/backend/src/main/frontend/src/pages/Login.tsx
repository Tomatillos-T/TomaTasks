import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import tomatoLogo from '@/assets/tomato.svg';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      await login({ email, password });
      // Login exitoso, redirigir al dashboard
      navigate('/dashboard');
    } catch (err) {
      // El error ya se maneja en el hook useAuth
      console.error('Error en login:', err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-background-main">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="Tomatasks" src={tomatoLogo} className="mx-auto h-10 w-auto" />
        <h2 className="mt-10 text-center text-2xl font-bold text-text-primary">
          Sign in to your account
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          
          {/* Mostrar alerta de error si existe */}
          {error && <Alert type="error" message={error} />}
          
          <div className="flex justify-center items-center">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}