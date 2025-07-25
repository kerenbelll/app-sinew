import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(''); // 'success', 'error', or ''

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.message.trim()) newErrors.message = 'El mensaje no puede estar vacío';
    return newErrors;
  };

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Por ahora no hay backend, simulamos éxito
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });

      // Opcional: limpiar mensaje después de 5 segundos
      setTimeout(() => setStatus(''), 5000);
    } else {
      setStatus('error');
    }
  };

  return (
    <section className="max-w-lg mx-auto p-8 bg-primary rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold mb-7 text-center">CONTACTANOS</h2>

      {status === 'success' && (
        <div className="mb-4 p-4 bg-green-600 rounded">¡Mensaje enviado con éxito!</div>
      )}
      {status === 'error' && (
        <div className="mb-4 p-4 bg-red-600 rounded">Por favor corrige los errores antes de enviar.</div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col space-y-5">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Tu nombre"
            value={formData.name}
            onChange={handleChange}
            className={`p-3 rounded bg-secondary placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-mint w-full ${
              errors.name ? 'ring-2 ring-red-500' : ''
            }`}
          />
          {errors.name && <p className="text-red-400 mt-1 text-sm">{errors.name}</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Tu email"
            value={formData.email}
            onChange={handleChange}
            className={`p-3 rounded bg-secondary placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-mint w-full ${
              errors.email ? 'ring-2 ring-red-500' : ''
            }`}
          />
          {errors.email && <p className="text-red-400 mt-1 text-sm">{errors.email}</p>}
        </div>

        <div>
          <textarea
            name="message"
            placeholder="Tu mensaje"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className={`p-3 rounded bg-secondary placeholder-white text-white resize-none focus:outline-none focus:ring-2 focus:ring-mint w-full ${
              errors.message ? 'ring-2 ring-red-500' : ''
            }`}
          />
          {errors.message && <p className="text-red-400 mt-1 text-sm">{errors.message}</p>}
        </div>

        <button
          type="submit"
          className="bg-mint text-black font-semibold py-3 rounded hover:bg-mint/90 transition disabled:opacity-50"
        >
          Enviar mensaje
        </button>
      </form>
    </section>
  );
}