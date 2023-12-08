import { Typography } from '@boclips-ui/typography';
import Checkmark from 'src/resources/icons/checkmark.svg';
import React from 'react';
import TrailBackground from 'src/resources/icons/trial-bg.svg';
import BlobSVG from 'src/resources/icons/blob.svg';
import s from './style.module.less';

const features = [
  {
    title: 'No credit card required',
    description: 'Start exploring without any financial commitment',
  },
  {
    title: 'Discover & Search Videos',
    description:
      'Effortlessly find the videos you need with advanced search and filtering options',
  },
  {
    title: 'Collaborate on Playlists',
    description:
      'Create and share playlists, making learning a collaborative experience',
  },
  {
    title: 'Browse Educational Alignments',
    description:
      'Access a wealth of resources aligned with OpenStax, NGSS, Common Core Math, and more!',
  },
];

const TrialInfo = () => {
  return (
    <>
      <div className={s.trialInfo}>
        <Typography.H1 size="lg">
          Get a taste of the Boclips Library with our{' '}
          <span className={s.green}>free preview</span>!
        </Typography.H1>
        {features.map(({ title, description }) => {
          return (
            <section className={s.featureInfo}>
              <Checkmark />
              <section>
                <Typography.Body as="div" weight="medium">
                  {title}
                </Typography.Body>
                <Typography.Body as="div" size="small">
                  {description}
                </Typography.Body>
              </section>
            </section>
          );
        })}
        <div className={s.illustrationWrapper}>
          <TrailBackground className={s.illustration} />
        </div>
      </div>
      <div className={s.blobWrapper}>
        <BlobSVG className={s.blob} />
      </div>
    </>
  );
};

export default TrialInfo;
