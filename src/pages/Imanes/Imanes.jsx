import { useState, useRef } from 'react';
import './Imanes.css';

export default function Imanes() {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [cliente, setCliente] = useState({
    nombre: '',
    email: '',
    telefono: '',
    observaciones: ''
  });

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const newImages = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(7)
    }));
    
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleClienteChange = (e) => {
    const { name, value } = e.target;
    setCliente(prev => ({ ...prev, [name]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Subir las imágenes primero a la API
      const formData = new FormData();
      images.forEach(img => {
        formData.append('imagenes', img.file);
      });

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const uploadResponse = await fetch(`${API_URL}/api/imanes/upload`, {
        method: 'POST',
        body: formData
      });
      
      const uploadResult = await uploadResponse.json();
      
      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || 'Error al subir las imágenes');
      }

      // Las urls devueltas por el servidor
      const urlsImagenes = uploadResult.urls;

      // 2. Crear el pedido con los datos del cliente y las URLs
      const pedidoPayload = {
        cliente: {
          nombre: cliente.nombre,
          email: cliente.email,
          telefono: cliente.telefono,
          observaciones: cliente.observaciones
        },
        cantidad: images.length,
        images: urlsImagenes
      };

      const pedidoResponse = await fetch(`${API_URL}/api/imanes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoPayload)
      });

      const pedidoResult = await pedidoResponse.json();

      if (pedidoResponse.ok) {
        alert('¡Genial! Pedido de imanes enviado correctamente.');
        window.location.href = '/'; // Redirigimos al inicio
      } else {
        throw new Error(pedidoResult.error || 'Error al guardar el pedido');
      }

    } catch (err) {
      console.error('Error procesando pedido de imanes:', err);
      alert('Ocurrió un error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = images.length > 0 && cliente.nombre.trim() !== '' && cliente.email.trim() !== '';

  return (
    <div className="imanes-container">
      <div className="text-center" style={{ marginBottom: '40px' }}>
        <h2>Imanes Personalizados</h2>
        <p style={{ color: 'var(--text-light)' }}>
          Sube las fotos que quieras convertir en imanes. Nosotros nos encargamos de la magia.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 50%', minWidth: '300px' }}>
          <div 
            className={`dropzone ${isDragging ? 'dragging' : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={onFileSelect} 
              style={{ display: 'none' }} 
            />
            <div className="dropzone-content">
              <span style={{ fontSize: '3rem', color: 'var(--primary-dark)' }}>+</span>
              <h3>Arrastra tus fotos aquí</h3>
              <p>O haz clic para seleccionar archivos</p>
            </div>
          </div>

          {images.length > 0 && (
            <div className="images-preview-grid">
              {images.map(img => (
                <div key={img.id} className="preview-item">
                  <img src={img.preview} alt="preview" />
                  <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ flex: '1 1 40%', minWidth: '300px' }}>
          <div className="card">
            <h3>Completa tu Pedido</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '20px', fontSize: '0.9rem' }}>
              Total de imanes seleccionados: <strong>{images.length}</strong>
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Nombre Completo *</label>
                <input 
                  type="text" 
                  name="nombre"
                  value={cliente.nombre}
                  onChange={handleClienteChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Email *</label>
                <input 
                  type="email" 
                  name="email"
                  value={cliente.email}
                  onChange={handleClienteChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Teléfono</label>
                <input 
                  type="tel" 
                  name="telefono"
                  value={cliente.telefono}
                  onChange={handleClienteChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Observaciones</label>
                <textarea 
                  name="observaciones"
                  rows="3"
                  value={cliente.observaciones}
                  onChange={handleClienteChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                  placeholder="¿Algún detalle especial sobre las fotos?"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="btn-primary" 
                disabled={!isFormValid || isSubmitting}
                style={{ 
                  marginTop: '10px',
                  opacity: (isFormValid && !isSubmitting) ? 1 : 0.5,
                  width: '100%'
                }}
              >
                {isSubmitting ? 'Procesando pedido...' : 'Confirmar Pedido de Imanes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
