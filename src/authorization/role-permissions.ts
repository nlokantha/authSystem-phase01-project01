import { UserRole } from "../types/roles";


import {
  PERMISSIONS,
  type Permission,
} from "./permissions";

export const ROLE_PERMISSIONS: Record<
  UserRole,
  readonly Permission[]
> = {
  [UserRole.ADMIN]: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_UPDATE,
    PERMISSIONS.ROLES_READ,
    PERMISSIONS.ROLES_MANAGE,
  ],

  [UserRole.USER]: [
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_UPDATE,
  ],
};
