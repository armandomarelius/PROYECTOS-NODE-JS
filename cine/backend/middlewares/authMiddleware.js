import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  console.log('Cookie token:', req.cookies.token);
  
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado, no autenticado" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verificado:', verified);
    req.userId = verified.userId;
    console.log('UserId establecido:', req.userId);
    next();
  } catch (err) {
    console.error('Error en verificación de token:', err);
    res.status(403).json({ message: "Token inválido o expirado" });
  }
};

export default authMiddleware