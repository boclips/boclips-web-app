import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography } from 'boclips-ui';

type TypographyLinkProps = React.ComponentProps<typeof Typography.Link>;

type LinkProps = {
  isExternalLink?: boolean;
  onClick?: () => void;
};

type Props = React.ComponentProps<typeof RouterLink> &
  Pick<TypographyLinkProps, 'type'> &
  LinkProps;

export const Link = ({
  children,
  type,
  className,
  to,
  isExternalLink,
  onClick,
  ...rest
}: React.PropsWithChildren<Props>): React.ReactElement => {
  return (
    <RouterLink
      to={to}
      onClick={(e) => {
        if (onClick) {
          onClick();
        }

        if (isExternalLink) {
          window.location.href = to.toString();
          e.preventDefault();
        }
      }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      <Typography.Link className={className} type={type}>
        {children}
      </Typography.Link>
    </RouterLink>
  );
};
