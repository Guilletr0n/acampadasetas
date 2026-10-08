import type { AstroCookies } from 'astro';
import type { User, UserRole } from './types';
import { getUserByEmail } from './users';

const AUTH_COOKIE_NAME = 'as_session_user';

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

  // Quick fallback bootstrap credentials
  if (cleanEmail === 'arrendataria@zohomail.com' && pass === 'admin123') {
    return {
      uid: 'user-admin-01',
      email: 'arrendataria@zohomail.com',
      displayName: 'Administración Acampada',
      role: 'admin',
      approved: true,
    };
  }

  return null;
}

export function setAuthCookie(cookies: AstroCookies, user: User) {
  cookies.set(AUTH_COOKIE_NAME, JSON.stringify(user), {
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

  try {
    const user = JSON.parse(cookie.value) as User;
    return user;
  } catch {
    return null;
  }
}

// RBAC Permissions
export function canManageUsers(user: User | null): boolean {
  return user?.role === 'admin';
}

export function canEditContent(user: User | null): boolean {
  return (user?.role === 'admin' || user?.role === 'editor') && user.approved === true;
}
