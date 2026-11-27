import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
  type Unsubscribe,
  type UserCredential,
} from 'firebase/auth';
import { getFirebaseAuth, getFirebaseDb } from './firebase';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';

const INITIAL_BALANCE_CENTS = 50000;

export interface RegisterWithEmailInput {
  readonly email: string;
  readonly password: string;
  readonly username: string;
  readonly full_name: string;
}

export class UsernameTakenError extends Error {
  public readonly code = 'USERNAME_TAKEN';

  public constructor(username: string) {
    super(`Username "${username}" is already taken.`);
    this.name = 'UsernameTakenError';
  }
}

export function normalizeUsername(rawUsername: string): string {
  return rawUsername.trim().toLowerCase();
}

export async function registerWithEmail(
  email: string,
  password: string,
  username: string | undefined,
  full_name: string | undefined,
): Promise<UserCredential> {
  const auth = getFirebaseAuth();
  const db = getFirebaseDb();

  if (!username) {
    throw new Error('USERNAME_REQUIRED');
  }

  const normalizedUsername = normalizeUsername(username);

  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);

  const userRef = doc(db, 'users', normalizedUsername);

  try {
    await runTransaction(db, async (transaction) => {
      const existing = await transaction.get(userRef);
      if (existing.exists()) {
        throw new UsernameTakenError(normalizedUsername);
      }

      transaction.set(userRef, {
        uid: credential.user.uid,
        username,
        full_name,
        balance_cents: INITIAL_BALANCE_CENTS,
        currency: 'EUR',
        last_login: serverTimestamp(),
        is_admin: false,
        is_contributor: false,
        registered_from: serverTimestamp(),
      });
    });

    return credential;
  } catch (error: unknown) {
    // Avoid leaving an Auth user behind if profile creation failed
    try {
      await deleteUser(credential.user);
    } catch {
      // Ignore cleanup errors and surface the original registration error
    }
    throw error;
  }
}

/*
export async function registerWithEmail(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth();
  return createUserWithEmailAndPassword(auth, email, password)
  .then((cred) => cred.user);
}
  */

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth();
  return signInWithEmailAndPassword(auth, email, password).then((cred) => cred.user);
}

export async function logoutUser(): Promise<void> {
  const auth = getFirebaseAuth();
  return signOut(auth);
}

export function subscribeToAuthState(callback: (user: User | null) => void): Unsubscribe {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
}

export function formatAuthError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password.';
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      default:
        return error.message || 'Authentication error.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Authentication failed. Please try again.';
}
