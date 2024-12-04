import React from 'react';
import { Hero } from '@src/components/hero/Hero';
import { Button } from 'boclips-ui';
import NotFoundSVG from '@src/resources/icons/not-found.svg';

export const PageNotFoundError = () => {
  return (
    <Hero
      icon={<NotFoundSVG />}
      title="Page not found!"
      description="We can’t seem to find the page you’re looking for. Try going back to
          the previous page or contact support@boclips.com"
      actions={
        <Button
          onClick={() => {
            window.location.href = 'mailto:support@boclips.com';
          }}
          text="Contact Support"
        />
      }
    />
  );
};
