import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // For this demo, we'll decode the Supabase JWT to extract the user ID ('sub' claim).
    // In production, you MUST use supabase-js to verify the token signature, or set the SUPABASE_JWT_SECRET.
    const decoded = jwt.decode(token) as any;
    if (!decoded || (!decoded.userId && !decoded.sub)) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token payload' });
    }
    req.user = { userId: decoded.sub || decoded.userId };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}

export function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.decode(token) as any;
      if (decoded && (decoded.sub || decoded.userId)) {
        req.user = { userId: decoded.sub || decoded.userId };
      }
    } catch (err) {
      // Ignore errors for optional auth
    }
  }
  
  next();
}
