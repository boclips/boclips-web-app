import { Typography } from '@boclips-ui/typography';
import Checkmark from 'src/resources/icons/checkmark.svg';
import React from 'react';
import TrailBackground from 'src/resources/icons/trial-bg.svg';
import BlobSVG from 'src/resources/icons/blob.svg';
import s from './style.module.less';

const features = [
  {
    title: 'No credit card required',
    description: 'Explore more than 2.2M Ed-Ready videos for free.',
  },
  {
    title: 'Discover & Search Videos',
    description:
      'Effortlessly find the videos you need with advanced search and filtering options. Create and share playlists with team members.',
  },
  {
    title: 'Browse Educational Alignments',
    description:
      'Access a wealth of resources aligned with OpenStax, NGSS, Common Core Math, and more!',
  },
  {
    title: 'No Commitment Invoice Payment for Instant Takeaway',
    description:
      'Pay via invoice, copy your embed code and get immediate access to your videos.',
  },
];

const TrialInfo = () => {
  return (
    <>
      <div className={s.trialInfo}>
        <Typography.H1 size="lg">Explore Boclips Library!</Typography.H1>
        {features.map(({ title, description }) => {
          return (
            <section key={title} className={s.featureInfo}>
              <span className={s.icon}>
                <Checkmark />
              </span>
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
