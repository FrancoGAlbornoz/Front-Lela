import { useState, useEffect } from 'react';

// Mock data (luego vendrá de la API)
const MOCK_SIZES = [
  { id: 1, nombre: 'A4', precio_base: 45000 },
  { id: 2, nombre: 'A5', precio_base: 35000 },
  { id: 3, nombre: 'A6', precio_base: 25000 }
];

const MOCK_INTERIORS = [
  { id: 1, nombre: 'Agenda Anual', precio_adicional: 15000 },
  { id: 2, nombre: 'Planner Semanal', precio_adicional: 12000 },
  { id: 3, nombre: 'Cuaderno Rayado', precio_adicional: 5000 }
];

export default function StepSize({ data, updateData, nextStep }) {
  const [sizes, setSizes] = useState([]);
  const [interiors, setInteriors] = useState([]);

  useEffect(() => {
    // Simular carga de API
    setSizes(MOCK_SIZES);
    setInteriors(MOCK_INTERIORS);
  }, []);

  const handleSizeSelect = (size) => updateData({ tamano: size });
  const handleInteriorSelect = (interior) => updateData({ interior: interior });

  const isComplete = data.tamano !== null && data.interior !== null;

  return (
    <div className="step-size">
      <h2>1. Selecciona el Formato</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>
        Elige el tamaño de tu agenda y el tipo de interior que mejor se adapte a ti.
      </p>

      <h3 style={{ marginTop: '30px' }}>Tamaño</h3>
      <div className="options-grid">
        {sizes.map(size => (
          <div 
            key={size.id} 
            className={`option-card ${data.tamano?.id === size.id ? 'selected' : ''}`}
            onClick={() => handleSizeSelect(size)}
          >
            <div className="option-title">{size.nombre}</div>
            <div className="option-price">${size.precio_base.toLocaleString('es-AR')}</div>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: '40px' }}>Interior</h3>
      <div className="options-grid">
        {interiors.map(interior => (
          <div 
            key={interior.id} 
            className={`option-card ${data.interior?.id === interior.id ? 'selected' : ''}`}
            onClick={() => handleInteriorSelect(interior)}
          >
            <div className="option-title">{interior.nombre}</div>
            <div className="option-price">+ ${interior.precio_adicional.toLocaleString('es-AR')}</div>
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
