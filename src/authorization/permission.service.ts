import { UserRole } from "../types/roles";
import { Permission } from "./permissions";
import { ROLE_PERMISSIONS } from "./role-permissions";



export class PermissionService {
  hasPermission(role: UserRole, permission: Permission): boolean {
    return ROLE_PERMISSIONS[role]?.includes(permission)?? false
  }

  hasAllPermissions(
      role: UserRole,
      permissions: Permission[]
    ): boolean {
      return permissions.every((permission) =>
        this.hasPermission(role, permission)
      );
    }

    hasAnyPermission(
      role: UserRole,
      permissions: Permission[]
    ): boolean {
      return permissions.some((permission) =>
        this.hasPermission(role, permission)
      );
    }

}


export const permissionService = new PermissionService();
