import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

const issue = (user) =>
  jwt.sign(
    { id: user._id.toString(), email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

export const registerUser = async (req, res) => {
  const { name = "", email, password = "" } = req.body || {};

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Falta email o password" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      return res.status(400).json({ message: "Email inválido" });
    }

    const weak = password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password);
    if (weak) {
      return res.status(422).json({
        message: "La contraseña debe tener al menos 8 caracteres e incluir letras y números.",
      });
    }

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({ message: "Usuario ya existe" });
    }

    const user = new User({
      name: String(name).trim(),
      email: normalizedEmail,
    });

    await user.setPassword(password);
    await user.save();

    const token = issue(user);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name || "",
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear usuario",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password = "" } = req.body || {};

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Falta email o password" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = issue(user);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name || "",
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("_id name email createdAt updatedAt");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json({
      id: user._id,
      name: user.name || "",
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener perfil",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body || {};
    const updates = {};

    if (typeof name === "string") {
      updates.name = name.trim();
    }

    if (typeof email === "string") {
      const newEmail = String(email).trim().toLowerCase();

      if (!/\S+@\S+\.\S+/.test(newEmail)) {
        return res.status(400).json({ message: "Email inválido" });
      }

      const clash = await User.findOne({
        email: newEmail,
        _id: { $ne: req.userId },
      });

      if (clash) {
        return res.status(409).json({ message: "Ese email ya está en uso" });
      }

      updates.email = newEmail;
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: "No hay cambios para actualizar" });
    }

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
      select: "_id name email",
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const token = issue(user);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name || "",
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar perfil",
      error: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword = "", newPassword = "" } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Faltan campos" });
    }

    const weak = newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword);
    if (weak) {
      return res.status(422).json({
        message: "La nueva contraseña debe tener al menos 8 caracteres e incluir letras y números.",
      });
    }

    const user = await User.findById(req.userId).select("+passwordHash");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const ok = await user.validatePassword(currentPassword);
    if (!ok) {
      return res.status(401).json({ message: "La contraseña actual no es correcta" });
    }

    await user.setPassword(newPassword);
    await user.save();

    return res.json({
      ok: true,
      message: "Contraseña actualizada",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al cambiar contraseña",
      error: error.message,
    });
  }
};