import EmptyCartCharacter from '@src/resources/icons/empty-cart-character.svg';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import Button from 'boclips-ui';
import { Hero } from '@src/components/hero/Hero';

export const EmptyCart = () => {
  const navigate = useNavigate();
  return (
    <Hero
      title="Your shopping cart is empty"
      description="Go to our homepage and search for your perfect video"
      row="3"
      icon={<EmptyCartCharacter />}
      actions={
        <Button
          onClick={() => {
            navigate({
              pathname: '/',
            });
          }}
          text="Go to homepage"
          height="44px"
          width="158px"
        />
      }
    />
  );
};
