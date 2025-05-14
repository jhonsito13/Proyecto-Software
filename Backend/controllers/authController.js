const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Función para el login
exports.login = async (req, res) => {
  const { nombre_usuario, contrasena } = req.body;

  try {
    // Buscar al usuario en la base de datos
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const usuario = rows[0];

    // Verificar la contraseña
    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValida) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Crear el token JWT
    const token = jwt.sign(
      { id: usuario.id, nombre_usuario: usuario.nombre_usuario, rol_id: usuario.rol_id },
      process.env.JWT_SECRET,  // La clave secreta debe estar en el archivo .env
      { expiresIn: '1h' }  // El token expira en 1 hora
    );

    // Enviar el token al cliente
    res.json({ token,
       usuario: {
    id: usuario.id,
    nombre_usuario: usuario.nombre_usuario,
    rol_id: usuario.rol_id
  }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al realizar login' });
  }
};
