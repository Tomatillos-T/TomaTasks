export enum UserRole {
  Developer = 'Developer',
  Admin = 'Admin',
}

// Human-readable labels for roles (Spanish)
export const roleLabels: Record<UserRole, string> = {
  [UserRole.Admin]: 'Administrador',
  [UserRole.Developer]: 'Desarrollador',
};

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
  githubId?: string;
  githubUsername?: string;
}
