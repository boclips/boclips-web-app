import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { AlignmentProvider } from 'src/views/openstax/provider/AlignmentProvider';
import { useNavigate } from 'react-router-dom';
import s from './sparksCard.module.less';

interface Props {
  provider: AlignmentProvider;
}

const SparksCard = ({ provider }: Props) => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate(`/explore/${provider.navigationPath}`);
  };

  return (
    <button
      aria-label={`Provider ${provider.name}`}
      type="button"
      key={provider.name}
      onClick={handleOnClick}
      className={s.sparksCard}
    >
      <img
        alt={provider.imgAltText}
        src={provider.logoUrl}
        className={s.sparksCardLogo}
      />
      <Typography.H1 size="lg" className="mb-4 text-left">
        {provider.name}
      </Typography.H1>
      <Typography.Body className={s.sparksCardDescription}>
        {provider.description}
      </Typography.Body>
    </button>
  );
};

export default SparksCard;
