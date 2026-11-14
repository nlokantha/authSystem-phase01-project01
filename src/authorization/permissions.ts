export const PERMISSIONS = {
  USERS_READ: "users:read",
    USERS_CREATE: "users:create",
    USERS_UPDATE: "users:update",
    USERS_DELETE: "users:delete",

    PROFILE_READ: "profile:read",
    PROFILE_UPDATE: "profile:update",

    ROLES_READ: "roles:read",
    ROLES_MANAGE: "roles:manage",
} as const


export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
