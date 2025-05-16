const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Función para el registro de nuevos usuarios
exports.register = async (req, res) => {
  
  const { firstName, lastName, email, password, role } = req.body; // Ajusta los nombres según tu formulario
  
  try {
    // Verificar si el usuario ya existe por email (o nombre de usuario, según tu lógica)
    const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]); // O WHERE nombre_usuario = ?

    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'El usuario con este email ya existe' }); // 409 Conflict
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar el nuevo usuario en la base de datos
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, apellido, email, contrasena, rol_id) VALUES (?, ?, ?, ?, ?)', // Ajusta los nombres de las columnas
      [firstName, lastName, email, hashedPassword, role || 2] // Asigna un rol por defecto (ej: 2 para 'usuario')
    );

    const userId = result.insertId;

    // Crear un token JWT para el usuario recién registrado (opcional)
    const token = jwt.sign(
      { id: userId, email: email, rol_id: role || 2 }, // Ajusta la información del payload
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Enviar una respuesta de éxito con el token (opcional) y la información del usuario
    res.status(201).json({ // 201 Created
      message: 'Usuario registrado exitosamente',
      token: token,
      user: {
        id: userId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: role || 2
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

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
