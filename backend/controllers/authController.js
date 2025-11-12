// backend/controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const issue = (user) =>
  jwt.sign({ id: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '7d' });

export const registerUser = async (req, res) => {
  const { name = '', email, password = '' } = req.body || {};
  try {
    if (!email || !password) return res.status(400).json({ message: 'Falta email o password' });

    const exists = await User.findOne({ email: String(email).toLowerCase() });
    if (exists) return res.status(400).json({ message: 'Usuario ya existe' });

    const user = new User({ name: String(name).trim(), email: String(email).toLowerCase() });
    await user.setPassword(password);
    await user.save();

    const token = issue(user);
    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name || '', email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password = '' } = req.body || {};
  try {
    if (!email || !password) return res.status(400).json({ message: 'Falta email o password' });

    const user = await User.findOne({ email: String(email).toLowerCase() }).select('+passwordHash');
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = issue(user);
    return res.json({
      token,
      user: { id: user._id, name: user.name || '', email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('_id name email createdAt updatedAt');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.json({ id: user._id, name: user.name || '', email: user.email });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
  }
};

/* === NUEVO: actualizar perfil (nombre/email) === */
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body || {};
    const updates = {};
    if (typeof name === 'string') updates.name = name.trim();
    if (typeof email === 'string') {
      const newEmail = String(email).toLowerCase().trim();
      // evitar duplicados si cambia el email
      const clash = await User.findOne({ email: newEmail, _id: { $ne: req.userId } });
      if (clash) return res.status(400).json({ message: 'Ese email ya está en uso' });
      updates.email = newEmail;
    }
    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
      select: '_id name email',
    });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // si cambió el email y usás email en el token, podés reemitir token
    const token = issue(user);
    return res.json({ token, user: { id: user._id, name: user.name || '', email: user.email } });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
  }
};

/* === NUEVO: cambiar contraseña === */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword = '', newPassword = '' } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Faltan campos' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 8 caracteres' });
    }
    const user = await User.findById(req.userId).select('+passwordHash');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const ok = await user.validatePassword(currentPassword);
    if (!ok) return res.status(401).json({ message: 'La contraseña actual no es correcta' });

    await user.setPassword(newPassword);
    await user.save();

    return res.json({ ok: true, message: 'Contraseña actualizada' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al cambiar contraseña', error: error.message });
  }
};