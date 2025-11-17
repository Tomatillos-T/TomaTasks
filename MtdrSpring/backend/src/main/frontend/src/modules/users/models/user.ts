export enum UserRole {
  ROLE_DEVELOPER = 'ROLE_DEVELOPER',
  ROLE_ADMIN = 'ROLE_ADMIN',
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  role: UserRole;
  teamId?: string;
  createdAt: string;
  updatedAt: string;
  telegramToken?: string;
}
