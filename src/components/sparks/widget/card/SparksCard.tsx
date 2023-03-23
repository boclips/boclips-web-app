import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { Provider } from 'boclips-api-client/dist/sub-clients/alignments/model/provider/Provider';
import { useNavigate } from 'react-router-dom';
import s from './sparksCard.module.less';

interface Props {
  provider: Provider;
}

const SparksCard = ({ provider }: Props) => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate(`/sparks/${provider.navigationPath}`);
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
        alt={`${provider.name} logo`}
        src={provider.logoUrl}
        className={s.sparksCardLogo}
      />
      <Typography.H1
        size={{ mobile: 'md', tablet: 'md', desktop: 'lg' }}
        className="mb-2 text-left"
      >
        {provider.name}
      </Typography.H1>
      <Typography.Body className={s.sparksCardDescription}>
        {provider.description}
      </Typography.Body>
    </button>
  );
};

export default SparksCard;
