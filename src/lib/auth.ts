import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function authenticateToken(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (!authHeader) return null;
      
      const [bearer, bearerToken] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !bearerToken) return null;
      
      return verifyToken(bearerToken);
    }

    return verifyToken(token);
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; email: string };
  } catch {
    return null;
  }
}

export function generateToken(user: { id: number; email: string }) {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
} 