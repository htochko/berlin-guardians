// src/types/users.ts
export interface UsersRecord {
  uid: string;
  username: string;
  balance_cents: number;
  currency: 'EUR';
  last_login?: string | null;
  logo_img?: string | null;
  full_name?: string | null;
  bio?: string | null;
  is_admin: boolean;
  is_contributor: boolean;
  registered_from: string | null;
  linkedin_link?: string | null;
  github_link?: string | null;
  discord_link?: string | null;
}

export type RawUserProfile = Partial<UsersRecord> & {
  uid?: string;
};
