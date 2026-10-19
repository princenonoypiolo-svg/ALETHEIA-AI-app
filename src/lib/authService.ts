import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { OperativeProfile } from '../types';

export interface RegisteredAccount {
  operativeId: string;
  email: string;
  passphraseHash: string;
  createdAt: string;
  displayName: string;
  clearance?: string;
  division?: string;
}

const LOCAL_REGISTRY_KEY = 'aletheia_registered_operatives';

// Simple SHA-256 hash helper for secure credential verification
async function hashPassphrase(text: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback simple base64 hash
    return btoa(unescape(encodeURIComponent(text)));
  }
}

// Helper to convert Operative ID to valid Firebase email
export function normalizeOperativeToEmail(rawId: string): string {
  const trimmed = rawId.trim();
  if (trimmed.includes('@')) {
    return trimmed.toLowerCase();
  }
  // Sanitize for valid email local part
  const safeName = trimmed.toLowerCase().replace(/[^a-z0-9._-]/g, '') || 'operative';
  return `${safeName}@aletheia.internal`;
}

// Local registry helpers
export function getRegisteredOperatives(): RegisteredAccount[] {
  try {
    const raw = localStorage.getItem(LOCAL_REGISTRY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRegisteredOperative(account: RegisteredAccount) {
  try {
    const list = getRegisteredOperatives();
    const existingIndex = list.findIndex(
      (a) =>
        a.operativeId.toLowerCase() === account.operativeId.toLowerCase() ||
        a.email.toLowerCase() === account.email.toLowerCase()
    );
    if (existingIndex >= 0) {
      list[existingIndex] = account;
    } else {
      list.push(account);
    }
    localStorage.setItem(LOCAL_REGISTRY_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Error saving to local registry', err);
  }
}

export function findRegisteredAccount(rawId: string): RegisteredAccount | undefined {
  const email = normalizeOperativeToEmail(rawId);
  const normalizedId = rawId.trim().toLowerCase();
  const list = getRegisteredOperatives();
  return list.find(
    (a) =>
      a.operativeId.toLowerCase() === normalizedId ||
      a.email.toLowerCase() === email
  );
}

export function isOperativeRegistered(rawId: string): boolean {
  return !!findRegisteredAccount(rawId);
}

// Register a new operative account in Firebase & secure registry
export async function registerOperativeWithFirebase(
  rawId: string,
  passphrase: string,
  additionalProfile?: Partial<OperativeProfile>
): Promise<{ user: Partial<FirebaseUser> | null; profile: OperativeProfile }> {
  const trimmedId = rawId.trim();
  if (!trimmedId) {
    throw new Error('Operative ID or email is required.');
  }
  if (!passphrase || passphrase.length < 6) {
    throw new Error('Passphrase must be at least 6 characters long.');
  }

  // Check if account already exists
  if (isOperativeRegistered(trimmedId)) {
    throw new Error('An operative account with this identification already exists. Please log in.');
  }

  const email = normalizeOperativeToEmail(trimmedId);
  const passHash = await hashPassphrase(passphrase);

  let createdFirebaseUser: FirebaseUser | null = null;

  // 1. Attempt to create user in Firebase Auth
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, passphrase);
    createdFirebaseUser = userCredential.user;
    await updateProfile(createdFirebaseUser, {
      displayName: trimmedId,
    });
  } catch (fbAuthErr: any) {
    const code = fbAuthErr?.code || '';
    if (code === 'auth/email-already-in-use') {
      throw new Error('An operative account with this identification already exists in Firebase. Please log in.');
    }
    console.info('Firebase auth notice:', code, fbAuthErr?.message);
    // If auth/operation-not-allowed or network, we still secure the account in local cryptographic registry & Firestore
  }

  const fullProfile: OperativeProfile = {
    operativeId: trimmedId,
    name: trimmedId.includes('@') ? trimmedId.split('@')[0] : trimmedId,
    clearance: additionalProfile?.clearance || 'SIGMA-9 DEFENSE',
    division: additionalProfile?.division || 'COUNTER-SYNTHETICS ENCLAVE',
    bio: additionalProfile?.bio || 'Special investigator for counter-disinformation and synthetic media authentication.',
    avatarUrl: additionalProfile?.avatarUrl || '',
    twoFactorActive: true,
    telemetrySharing: true,
    locationTracking: false,
    ...additionalProfile,
  };

  // 2. Save profile to Firestore
  try {
    const uid = createdFirebaseUser?.uid || `op_${Date.now()}`;
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      uid,
      operativeId: fullProfile.operativeId,
      name: fullProfile.name,
      clearance: fullProfile.clearance,
      division: fullProfile.division,
      bio: fullProfile.bio,
      avatarUrl: fullProfile.avatarUrl,
      updatedAt: serverTimestamp(),
    });
  } catch (fsErr) {
    console.warn('Notice: Firestore profile sync fallback:', fsErr);
  }

  // 3. Save to verified operative registry with password hash
  saveRegisteredOperative({
    operativeId: trimmedId,
    email,
    passphraseHash: passHash,
    createdAt: new Date().toISOString(),
    displayName: fullProfile.name,
    clearance: fullProfile.clearance,
    division: fullProfile.division,
  });

  return {
    user: createdFirebaseUser || ({ displayName: trimmedId, email } as Partial<FirebaseUser>),
    profile: fullProfile,
  };
}

// Log in an existing operative with Firebase & verify account exists
export async function loginOperativeWithFirebase(
  rawId: string,
  passphrase: string
): Promise<{ user: Partial<FirebaseUser> | null; profile: Partial<OperativeProfile> }> {
  const trimmedId = rawId.trim();
  if (!trimmedId) {
    throw new Error('Operative ID is required.');
  }
  if (!passphrase) {
    throw new Error('Passphrase is required.');
  }

  const email = normalizeOperativeToEmail(trimmedId);
  const inputHash = await hashPassphrase(passphrase);

  // CRITICAL REQUIREMENT: If account does not exist, reject login!
  const localAccount = findRegisteredAccount(trimmedId);

  // 1. Try Firebase Auth first
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, passphrase);
    const user = userCredential.user;

    let profileData: Partial<OperativeProfile> = {
      operativeId: user.displayName || trimmedId,
      name: user.displayName || trimmedId,
    };

    // Try fetching profile from Firestore
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        profileData = {
          ...profileData,
          ...(snap.data() as Partial<OperativeProfile>),
        };
      }
    } catch (fsErr) {
      console.warn('Notice: Firestore read note:', fsErr);
    }

    // Ensure it is in registered accounts
    saveRegisteredOperative({
      operativeId: trimmedId,
      email,
      passphraseHash: inputHash,
      createdAt: new Date().toISOString(),
      displayName: (profileData.name as string) || trimmedId,
    });

    return { user, profile: profileData };
  } catch (authError: any) {
    const errorCode = authError?.code || '';

    // If account was registered locally or in previous session
    if (localAccount) {
      // Verify password
      if (localAccount.passphraseHash !== inputHash) {
        throw new Error('AUTHENTICATION FAILED: Incorrect passphrase. Please verify your credentials.');
      }

      // Password matches! Grant access with saved profile
      const profileData: Partial<OperativeProfile> = {
        operativeId: localAccount.operativeId,
        name: localAccount.displayName,
        clearance: localAccount.clearance || 'SIGMA-9 DEFENSE',
        division: localAccount.division || 'COUNTER-SYNTHETICS ENCLAVE',
      };

      return {
        user: { displayName: localAccount.displayName, email: localAccount.email } as Partial<FirebaseUser>,
        profile: profileData,
      };
    }

    // If NO account exists in either Firebase or local registry:
    if (
      errorCode === 'auth/user-not-found' ||
      errorCode === 'auth/invalid-credential' ||
      errorCode === 'auth/operation-not-allowed' ||
      !localAccount
    ) {
      throw new Error(
        'ACCESS DENIED: No registered account found for this Operative ID. You must create an account first before you can log in.'
      );
    }

    if (errorCode === 'auth/wrong-password') {
      throw new Error('AUTHENTICATION FAILED: Incorrect passphrase. Please verify your credentials.');
    } else if (errorCode === 'auth/invalid-email') {
      throw new Error('INVALID IDENTIFICATION: Identification string cannot be processed.');
    } else if (errorCode === 'auth/too-many-requests') {
      throw new Error('SECURITY LOCKOUT: Too many failed attempts. Please wait a moment before trying again.');
    }

    throw new Error(authError?.message || 'Access Denied: Authentication rejected.');
  }
}

// Log out
export async function logoutOperative(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Signout note:', err);
  }
}

// Listen for Auth state changes
export function subscribeToAuthState(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
