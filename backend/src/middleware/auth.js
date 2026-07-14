import jwt from 'jsonwebtoken';

export const adminAuth = (req, res, next) => {
  const token = req.cookies.admin_token;
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. Admin session required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-admin-token-key');
    if (!decoded.is_admin) {
      return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized. Invalid admin session.' });
  }
};
