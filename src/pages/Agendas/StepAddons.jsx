import { useState, useEffect } from 'react';

const MOCK_ADDONS = [
  { id: 1, nombre: 'Elástico', tipo: 'ACCESORIO', precio: 2520 },
  { id: 2, nombre: 'Cinta Marcadora', tipo: 'ACCESORIO', precio: 1500 },
  { id: 3, nombre: 'Sobre Interno', tipo: 'SECCION', precio: 3000 }
];

export default function StepAddons({ data, updateData, nextStep, prevStep }) {
  const [addonsList, setAddonsList] = useState([]);

  useEffect(() => {
    setAddonsList(MOCK_ADDONS);
  }, []);

  const toggleAddon = (addon) => {
    const isSelected = data.adicionales.some(a => a.id === addon.id);
    if (isSelected) {
      updateData({ adicionales: data.adicionales.filter(a => a.id !== addon.id) });
    } else {
      updateData({ adicionales: [...data.adicionales, addon] });
    }
  };

  return (
    <div className="step-addons">
      <h2>3. Adicionales y Extras</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>
        Agrega esos detalles finales que hacen a tu agenda aún más especial (Opcional).
      </p>

      <div className="options-grid" style={{ gridTemplateColumns: '1fr' }}>
        {addonsList.map(addon => {
          const isSelected = data.adicionales.some(a => a.id === addon.id);
          return (
            <div 
              key={addon.id} 
              className={`option-card ${isSelected ? 'selected' : ''}`}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', textAlign: 'left' }}
              onClick={() => toggleAddon(addon)}
            >
              <div>
                <div className="option-title" style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{addon.nombre}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', textTransform: 'capitalize' }}>{addon.tipo.toLowerCase()}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div className="option-price">+ ${addon.precio.toLocaleString('es-AR')}</div>
                <div style={{ 
                  width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--border-color)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isSelected ? 'var(--primary)' : 'transparent',
                  borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)'
                }}>
                  {isSelected && <span style={{ color: '#fff', fontSize: '14px' }}>✓</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={prevStep}>Atrás</button>
        <button className="btn-primary" onClick={nextStep}>
          Siguiente Paso
        </button>
      </div>
    </div>
  );
}
