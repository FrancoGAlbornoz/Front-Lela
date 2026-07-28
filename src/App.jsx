import { Routes, Route, Link } from 'react-router-dom';
import AgendaBuilder from './pages/Agendas/AgendaBuilder';
import Imanes from './pages/Imanes/Imanes';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--primary-dark)', fontFamily: "'Dancing Script', cursive", fontSize: '3.5rem', margin: '0' }}>Librería Lela</h1>
        <nav style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '10px' }}>
          <Link to="/">Inicio</Link>
          <Link to="/agendas">Agendas</Link>
          <Link to="/imanes">Imanes</Link>
        </nav>
      </header>
      
      <main className="container" style={{ padding: '40px 20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agendas" element={<AgendaBuilder />} />
          <Route path="/imanes" element={<Imanes />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

function Home() {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Bienvenido a Librería Lela</h2>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', marginTop: '10px' }}>
        Personaliza tus agendas y crea imanes únicos con tus fotos favoritas.
      </p>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
        <Link to="/agendas" className="btn-primary" style={{ textDecoration: 'none' }}>
          Diseñar Agenda
        </Link>
        <Link to="/imanes" className="btn-primary" style={{ backgroundColor: 'var(--secondary)', color: 'var(--text-heading)', textDecoration: 'none' }}>
          Crear Imanes
        </Link>
      </div>
    </div>
  );
}

export default App;
