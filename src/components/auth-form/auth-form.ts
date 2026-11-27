import { createElement } from '../../utils/dom';
import { AuthMode } from '../../types/auth';
import { AUTH_TEXT } from '../../constants/constants';

// ! No own CSS:
// ! styles come from base.css (form, field, labels, inputs)
// ! and button.css (.btn)

export interface AuthCredentials {
  readonly email: string;
  readonly password: string;
  username: string | undefined;
  full_name: string | undefined;
}

export interface AuthFormOptions {
  readonly mode: AuthMode;
  readonly onSubmit: (credentials: AuthCredentials, mode: AuthMode) => Promise<void> | void;
  readonly onSwitchMode: (nextMode: AuthMode) => void;
}

export interface AuthFormView {
  readonly element: HTMLFormElement;
  readonly setError: (message: string) => void;
  readonly setSubmitting: (isSubmitting: boolean) => void;
}

export function createAuthForm(options: AuthFormOptions): AuthFormView {
  const isRegister = options.mode === AuthMode.Register;

  const description = createElement('p', {
    className: 'form__description',
    text: isRegister
      ? 'Create an account to save your progress and items.'
      : 'Log in with your email and password.',
  });

  const usernameInput = createElement('input', {
    attributes: {
      id: 'users-username',
      name: 'username',
      type: 'text',
      autocomplete: 'username',
      required: 'true',
      placeholder: 'username',
    },
  });

  const usernameLabel = createElement('label', {
    text: 'Username',
    attributes: { for: 'users-username' },
  });

  const usernameField = createElement('div', {
    className: 'field',
    children: [usernameLabel, usernameInput],
  });
  usernameField.hidden = !isRegister;

  const fullnameInput = createElement('input', {
    attributes: {
      id: 'users-fullname',
      name: 'fullname',
      type: 'text',
      autocomplete: 'name',
      placeholder: 'Name Surname',
    },
  });

  const fullnameLabel = createElement('label', {
    text: 'Full Name',
    attributes: { for: 'users-fullname' },
  });

  const fullnameField = createElement('div', {
    className: 'field',
    children: [fullnameLabel, fullnameInput],
  });
  fullnameField.hidden = !isRegister;

  const emailInput = createElement('input', {
    attributes: {
      id: 'auth-email',
      name: 'email',
      type: 'email',
      autocomplete: 'email',
      required: 'true',
      placeholder: 'name@example.com',
    },
  });

  const emailLabel = createElement('label', {
    text: 'Email',
    attributes: { for: 'auth-email' },
  });

  const emailField = createElement('div', {
    className: 'field',
    children: [emailLabel, emailInput],
  });

  const passwordInput = createElement('input', {
    attributes: {
      id: 'auth-password',
      name: 'password',
      type: 'password',
      autocomplete: isRegister ? 'new-password' : 'current-password',
      required: 'true',
      minlength: '6',
      placeholder: '••••••••',
    },
  });

  const passwordLabel = createElement('label', {
    text: 'Password',
    attributes: { for: 'auth-password' },
  });

  // todo add confirm password
  const passwordField = createElement('div', {
    className: 'field',
    children: [passwordLabel, passwordInput],
  });

  const errorText = createElement('p', {
    className: 'form__error',
    attributes: { role: 'alert', 'aria-live': 'polite' },
  });

  const submitButton = createElement('button', {
    className: 'btn btn--primary btn--large',
    text: isRegister ? AUTH_TEXT.register : AUTH_TEXT.login,
    attributes: { type: 'submit' },
  });

  const switchModeButton = createElement('button', {
    className: 'link-button',
    text: isRegister
      ? `Already have an account? ${AUTH_TEXT.login}`
      : `Need an account? ${AUTH_TEXT.register}`,
    attributes: { type: 'button' },
  });

  const actionsRow = createElement('div', {
    className: 'form__actions',
    children: [submitButton, switchModeButton],
  });

  const form = createElement('form', {
    className: 'form',
    attributes: { novalidate: 'true' },
    children: [
      description,
      usernameField,
      fullnameField,
      emailField,
      passwordField,
      errorText,
      actionsRow,
    ],
  });

  const setError = (message: string): void => {
    errorText.textContent = message;
  };

  const setSubmitting = (isSubmitting: boolean): void => {
    submitButton.disabled = isSubmitting;
    emailInput.disabled = isSubmitting;
    passwordInput.disabled = isSubmitting;
  };

  switchModeButton.addEventListener('click', (): void => {
    const nextMode: AuthMode = isRegister ? AuthMode.Login : AuthMode.Register;
    options.onSwitchMode(nextMode);
  });

  form.addEventListener('submit', async (event: SubmitEvent): Promise<void> => {
    event.preventDefault();
    setError('');

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const username = usernameInput?.value;
    const full_name = fullnameInput?.value;

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await options.onSubmit({ email, password, username, full_name }, options.mode);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Authentication failed. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  });

  return {
    element: form,
    setError,
    setSubmitting,
  };
}
