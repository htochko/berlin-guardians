import { DialogParameter } from './routes';
export enum AuthMode {
  Login = 'login',
  Register = 'register',
}

export interface AuthDialog {
  readonly element: HTMLDialogElement;
  readonly show: (mode: DialogParameter.Auth) => void;
  readonly hide: () => void;
}

export enum AuthFieldName {
  Username = 'username',
  Email = 'email',
  Password = 'password',
  ConfirmPassword = 'confirm-password',
}

export interface AuthField {
  readonly name: AuthFieldName;
  readonly label: string;
  readonly type: 'text' | 'email' | 'password';
  readonly icon: string;
  readonly placeholder: string;
  readonly autocomplete: string;
  readonly minLength?: number;
  readonly canRevealPassword?: boolean;
}

// inline error texts of the field rules
export interface AuthValidationMessages {
  readonly emailRequired: string;
  readonly emailFormat: string;
  readonly usernameRequired: string;
  readonly usernameFirstLetter: string;
  readonly usernameCharacters: string;
  readonly usernameLength: string;
  readonly passwordRequired: string;
  readonly passwordLength: string;
  readonly passwordCharacters: string;
  readonly passwordUppercase: string;
  readonly passwordDigit: string;
  readonly passwordSpecial: string;
  readonly confirmPasswordRequired: string;
  readonly confirmPasswordMismatch: string;
}

export interface AuthFormContent {
  readonly tabLabel: string;
  readonly title: string;
  readonly description: string;
  readonly fields: readonly AuthField[];
  readonly forgotPasswordText?: string;
  readonly submitText: string;
  readonly pendingText: string;
  readonly googleText: string;
  readonly googlePendingText: string;
  readonly switchQuestion: string;
  readonly switchLinkText: string;
}

// login/registration fields
export type AuthRequest =
  | {
      readonly mode: AuthMode.Login;
      readonly email: string;
      readonly password: string;
    }
  | {
      readonly mode: AuthMode.Register;
      readonly username: string;
      readonly email: string;
      readonly password: string;
    };

// The signed-in user as the app keeps it: no password and no Firebase token
export interface AuthProfile {
  readonly displayName: string;
  readonly email: string;
  readonly avatarUrl?: string; // account picture if has one on Google acount
}

export interface AuthErrorMessages {
  readonly canceled: string; // user closed google modal
  readonly unknown: string;
  readonly outdated: string;
  readonly byCode: Readonly<Partial<Record<string, string>>>;
}
