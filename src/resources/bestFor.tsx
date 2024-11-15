import DiscoverySVG from '@src/resources/icons/bestFor/discovery.svg';
import ExplainerSVG from '@src/resources/icons/bestFor/explainer.svg';
import ExperienceSVG from '@src/resources/icons/bestFor/experience.svg';
import TutorialSVG from '@src/resources/icons/bestFor/tutorial.svg';
import ApplicationSVG from '@src/resources/icons/bestFor/application.svg';
import SynthesisSVG from '@src/resources/icons/bestFor/synthesis.svg';
import ReviewSVG from '@src/resources/icons/bestFor/review.svg';
import OtherSVG from '@src/resources/icons/bestFor/other.svg';
import React from 'react';

export const bestForInfo = [
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
  {
    title: 'Other',
    icon: <OtherSVG />,
    description: 'Best for flexible and adaptive facts, ideas, or concepts',
  },
];
