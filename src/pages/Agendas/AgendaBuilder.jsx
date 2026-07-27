import { useState } from 'react';
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
    }
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const updateData = (newData) => {
    setAgendaData(prev => ({ ...prev, ...newData }));
  };

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
        {currentStep === 1 && <StepSize data={agendaData} updateData={updateData} nextStep={nextStep} />}
        {currentStep === 2 && <StepCover data={agendaData} updateData={updateData} nextStep={nextStep} prevStep={prevStep} />}
        {currentStep === 3 && <StepAddons data={agendaData} updateData={updateData} nextStep={nextStep} prevStep={prevStep} />}
        {currentStep === 4 && <StepCheckout data={agendaData} updateData={updateData} prevStep={prevStep} />}
      </div>
    </div>
  );
}
