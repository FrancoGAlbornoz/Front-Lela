import { useState, useEffect } from 'react';
import StepSize from './StepSize';
import StepCover from './StepCover';
import StepAddons from './StepAddons';
import StepCheckout from './StepCheckout';
import './AgendaBuilder.css';

const STEPS = [
  { id: 1, title: 'Formato' },
  { id: 2, title: 'Tapa y Diseño' },
  { id: 3, title: 'Adicionales' },
  { id: 4, title: 'Resumen' }
];

export default function AgendaBuilder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [catalogo, setCatalogo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [agendaData, setAgendaData] = useState({
    tamano: null,
    interior: null,
    tipografia: null,
    fondoTapa: null,
    imagenPersonalizada: null,
    textoTapa: '',
    orientacion: 'Vertical',
    adicionales: [],
    observaciones: '',
    cliente: {
      nombre: '',
      email: '',
      telefono: ''
    },
    cantidad: 1
  });

  useEffect(() => {
    fetch('http://localhost:3000/api/catalogo')
      .then(res => res.json())
      .then(data => {
        setCatalogo(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando catálogo:", err);
        setLoading(false);
      });
  }, []);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const updateData = (newData) => {
    setAgendaData(prev => ({ ...prev, ...newData }));
  };

  if (loading) {
    return <div className="text-center" style={{ padding: '50px' }}>Cargando opciones...</div>;
  }

  if (!catalogo) {
    return <div className="text-center" style={{ padding: '50px', color: 'red' }}>Error al conectar con el servidor.</div>;
  }

  return (
    <div className="agenda-builder">
      <div className="stepper">
        {STEPS.map((step) => (
          <div 
            key={step.id} 
            className={`step-indicator ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
          >
            <div className="step-number">{step.id}</div>
            <span className="step-title">{step.title}</span>
          </div>
        ))}
      </div>

      <div className="step-content card">
        {currentStep === 1 && <StepSize data={agendaData} updateData={updateData} nextStep={nextStep} tamanos={catalogo.tamanos} interiores={catalogo.interiores} />}
        {currentStep === 2 && <StepCover data={agendaData} updateData={updateData} nextStep={nextStep} prevStep={prevStep} fondos={catalogo.fondos} tipografias={catalogo.tipografias} />}
        {currentStep === 3 && <StepAddons data={agendaData} updateData={updateData} nextStep={nextStep} prevStep={prevStep} adicionales={catalogo.adicionales} />}
        {currentStep === 4 && <StepCheckout data={agendaData} updateData={updateData} prevStep={prevStep} />}
      </div>
    </div>
  );
}
