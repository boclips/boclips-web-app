import React from 'react';
import DisciplinesWidget from 'src/components/disciplinesWidget/DisciplinesWidget';
import ResponsiveLayout from 'src/components/layout/ResponsiveLayout';
import NavbarResponsive from 'src/components/layout/NavbarResponsive';
import Footer from 'src/components/layout/Footer';

const ResponsiveHomeView = () => {
  return (
    <ResponsiveLayout rowsSetup="grid-rows-home-responsive">
      <NavbarResponsive />
      <DisciplinesWidget />
      <Footer columnPosition="col-start-2 col-end-26" />
    </ResponsiveLayout>
  );
};

export default ResponsiveHomeView;
