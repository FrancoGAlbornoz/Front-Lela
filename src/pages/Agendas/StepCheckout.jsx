export default function StepCheckout({ data, updateData, prevStep }) {
  const calculateTotal = () => {
    let total = 0;
    if (data.tamano) total += data.tamano.precio_base;
    if (data.interior) total += data.interior.precio_adicional;
    data.adicionales.forEach(a => total += a.precio);
    return total;
  };

  const total = calculateTotal();

  const handleClienteChange = (e) => {
    const { name, value } = e.target;
    updateData({ cliente: { ...data.cliente, [name]: value } });
  };

  const isFormValid = data.cliente.nombre.trim() !== '' && data.cliente.email.trim() !== '';

  const handleCheckout = () => {
    // Aquí iría la integración con la API para guardar el pedido
    // Y luego redireccionar a PayWay
    alert('¡Pedido guardado! Redirigiendo a PayWay...');
  };

  return (
    <div className="step-checkout">
      <h2>4. Resumen de tu Agenda</h2>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div className="card" style={{ padding: '30px' }}>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '15px' }}>Tu Diseño</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Formato:</span>
              <strong>{data.tamano?.nombre}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Interior:</span>
              <strong>{data.interior?.nombre}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Tapa:</span>
              <strong>{data.fondoTapa ? data.fondoTapa.nombre : 'Imagen Propia'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Texto:</span>
              <strong>"{data.textoTapa}" ({data.tipografia?.nombre})</strong>
            </div>
            
            {data.adicionales.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <strong style={{ display: 'block', marginBottom: '5px' }}>Extras:</strong>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {data.adicionales.map(a => (
                    <li key={a.id} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                      <span>+ {a.nombre}</span>
                      <span>${a.precio.toLocaleString('es-AR')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ 
              display: 'flex', justifyContent: 'space-between', 
              marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)',
              fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--primary-dark)'
            }}>
              <span>Total:</span>
              <span>${total.toLocaleString('es-AR')}</span>
            </div>
          </div>
        </div>

        <div style={{ flex: '1', minWidth: '300px' }}>
          <h3>Tus Datos</h3>
          <p style={{ color: 'var(--text-light)', marginBottom: '20px', fontSize: '0.9rem' }}>
            Completa tus datos para finalizar el pedido y proceder al pago.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Nombre Completo *</label>
              <input 
                type="text" 
                name="nombre"
                value={data.cliente.nombre}
                onChange={handleClienteChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Email *</label>
              <input 
                type="email" 
                name="email"
                value={data.cliente.email}
                onChange={handleClienteChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Teléfono</label>
              <input 
                type="tel" 
                name="telefono"
                value={data.cliente.telefono}
                onChange={handleClienteChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Observaciones</label>
              <textarea 
                rows="3"
                value={data.observaciones}
                onChange={(e) => updateData({ observaciones: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={prevStep}>Atrás</button>
        <button 
          className="btn-primary" 
          onClick={handleCheckout}
          disabled={!isFormValid}
          style={{ 
            opacity: isFormValid ? 1 : 0.5,
            background: isFormValid ? 'var(--accent)' : 'var(--primary)',
            color: 'var(--text-heading)'
          }}
        >
          Ir a Pagar
        </button>
      </div>
    </div>
  );
}
