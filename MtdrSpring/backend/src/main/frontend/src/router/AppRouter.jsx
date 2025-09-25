import { Routes, Route } from 'react-router-dom';
//import Login from '../pages/login';
//import Home from '../pages/home'
//import Dashboard from '../pages/dashboard';
import Layout from '../components/Layout';


export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Rutas del dashboard con sidebar fijo */}
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
      </Route>

    </Routes>
  );
}
