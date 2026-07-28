export default function StepSize({ data, updateData, nextStep, tamanos, interiores }) {
  const handleSizeSelect = (size) => updateData({ tamano: size });
  const handleInteriorSelect = (interior) => updateData({ interior: interior });

  const isComplete = data.tamano !== null && data.interior !== null;

  // Adaptación de los nombres de propiedades según la DB (precioBase, precioAdicional)
  // El backend devuelve precioBase en lugar de precio_base
  return (
    <div className="step-size">
      <h2>1. Selecciona el Formato</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>
        Elige el tamaño de tu agenda y el tipo de interior que mejor se adapte a ti.
      </p>

      <h3 style={{ marginTop: '30px' }}>Tamaño</h3>
      <div className="options-grid">
        {tamanos.map(size => (
          <div 
            key={size.id} 
            className={`option-card ${data.tamano?.id === size.id ? 'selected' : ''}`}
            onClick={() => handleSizeSelect(size)}
          >
            <div className="option-title">{size.nombre}</div>
            <div className="option-price">${Number(size.precioBase).toLocaleString('es-AR')}</div>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: '40px' }}>Interior</h3>
      <div className="options-grid">
        {interiores.map(interior => (
          <div 
            key={interior.id} 
            className={`option-card ${data.interior?.id === interior.id ? 'selected' : ''}`}
            onClick={() => handleInteriorSelect(interior)}
          >
            <div className="option-title">{interior.nombre}</div>
            <div className="option-price">+ ${Number(interior.precioAdicional).toLocaleString('es-AR')}</div>
          </div>
        ))}
      </div>

      <div className="step-actions" style={{ justifyContent: 'flex-end' }}>
        <button 
          className="btn-primary" 
          onClick={nextStep} 
          disabled={!isComplete}
          style={{ opacity: isComplete ? 1 : 0.5 }}
        >
          Siguiente Paso
        </button>
      </div>
    </div>
  );
}
