import { type CategoryRecord } from '../types/categories';
import { type RunQueryResponseItem, toBoolean, toNullableString } from './firestore-rest';

export function toCategoriesRecordMapper(item: RunQueryResponseItem): CategoryRecord | null {
  if (!item.document) {
    return null;
  }

  const fields = item.document.fields ?? {};
  const result: CategoryRecord = {
    tag: fields.uid?.stringValue ?? 'all',
    description: fields.description?.stringValue ?? '',
    icon_path: fields.icon_path?.stringValue ?? '',
    published: fields.published?.booleanValue ?? false,
  };

  if ('tag' in fields) {
    const tag = toNullableString(fields.tag);
    if (tag !== null) {
      result.tag = tag;
    }
  }

  if ('description' in fields) {
    result.description = toNullableString(fields.description);
  }

  if ('icon_path' in fields) {
    result.icon_path = toNullableString(fields.icon_path);
  }

  if ('published' in fields) {
    result.published = toBoolean(fields.published);
  }

  return result;
}
