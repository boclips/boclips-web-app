import { Subject } from 'boclips-api-client/dist/types';
import React from 'react';
import { Link } from 'src/components/common/Link';

interface Props {
  subject: Subject;
  className?: string;
}

export const SubjectLink = ({
  subject,
  className,
  children,
}: React.PropsWithChildren<Props>) => {
  const link = new URLSearchParams();
  link.append('q', subject.name);
  link.append('subject', subject.id);
  return (
    <Link
      className={className}
      aria-label={`Search for videos with subject ${subject.name}`}
      key={subject.id}
      to={{
        pathname: '/videos',
        search: `?${link.toString()}`,
      }}
    >
      {children}
    </Link>
  );
};
