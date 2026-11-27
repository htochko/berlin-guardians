// src/services/firebase.ts
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, type Firestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  databaseName: import.meta.env.VITE_FIREBASE_DATABASE_NAME || '(default)',
};

export const FIREBASE_ENDPOINT = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.databaseName}/documents`;
export const FIREBASE_ENDPOINT_QUERY = `${FIREBASE_ENDPOINT}:runQuery`;

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

export function getFirebaseDb(): Firestore {
  if (!db) {
    db = initializeFirestore(
      getFirebaseApp(),
      {
        localCache: persistentLocalCache({}),
      },
      firebaseConfig.databaseName,
    );
  }
  return db;
}
