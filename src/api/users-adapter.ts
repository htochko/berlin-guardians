import { type UsersRecord } from '../types/users';
import { type RunQueryResponseItem, toNumber, toNullableString } from './firestore-rest';

export function toUsersRecordMapper(rows: RunQueryResponseItem[]): UsersRecord | null {
  const doc = rows.find((item) => item.document)?.document;
  if (!doc) {
    return null;
  }

  const fields = doc.fields ?? {};

  const result: UsersRecord = {
    uid: fields.uid?.stringValue ?? '',
    username: fields.username?.stringValue ?? '',
    full_name: fields.username?.stringValue ?? '',
    balance_cents: toNumber(fields.balance_cents, 0),
    currency: fields.currency?.stringValue === 'EUR' ? 'EUR' : 'EUR',
    is_admin: fields.is_admin?.booleanValue ?? false,
    is_contributor: fields.is_contributor?.booleanValue ?? false,
    registered_from: toNullableString(fields.registered_from),
  };

  if ('last_login' in fields) {
    result.last_login = toNullableString(fields.last_login);
  }
  if ('logo_img' in fields) {
    result.logo_img = toNullableString(fields.logo_img);
  }
  if ('bio' in fields) {
    result.bio = toNullableString(fields.bio);
  }
  if ('linkedin_link' in fields) {
    result.linkedin_link = toNullableString(fields.linkedin_link);
  }
  if ('github_link' in fields) {
    result.github_link = toNullableString(fields.github_link);
  }
  if ('discord_link' in fields) {
    result.discord_link = toNullableString(fields.discord_link);
  }

  return result;
}
