import React from 'react';
import '../styles/Start.css'; // Cambié el nombre de los estilos a Start.css

const Start = () => {
  const handleButtonClick = (section) => {
    console.log(`Navegar a: ${section}`);
    // Aquí podrías usar navigate(`/ruta`) si usas react-router
  };

  return (
    <div className="start-container">
      <div className="cardStart">
        <img src="/img/Home/logoEM.jpg" alt="Logo Empanadas Emanuel" className="logoEM" />
        <h2 className='titlePanel'>Panel Principal</h2>
        <div className="button-group">
          <button onClick={() => handleButtonClick('proveedores')}>Proveedores</button>
          <button onClick={() => handleButtonClick('pedidos')}>Pedidos</button>
          <button onClick={() => handleButtonClick('inventario')}>Inventario</button>
          <button onClick={() => handleButtonClick('produccion')}>Producción</button>
        </div>
        <div className="alert">
          ⚠️ Alerta: Algunos productos están bajos en inventario.
        </div>
      </div>
    </div>
  );
};

export default Start;
