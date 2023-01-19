import { Bodal } from 'src/components/common/bodal/Bodal';
import { Typography } from '@boclips-ui/typography';
import DiscoverySVG from 'resources/icons/bestFor/discovery.svg';
import ExplainerSVG from 'resources/icons/bestFor/explainer.svg';
import ExperienceSVG from 'resources/icons/bestFor/experience.svg';
import TutorialSVG from 'resources/icons/bestFor/tutorial.svg';
import ApplicationSVG from 'resources/icons/bestFor/application.svg';
import SynthesisSVG from 'resources/icons/bestFor/synthesis.svg';
import ReviewSVG from 'resources/icons/bestFor/review.svg';
import React from 'react';
import s from './style.module.less';

const modal = [
  {
    title: 'Discovery',
    icon: <DiscoverySVG />,
    description: 'Best for engagement and connection to prior knowledge',
  },
  {
    title: 'Explainer',
    icon: <ExplainerSVG />,
    description: 'Best for comprehension of new facts, ideas, or concepts',
  },
  {
    title: 'Experience',
    icon: <ExperienceSVG />,
    description: 'Best for a virtual hands-on experience; an experiment',
  },
  {
    title: 'Tutorial',
    icon: <TutorialSVG />,
    description: 'Best for demonstrating and modeling how to problem solve',
  },
  {
    title: 'Application',
    icon: <ApplicationSVG />,
    description:
      'Best for building context to previously learned facts, ideas, or concepts',
  },
  {
    title: 'Synthesis',
    icon: <SynthesisSVG />,
    description: 'Best for applying higher order thinking skills',
  },
  {
    title: 'Review',
    icon: <ReviewSVG />,
    description:
      'Best for reexamining previously learned facts, ideas, or concepts',
  },
];

const BestForModal = ({ setOpen }) => {
  return (
    <Bodal
      title="What are “Best for” tags?"
      onCancel={() => setOpen(false)}
      closeOnClickOutside
      displayCancelButton={false}
      confirmButtonText="OK, great!"
      onConfirm={() => setOpen(false)}
      dataQa="best-for-modal"
    >
      <Typography.Body as="section" className={s.header}>
        Our tags are a suggested model for the typical pedagogical flow of a
        lesson plan.
      </Typography.Body>
      {modal.map((it) => {
        return (
          <section className={s.body}>
            <div className={s.title}>
              <Typography.Body weight="medium">{it.title}</Typography.Body>
              <div className={s.icon}>{it.icon}</div>
            </div>
            <Typography.Body>{it.description}</Typography.Body>
          </section>
        );
      })}
    </Bodal>
  );
};

export default BestForModal;
