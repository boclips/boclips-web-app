import React, { ReactElement } from 'react';
import BussinesIllustration from 'resources/disciplines/business.svg';
import HealthIllustration from 'resources/disciplines/health-and-medicine.svg';
import HumanitiesIllustration from 'resources/disciplines/humanities.svg';
import LifeScienciesIllustration from 'resources/disciplines/life-sciences.svg';
import MathematicsIllustration from 'resources/disciplines/mathematics.svg';
import PhysicalSciencesIllustration from 'resources/disciplines/physical-sciences.svg';
import SocialSciencesIllustration from 'resources/disciplines/social-sciences.svg';
import TechnologyIllustration from 'resources/disciplines/technology.svg';
import WorldLanguagesIllustration from 'resources/disciplines/world-languages.svg';

const getDisciplineIllustration = (name: string): ReactElement => {
  switch (name) {
    case 'Business':
      return <BussinesIllustration />;
    case 'Health and Medicine':
      return <HealthIllustration />;
    case 'Humanities':
      return <HumanitiesIllustration />;
    case 'Life Sciences':
      return <LifeScienciesIllustration />;
    case 'Mathematics':
      return <MathematicsIllustration />;
    case 'Physical Sciences':
      return <PhysicalSciencesIllustration />;
    case 'Social Sciences':
      return <SocialSciencesIllustration />;
    case 'Technology':
      return <TechnologyIllustration />;
    case 'World Languages':
      return <WorldLanguagesIllustration />;
    default:
      return null;
  }
};

export default getDisciplineIllustration;
