import DiscoverySVG from '@resources/icons/bestFor/discovery.svg?react';
import ExplainerSVG from '@resources/icons/bestFor/explainer.svg?react';
import ExperienceSVG from '@resources/icons/bestFor/experience.svg?react';
import TutorialSVG from '@resources/icons/bestFor/tutorial.svg?react';
import ApplicationSVG from '@resources/icons/bestFor/application.svg?react';
import SynthesisSVG from '@resources/icons/bestFor/synthesis.svg?react';
import ReviewSVG from '@resources/icons/bestFor/review.svg?react';
import OtherSVG from '@resources/icons/bestFor/other.svg?react';
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
