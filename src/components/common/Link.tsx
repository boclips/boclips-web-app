import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography } from '@boclips-ui/typography';

type TypographyLinkProps = React.ComponentProps<typeof Typography.Link>;

type Props = React.ComponentProps<RouterLink> &
  Pick<TypographyLinkProps, 'type'>;

export const Link = ({
  children,
  type,
  className,
  to,
  ...rest
}: React.PropsWithChildren<Props>): React.ReactElement => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <RouterLink to={to} {...rest}>
      <Typography.Link className={className} type={type}>
        {children}
      </Typography.Link>
    </RouterLink>
  );
};
