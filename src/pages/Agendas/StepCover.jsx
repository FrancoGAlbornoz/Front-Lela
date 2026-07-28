import { useState } from 'react';

export default function StepCover({ data, updateData, nextStep, prevStep, fondos, tipografias }) {
  const [uploadMode, setUploadMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleCoverSelect = (cover) => {
    updateData({ fondoTapa: cover, imagenPersonalizada: null });
    setUploadMode(false);
  };

  const handleCustomUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Mostrar preview temporal y estado de carga
      const imageUrl = URL.createObjectURL(file); 
      updateData({ fondoTapa: null, imagenPersonalizada: imageUrl });
      setUploadMode(true);
      setIsUploading(true);

      const formData = new FormData();
      formData.append('imagen', file);

      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${API_URL}/api/pedidos/upload-tapa`, {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        
        if (response.ok) {
          // Reemplazamos la preview por la URL real del servidor/cloudinary
          updateData({ imagenPersonalizada: result.url });
        } else {
          alert('Error al subir la imagen: ' + result.error);
          updateData({ imagenPersonalizada: null });
        }
      } catch (err) {
        console.error('Error de red al subir:', err);
        alert('Error de conexión al subir la imagen.');
        updateData({ imagenPersonalizada: null });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const isComplete = (data.fondoTapa !== null || (data.imagenPersonalizada !== null && !isUploading)) && 
                     data.tipografia !== null && 
                     data.textoTapa.trim() !== '';

  return (
    <div className="step-cover">
      <h2>2. Diseño de Tapa</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>
        Elige un fondo de nuestro catálogo o sube tu propia imagen. Luego, personaliza el texto de la tapa.
      </p>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <button 
          className={`btn-secondary ${!uploadMode ? 'active' : ''}`}
          style={{ borderColor: !uploadMode ? 'var(--primary-dark)' : '', background: !uploadMode ? 'var(--primary-light)' : '' }}
          onClick={() => setUploadMode(false)}
        >
          Catálogo Lela
        </button>
        <button 
          className={`btn-secondary ${uploadMode ? 'active' : ''}`}
          style={{ borderColor: uploadMode ? 'var(--primary-dark)' : '', background: uploadMode ? 'var(--primary-light)' : '' }}
          onClick={() => setUploadMode(true)}
        >
          Subir mi Imagen
        </button>
      </div>

      {!uploadMode ? (
        <div className="options-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          {fondos.map(cover => (
            <div 
              key={cover.id} 
              className={`option-card ${data.fondoTapa?.id === cover.id ? 'selected' : ''}`}
              style={{ padding: '10px' }}
              onClick={() => handleCoverSelect(cover)}
            >
              <img src={cover.urlImagen} alt={cover.nombre} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
              <div style={{ marginTop: '10px', fontSize: '0.9rem', fontWeight: '500' }}>{cover.nombre}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="upload-area" style={{ border: '2px dashed var(--border-color)', padding: '40px', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
          {data.imagenPersonalizada ? (
            <div>
              <img src={data.imagenPersonalizada} alt="Preview" style={{ maxHeight: '200px', borderRadius: '8px', marginBottom: '15px', opacity: isUploading ? 0.5 : 1 }} />
              {isUploading ? <p>Subiendo imagen...</p> : <p>¡Imagen lista!</p>}
              <input type="file" id="customUpload" hidden onChange={handleCustomUpload} accept="image/*" disabled={isUploading} />
              <label htmlFor="customUpload" className="btn-secondary" style={{ display: 'inline-block', marginTop: '10px', opacity: isUploading ? 0.5 : 1 }}>Cambiar Imagen</label>
            </div>
          ) : (
            <div>
              <input type="file" id="customUpload" hidden onChange={handleCustomUpload} accept="image/*" />
              <label htmlFor="customUpload" className="btn-primary" style={{ display: 'inline-block', cursor: 'pointer' }}>
                Seleccionar Archivo
              </label>
              <p style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-light)' }}>Soporta JPG y PNG</p>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '40px', background: 'var(--surface)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <h3>Personalizar Texto</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Texto en la Tapa</label>
            <input 
              type="text" 
              value={data.textoTapa}
              onChange={(e) => updateData({ textoTapa: e.target.value })}
              placeholder="Ej. Agenda 2026 de Laura"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Tipografía</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {tipografias.map(font => (
                <button
                  key={font.id}
                  className={`btn-secondary ${data.tipografia?.id === font.id ? 'active' : ''}`}
                  style={{ 
                    borderColor: data.tipografia?.id === font.id ? 'var(--primary-dark)' : '', 
                    background: data.tipografia?.id === font.id ? 'var(--primary-light)' : '' 
                  }}
                  onClick={() => updateData({ tipografia: font })}
                >
                  {font.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={prevStep}>Atrás</button>
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
