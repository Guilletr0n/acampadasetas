import crypto from 'node:crypto';
import type { AstroCookies } from 'astro';
import type { User, UserRole } from './types';
import { getUserByEmail } from './users';

const AUTH_COOKIE_NAME = 'as_session_user';
const SESSION_SECRET = process.env.SESSION_SECRET || 'acampada-setas-session-secret-key-2026';

function serializeUserSession(user: User): string {
  const sessionData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    approved: user.approved,
  };
  const payload = Buffer.from(JSON.stringify(sessionData), 'utf-8').toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function deserializeUserSession(cookieValue: string): User | null {
  if (!cookieValue || typeof cookieValue !== 'string') return null;
  const parts = cookieValue.split('.');
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;
  if (!payload || !signature) return null;

  const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const raw = Buffer.from(payload, 'base64url').toString('utf-8');
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object' || !data.uid || !data.role) {
      return null;
    }
    return data as User;
  } catch {
    return null;
  }
}

export async function authenticateWithPassword(email: string, pass: string): Promise<User | null> {
  const cleanEmail = email.trim().toLowerCase();

  const dbUser = await getUserByEmail(cleanEmail);
  if (dbUser) {
    if (dbUser.password && dbUser.password === pass) {
      return {
        uid: dbUser.uid,
        email: dbUser.email,
        displayName: dbUser.displayName,
        role: dbUser.role,
        approved: dbUser.approved,
      };
    }
    return null;
  }

  return null;
}

export function setAuthCookie(cookies: AstroCookies, user: User) {
  const token = serializeUserSession(user);
  cookies.set(AUTH_COOKIE_NAME, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
  });
}

export function clearAuthCookie(cookies: AstroCookies) {
  cookies.delete(AUTH_COOKIE_NAME, {
    path: '/',
  });
}

export async function getCurrentUser(cookies: AstroCookies): Promise<User | null> {
  const cookie = cookies.get(AUTH_COOKIE_NAME);
  if (!cookie || !cookie.value) return null;

  return deserializeUserSession(cookie.value);
}

// RBAC Permissions
export function canManageUsers(user: User | null): boolean {
  return user?.role === 'admin';
}

export function canEditContent(user: User | null): boolean {
  return (user?.role === 'admin' || user?.role === 'editor') && user.approved === true;
}
