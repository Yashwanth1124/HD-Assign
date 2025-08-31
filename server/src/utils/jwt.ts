import jwt, { SignOptions, Secret } from 'jsonwebtoken';

// Ensure the secret is typed as jwt.Secret to satisfy jsonwebtoken v9 types
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'dev_secret';

export function signToken(
  payload: object,
  expiresIn: SignOptions['expiresIn'] = '1d'
) {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken<T = any>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T;
}