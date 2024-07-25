import { Typography } from '@boclips-ui/typography';
import Checkmark from 'src/resources/icons/purple-checkmark.svg';
import React from 'react';
import TrailBackground from 'src/resources/icons/classroom-info-bg.svg';
import BlobSVG from 'src/resources/icons/blob.svg';
import s from './style.module.less';

const features = [
  {
    title: 'Free access for teachers',
    description:
      'Explore, collaborate, and share with students and colleagues.',
  },
  {
    title: 'Curriculum-aligned',
    description:
      'Expertly curated to align to educational standards and curriculum objectives.',
  },
  {
    title: 'Discoverable',
    description:
      'Filter by subject, age, pedagogical use case, type, and more.',
  },
  {
    title: 'Distraction-free',
    description:
      'Share videos directly with students in a distraction free environment curated for learning.',
  },
  {
    title: 'Safe and reliable',
    description:
      'Content sourced directly from educational content creators, guaranteeing content provenance.',
  },
];

const ClassroomInfo = () => {
  return (
    <>
      <div className={s.classroomInfo}>
        <Typography.H1 size="lg">Welcome to Boclips Classroom!</Typography.H1>
        <Typography.Body as="div" size="small" className="mt-3 mb-3">
          Enhance your classroom experience with over 200,000 instructional
          videos in a safe, educational alternative to YouTube.
        </Typography.Body>
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

export default ClassroomInfo;
