export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ROLE_DEVELOPER' | 'ROLE_ADMIN';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
}

export interface DetailedTeam {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  members: TeamMember[];
  project?: Project;
}
