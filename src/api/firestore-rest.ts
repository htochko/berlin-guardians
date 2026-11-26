import { firebaseConfig, FIREBASE_ENDPOINT } from '../services/firebase';

export interface RunQueryDocument {
  name: string;
  fields?: Record<string, FirestoreFieldValue>;
}

export interface FirestoreRestDocument {
  readonly name: string;
  readonly fields?: Record<string, FirestoreRestValue>;
  readonly createTime?: string;
  readonly updateTime?: string;
}

interface FirestoreFieldValue {
  stringValue?: string;
  integerValue?: string;
  booleanValue?: boolean;
  timestampValue?: string;
  nullValue?: null;
  referenceValue?: string;
}

export interface RunQueryResponseItem {
  document?: {
    name: string;
    fields?: Record<string, FirestoreFieldValue>;
    createTime?: string;
    updateTime?: string;
  };
  readTime?: string;
}

export function toNumber(field?: FirestoreFieldValue, fallback = 0): number {
  if (field?.integerValue === undefined) {
    return fallback;
  }
  const value = Number(field.integerValue);
  return Number.isFinite(value) ? value : fallback;
}

export function toBoolean(field?: FirestoreFieldValue, fallback = false): boolean {
  if (typeof field?.booleanValue !== 'boolean') {
    return fallback;
  }
  return field.booleanValue;
}

export function toNullableString(field?: FirestoreFieldValue): string | null {
  if (!field || field.nullValue === null) {
    return null;
  }
  return field.stringValue ?? field.timestampValue ?? null;
}

export function extractSlugFromName(name: string): string {
  return name.split('/').at(-1) ?? 'default';
}

export function extractSlugFromRef(field?: FirestoreFieldValue): string {
  const ref = field?.referenceValue;
  if (!ref) {
    return 'default';
  }
  const parts = ref.split('/');
  return parts.at(-1) ?? 'default';
}

export type FirestoreRestValue =
  | { readonly stringValue: string }
  | { readonly integerValue: string }
  | { readonly doubleValue: number }
  | { readonly booleanValue: boolean }
  | { readonly nullValue: null }
  | { readonly timestampValue: string }
  | { readonly mapValue: { readonly fields?: Record<string, FirestoreRestValue> } }
  | { readonly arrayValue: { readonly values?: readonly FirestoreRestValue[] } };

export async function restGetCollection(
  collectionName: string,
  pageSize = 20,
): Promise<FirestoreRestDocument[]> {
  const url = `${FIREBASE_ENDPOINT}/${collectionName}?pageSize=${pageSize}&key=${encodeURIComponent(firebaseConfig.apiKey)}`;
  const response = await fetch(url);

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Firestore REST GET /${collectionName} failed (${response.status}): ${details}`,
    );
  }

  const data = (await response.json()) as { documents?: FirestoreRestDocument[] };
  return data.documents ?? [];
}

export async function restGetDocument(
  collectionName: string,
  docId: string,
): Promise<FirestoreRestDocument | null> {
  const url = `${FIREBASE_ENDPOINT}/${collectionName}/${encodeURIComponent(docId)}?key=${encodeURIComponent(firebaseConfig.apiKey)}`;
  const response = await fetch(url);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Firestore REST GET /${collectionName}/${docId} failed (${response.status}): ${details}`,
    );
  }

  return (await response.json()) as FirestoreRestDocument;
}

export async function restCreateDocument(
  collectionName: string,
  fields: Record<string, unknown>,
  idToken?: string,
): Promise<unknown> {
  const url =
    `${FIREBASE_ENDPOINT}/${collectionName}` + `?key=${encodeURIComponent(firebaseConfig.apiKey)}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (idToken) {
    headers.Authorization = `Bearer ${idToken}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ fields }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Firestore REST POST /${collectionName} failed (${response.status}): ${details}`,
    );
  }

  return response.json();
}

export interface RunQueryFilter {
  fieldFilter?: {
    field: { fieldPath: string };
    op: 'EQUAL';
    value: { integerValue?: string; referenceValue?: string };
  };
  compositeFilter?: {
    op: 'AND';
    filters: NonNullable<RunQueryFilter['fieldFilter']>[];
  };
}
