export const DEPARTMENTS = [
  'Marketing',
  'R&D',
  'Procurement',
  'IT',
  'HR',
  'Operations',
] as const;

export const STATUSES = [
  'Ideation',
  'Pre-Evaluation',
  'Evaluation',
  'PoC',
  'MVP',
  'Live',
  'Archived',
] as const;

export const USER_ROLES = ['admin', 'viewer'] as const;

export type Department = (typeof DEPARTMENTS)[number];
export type Status = (typeof STATUSES)[number];
export type UserRole = (typeof USER_ROLES)[number];
