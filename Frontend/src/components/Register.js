import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../src/styles/Register.css'; // Asegúrate de tener la ruta correcta para los estilos

const LoginForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: ''
  });

  // Manejo del cambio en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log(formData);
   try {
      const response = await fetch('/api/auth/register', { // <-- ¡Asegúrate de que la URL sea esta!
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registro exitoso:', data);
        // Redirigir al usuario a la página de inicio de sesión o mostrar un mensaje de éxito
        navigate('/login');
      } else {
        const errorData = await response.json();
        console.error('Error al registrar:', errorData);
        // Mostrar un mensaje de error al usuario
      }
    } catch (error) {
      console.error('Error de red:', error);
      // Mostrar un mensaje de error de red al usuario
    }
    // Redirige al login después del registro (esto se duplicará si la llamada a la API es exitosa)
    // navigate('/login');


  // Redirige al login después del registro
 
};
  

  return (
    <div className='body'>
    <div className="register-form-container">
    <img src="/img/Home/logoEM.jpg" alt="Logo Empanadas Emanuel" className="logoEM" />
      <h2 className='titulo-register-form'>Registro de trabajador</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">Nombre:</label>
          <input
            autoFocus
            pattern='[a-za-z0-9\s]{3,50}'
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Apellidos:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Rol de Empresa:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un rol</option>
            <option value="administrador">Administrador</option>
            <option value="contable">Contable</option>
            <option value="produccion">Producción</option>
            <option value="bodega">Bodega</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button className='button-form-register' type="submit">Crear cuenta</button>
      </form>
    </div>
  </div>
  );
};

export default LoginForm;
