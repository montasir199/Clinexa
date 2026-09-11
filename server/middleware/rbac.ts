import { Request, Response, NextFunction } from 'express';

type UserRole = 'super_admin' | 'hospital_admin' | 'doctor' | 'receptionist' | 'patient';

/**
 * Middleware to check if user has required role(s)
 * @param allowedRoles - Array of roles that are allowed
 * @returns Express middleware function
 */
export function checkRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    const userRole = req.user.role as UserRole;

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        allowedRoles,
        userRole,
      });
      return;
    }

    next();
  };
}

/**
 * Middleware to check if user has permission for resource
 * Used for hospital-level isolation
 */
export function checkResourceAccess(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
    return;
  }

  const resourceHospitalId = req.params.hospitalId || req.body.hospitalId;
  const userHospitalId = req.user.hospitalId;
  const userRole = req.user.role as UserRole;

  // Super admin can access any hospital
  if (userRole === 'super_admin') {
    next();
    return;
  }

  // Other users can only access their hospital
  if (resourceHospitalId && resourceHospitalId !== userHospitalId) {
    res.status(403).json({
      success: false,
      message: 'Access denied to this resource',
    });
    return;
  }

  next();
}

/**
 * Role hierarchy for permission inheritance
 */
export const roleHierarchy: Record<UserRole, UserRole[]> = {
  super_admin: ['super_admin', 'hospital_admin', 'doctor', 'receptionist', 'patient'],
  hospital_admin: ['hospital_admin', 'doctor', 'receptionist', 'patient'],
  doctor: ['doctor', 'patient'],
  receptionist: ['receptionist', 'patient'],
  patient: ['patient'],
};

/**
 * Check if user's role inherits from required role
 */
export function hasRoleHierarchy(
  userRole: UserRole,
  requiredRole: UserRole
): boolean {
  return roleHierarchy[userRole]?.includes(requiredRole) ?? false;
}
