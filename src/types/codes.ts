// src/types/codes.ts
// redeem codes for user
export type CodesRecord = {
  code: string;
  redeem_date: string | null;
  uid: string;
  game_slug: string;
  valid_from: string;
  game_session_id: string;
  status: string; // pending, active, archived
};
