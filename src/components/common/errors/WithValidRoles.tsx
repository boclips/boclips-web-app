import React from 'react';
import { useBoclipsSecurity } from 'src/components/common/providers/BoclipsSecurityProvider';
import { ROLES } from 'src/types/Roles';

interface Props {
  children: React.ReactNode;
  fallback: any;
  roles: ROLES[];
}

export const WithValidRoles = ({ children, fallback, roles }: Props) => {
  const security = useBoclipsSecurity();

  if (roles.some((role) => security.hasRole(role))) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
