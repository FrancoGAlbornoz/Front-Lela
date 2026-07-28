import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('agendas');
  const [pedidosAgendas, setPedidosAgendas] = useState([]);
  const [pedidosImanes, setPedidosImanes] = useState([]);
  const [catalogoTapas, setCatalogoTapas] = useState([]);
  
  // Estado para el formulario de subir tapa
  const [tapaNombre, setTapaNombre] = useState('');
  const [tapaCategoria, setTapaCategoria] = useState('');
  const [tapaImagen, setTapaImagen] = useState(null);
  const [uploading, setUploading] = useState(false);

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
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        
        // Fetch agendas
        const resAgendas = await fetch(`${API_URL}/api/pedidos`, { headers });
        if (resAgendas.ok) {
          setPedidosAgendas(await resAgendas.json());
        } else if (resAgendas.status === 401 || resAgendas.status === 403) {
          localStorage.removeItem('adminToken');
          navigate('/admin');
          return;
        }

        // Fetch imanes
        const resImanes = await fetch(`${API_URL}/api/imanes`, { headers });
        if (resImanes.ok) {
          setPedidosImanes(await resImanes.json());
        }

        // Fetch catálogo de tapas
        const resCatalogo = await fetch(`${API_URL}/api/catalogo`);
        if (resCatalogo.ok) {
          const catalogo = await resCatalogo.json();
          setCatalogoTapas(catalogo.fondos || []);
        }

      } catch (error) {
        console.error("Error cargando dashboard:", error);
      }
    };

    fetchDatos();
  }, [navigate]);

  const handleSubirTapa = async (e) => {
    e.preventDefault();
    if (!tapaNombre || !tapaCategoria || !tapaImagen) return;

    setUploading(true);
    const token = localStorage.getItem('adminToken');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    const formData = new FormData();
    formData.append('nombre', tapaNombre);
    formData.append('categoria', tapaCategoria);
    formData.append('imagen', tapaImagen);

    try {
      const res = await fetch(`${API_URL}/api/catalogo/fondos`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (res.ok) {
        const result = await res.json();
        setCatalogoTapas(prev => [...prev, result.data]);
        setTapaNombre('');
        setTapaCategoria('');
        setTapaImagen(null);
        e.target.reset();
        alert('Tapa subida exitosamente');
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error al subir la tapa');
    }
    setUploading(false);
  };

  const handleEliminarTapa = async (id) => {
    if (!window.confirm('¿Seguro que deseas ocultar esta tapa del catálogo?')) return;
    
    const token = localStorage.getItem('adminToken');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    try {
      const res = await fetch(`${API_URL}/api/catalogo/fondos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCatalogoTapas(prev => prev.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error(error);
      alert('Error al eliminar');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Panel de Administración</h2>
        <button className="btn-secondary" onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin'); }}>
          Cerrar Sesión
        </button>
      </div>

      <div className="admin-tabs">
        <button className={`tab-btn ${activeTab === 'agendas' ? 'active' : ''}`} onClick={() => setActiveTab('agendas')}>Pedidos Agendas</button>
        <button className={`tab-btn ${activeTab === 'imanes' ? 'active' : ''}`} onClick={() => setActiveTab('imanes')}>Pedidos Imanes</button>
        <button className={`tab-btn ${activeTab === 'tapas' ? 'active' : ''}`} onClick={() => setActiveTab('tapas')}>Catálogo Tapas</button>
      </div>

      <div className="admin-content card">
        {activeTab === 'agendas' && (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Formato y Detalles</th>
                  <th>Diseño Tapa</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {pedidosAgendas.length === 0 ? <tr><td colSpan="7" className="text-center">No hay pedidos de agendas</td></tr> : null}
                {pedidosAgendas.map(pedido => (
                  <tr key={pedido.id}>
                    <td>#{pedido.id}</td>
                    <td>
                      <strong>{pedido.nombreCliente}</strong><br/>
                      <small>{pedido.emailCliente}</small><br/>
                      <small>{pedido.telefonoCliente}</small>
                    </td>
                    <td>
                      <strong>{pedido.tamano} - {pedido.interior}</strong><br/>
                      {pedido.extras && <small style={{ color: 'var(--primary-dark)' }}>+ {pedido.extras}</small>}
                      {pedido.observaciones && <p style={{ fontSize: '0.8rem', fontStyle: 'italic', marginTop: '5px' }}>"{pedido.observaciones}"</p>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {(pedido.fondoTapaUrl || pedido.imagenPersonalizada) && (
                          <a href={pedido.fondoTapaUrl || pedido.imagenPersonalizada} target="_blank" rel="noreferrer">
                            <img src={pedido.fondoTapaUrl || pedido.imagenPersonalizada} alt="Tapa" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                          </a>
                        )}
                        <div style={{ fontSize: '0.85rem' }}>
                          <strong>{pedido.fondoTapa ? pedido.fondoTapa : 'Diseño Propio'}</strong><br/>
                          Texto: "{pedido.textoTapa}"<br/>
                          <small>Fuente: {pedido.tipografia}</small><br/>
                          <small>Orientación: {pedido.orientacion}</small>
                        </div>
                      </div>
                    </td>
                    <td><strong>${pedido.total}</strong><br/><small>x{pedido.cantidad}</small></td>
                    <td><span className={`status-badge status-${pedido.estado?.toLowerCase() || 'pendiente_pago'}`}>{pedido.estado}</span></td>
                    <td>{new Date(pedido.fechaCreacion).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'imanes' && (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Cantidad</th>
                  <th>Imágenes</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {pedidosImanes.length === 0 ? <tr><td colSpan="6" className="text-center">No hay pedidos de imanes</td></tr> : null}
                {pedidosImanes.map(pedido => (
                  <tr key={pedido.id}>
                    <td>#{pedido.id}</td>
                    <td>{pedido.nombre_cliente} <br/> <small>{pedido.email_cliente}</small></td>
                    <td>{pedido.cantidad} pack(s)</td>
                    <td>
                      <div className="imanes-preview-admin">
                        {pedido.urls_imagenes && pedido.urls_imagenes.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noreferrer">
                            <img src={url} alt={`Imán ${i}`} className="iman-thumb" />
                          </a>
                        ))}
                      </div>
                    </td>
                    <td><span className={`status-badge status-${pedido.estado.toLowerCase()}`}>{pedido.estado}</span></td>
                    <td>{new Date(pedido.fecha_creacion).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'tapas' && (
          <div className="admin-tapas-section">
            <div className="tapas-upload-form" style={{ marginBottom: '40px', padding: '20px', background: 'var(--background)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ marginTop: 0, color: 'var(--primary-dark)' }}>Subir Nuevo Diseño de Tapa</h3>
              <form onSubmit={handleSubirTapa} style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input type="text" placeholder="Nombre (Ej: Mármol Rosa)" value={tapaNombre} onChange={e => setTapaNombre(e.target.value)} required className="form-control" style={{ flex: 1 }} />
                <input type="text" placeholder="Categoría (Ej: Floral)" value={tapaCategoria} onChange={e => setTapaCategoria(e.target.value)} required className="form-control" style={{ flex: 1 }} />
                <input type="file" accept="image/*" onChange={e => setTapaImagen(e.target.files[0])} required style={{ flex: 1 }} />
                <button type="submit" className="btn-primary" disabled={uploading}>
                  {uploading ? 'Subiendo...' : 'Subir Tapa'}
                </button>
              </form>
            </div>

            <h3 style={{ color: 'var(--primary-dark)' }}>Catálogo Actual</h3>
            <div className="tapas-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {catalogoTapas.map(tapa => (
                <div key={tapa.id} className="tapa-card" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#fff', textAlign: 'center', paddingBottom: '15px' }}>
                  <img src={tapa.urlImagen} alt={tapa.nombre} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  <div className="tapa-info" style={{ padding: '10px' }}>
                    <strong style={{ display: 'block', fontSize: '1.1rem' }}>{tapa.nombre}</strong>
                    <small style={{ color: 'var(--text-light)', display: 'block', marginBottom: '10px' }}>{tapa.categoria}</small>
                    <button onClick={() => handleEliminarTapa(tapa.id)} className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.9rem', background: '#ff4d4f', color: '#fff', border: 'none' }}>Eliminar</button>
                  </div>
                </div>
              ))}
              {catalogoTapas.length === 0 && <p>No hay tapas en el catálogo.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
