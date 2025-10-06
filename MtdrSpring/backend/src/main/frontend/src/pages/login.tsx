import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import tomatoLogo from '../assets/tomato.svg';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email === 'admin' && password === 'admin') {
      navigate('/dashboard');
    } else {
      setError('Usuario o contraseña incorrectos');
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
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <Alert type="error" message={error} />}

          <div className="flex justify-center items-center">
            <Button type="submit" variant="primary">
              Iniciar Sesión
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}