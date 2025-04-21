
export const ROLE_MASKS = {
    banned: 0,
    viewer: 1 << 0,
    admin: 1 << 1
}

export function hasRole(userRole: number, requiredRole: number) {
    return (userRole & requiredRole) === requiredRole;
}