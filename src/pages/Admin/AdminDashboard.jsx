import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [pedidosAgendas, setPedidosAgendas] = useState([]);
  const [pedidosImanes, setPedidosImanes] = useState([]);
  const [tab, setTab] = useState('agendas');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }

    const fetchDatos = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Fetch agendas
        const resAgendas = await fetch('http://localhost:3000/api/pedidos', { headers });
        if (resAgendas.ok) {
          setPedidosAgendas(await resAgendas.json());
        } else if (resAgendas.status === 401 || resAgendas.status === 403) {
          // Token expirado o inválido
          localStorage.removeItem('adminToken');
          navigate('/admin');
          return;
        }

        // Fetch imanes
        const resImanes = await fetch('http://localhost:3000/api/imanes', { headers });
        if (resImanes.ok) {
          setPedidosImanes(await resImanes.json());
        }

        setLoading(false);
      } catch (err) {
        console.error("Error al obtener pedidos:", err);
        setLoading(false);
      }
    };

    fetchDatos();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando panel...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Panel de Administración</h2>
        <button onClick={logout} className="btn-secondary" style={{ padding: '8px 16px' }}>Cerrar Sesión</button>
      </div>

      <div className="admin-tabs">
        <button className={`tab-btn ${tab === 'agendas' ? 'active' : ''}`} onClick={() => setTab('agendas')}>
          Agendas ({pedidosAgendas.length})
        </button>
        <button className={`tab-btn ${tab === 'imanes' ? 'active' : ''}`} onClick={() => setTab('imanes')}>
          Imanes ({pedidosImanes.length})
        </button>
      </div>

      <div className="admin-content card">
        {tab === 'agendas' && (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Formato</th>
                  <th>Tapa / Diseño</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidosAgendas.map(p => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td>{formatDate(p.fechaCreacion)}</td>
                    <td>
                      <strong>{p.nombreCliente}</strong><br/>
                      <small>{p.emailCliente}</small><br/>
                      <small>{p.telefonoCliente}</small>
                    </td>
                    <td>
                      {p.tamano} - {p.interior}
                    </td>
                    <td>
                      {p.tipografia}<br/>
                      {/* Aquí idealmente si guardamos la URL de la tapa propia se vería */}
                      <button className="btn-link">Ver Detalles</button>
                    </td>
                    <td>${Number(p.total).toLocaleString('es-AR')}</td>
                    <td><span className={`badge badge-${p.estado.toLowerCase()}`}>{p.estado}</span></td>
                  </tr>
                ))}
                {pedidosAgendas.length === 0 && (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No hay pedidos de agendas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'imanes' && (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Cant. Imanes</th>
                  <th>Imágenes</th>
                  <th>Observaciones</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidosImanes.map(p => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td>{formatDate(p.fechaCreacion)}</td>
                    <td>
                      <strong>{p.nombreCliente}</strong><br/>
                      <small>{p.emailCliente}</small><br/>
                      <small>{p.telefonoCliente}</small>
                    </td>
                    <td>{p.cantidad}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        {p.urlsImagenes && Array.isArray(p.urlsImagenes) ? p.urlsImagenes.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noreferrer" title="Ver imagen">
                            <img src={url} alt="iman" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                          </a>
                        )) : 'Sin imágenes'}
                      </div>
                    </td>
                    <td>{p.observaciones || '-'}</td>
                    <td><span className={`badge badge-${p.estado.toLowerCase()}`}>{p.estado}</span></td>
                  </tr>
                ))}
                {pedidosImanes.length === 0 && (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No hay pedidos de imanes.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
