import React from 'react';
// import Footer from 'src/components/layout/Footer';
import DisciplinesWidget from 'src/components/disciplinesWidget/DisciplinesWidget';
import ResponsiveLayout from 'src/components/layout/ResponsiveLayout';
import NavbarResponsive from 'src/components/layout/NavbarResponsive';

const ResponsiveHomeView = () => {
  return (
    <ResponsiveLayout rowsSetup="grid-rows-home">
      <NavbarResponsive showSearchBar={false} />
      <DisciplinesWidget />
      {/* <Footer /> */}
    </ResponsiveLayout>
  );
};

export default ResponsiveHomeView;
