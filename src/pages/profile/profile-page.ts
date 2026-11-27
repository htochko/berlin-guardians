// src/pages/profile/profile-page.ts
import { onAuthStateChanged, type User } from 'firebase/auth';
import { toUsersRecordMapper } from '../../api/users-adapter';
import { getFirebaseAuth, FIREBASE_ENDPOINT_QUERY } from '../../services/firebase';
import { AuthMode } from '../../types/auth';
import { DialogParameter, Route, type PageView } from '../../types/routes';
import { createButton } from '../../components/ui/button/button';
import { createElement } from '../../utils/dom';
import { getRouteHref } from '../../utils/url';
import { type UsersRecord } from '../../types/users';
import { type RunQueryResponseItem } from '../../api/firestore-rest';

const USER_DB_NAME = 'users'; // smth urlencoded

export interface ProfilePageOptions {
  readonly onOpenAuth?: (mode: AuthMode) => void;
}

export async function fetchPublicUserByUid(
  uid: string,
  idToken: string,
): Promise<Partial<UsersRecord> | null> {
  const url = FIREBASE_ENDPOINT_QUERY;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: USER_DB_NAME }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'uid' },
            op: 'EQUAL',
            value: { stringValue: uid },
          },
        },
        limit: 1,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const rows: RunQueryResponseItem[] = await response.json();
  return toUsersRecordMapper(rows as unknown as RunQueryResponseItem[]);
}

function formatBalance(balanceCents: number | undefined, currency = 'EUR'): string {
  if (!balanceCents) {
    return `0 ${currency}`;
  }
  const amount = (balanceCents / 100).toFixed(2);
  return `${amount} ${currency}`;
}

export function renderProfilePage(options: ProfilePageOptions = {}): PageView {
  let isDestroyed = false;
  let authSeq = 0;

  const heading: HTMLHeadingElement = createElement('h1', {
    className: 'profile-page__title',
    text: 'Profile',
  });

  const statusText: HTMLParagraphElement = createElement('p', {
    className: 'profile-page__status',
    text: 'Checking session...',
  });

  const loginButton = createButton({
    text: 'Log in',
    onClick: (): void => {
      if (options.onOpenAuth) {
        options.onOpenAuth(AuthMode.Login);
        return;
      }

      const url: URL = new URL(window.location.href);
      url.searchParams.set(DialogParameter.Auth, AuthMode.Login);
      window.history.pushState({}, '', url);
      window.dispatchEvent(new PopStateEvent('popstate'));
    },
  });

  const homeLink = createButton({
    text: 'Back to Home',
    variant: 'outline',
    href: getRouteHref(Route.Home),
  });

  const guestActions: HTMLElement = createElement('div', {
    className: 'profile-page__actions',
    children: [loginButton, homeLink],
  });

  const profileDetails: HTMLElement = createElement('div', {
    className: 'profile-page__details',
  });

  guestActions.hidden = true;
  profileDetails.hidden = true;

  const auth = getFirebaseAuth();

  const unsubscribe = onAuthStateChanged(auth, (user: User | null): void => {
    const currentSeq = ++authSeq;

    if (isDestroyed) {
      return;
    }

    if (!user) {
      profileDetails.hidden = true;
      profileDetails.replaceChildren();
      statusText.textContent = 'You are not signed in. Log in to view your profile.';
      guestActions.hidden = false;
      return;
    }

    guestActions.hidden = true;
    profileDetails.hidden = true;
    statusText.textContent = `Signed in as ${user.email ?? user.uid}. Loading profile...`;

    void (async (): Promise<void> => {
      try {
        console.log('USER_ID', user.uid);
        const token = await user.getIdToken();
        const profile = await fetchPublicUserByUid(user.uid, token);
        if (!profile) {
          statusText.textContent = 'P document was not found in Firestore.';
          return;
        }

        statusText.textContent = `Signed in as @${profile.username}`;
        profileDetails.replaceChildren(
          createElement('p', {
            className: 'profile-page__username',
            text: `Username: ${profile.username}`,
          }),
          createElement('p', {
            className: 'profile-page__balance',
            text: `Balance: ${formatBalance(profile.balance_cents, profile.currency)}`,
          }),
          createElement('p', {
            className: 'profile-page__bio',
            text: profile.bio ? `Bio: ${profile.bio}` : 'Bio: —',
          }),
        );
        profileDetails.hidden = false;
      } catch (error: unknown) {
        if (isDestroyed || currentSeq !== authSeq) {
          return;
        }
        console.error('Failed to load profile from Firestore:', error);
        statusText.textContent = 'Failed to load profile data.';
      }
    })();
  });

  return {
    elements: [heading, statusText, guestActions, profileDetails],
    destroy: (): void => {
      isDestroyed = true;
      unsubscribe();
    },
  };
}
