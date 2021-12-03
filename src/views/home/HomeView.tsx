import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import SearchHero from '../../components/searchHero/SearchHero';

const HomeView = () => {
  return (
    <Layout rowsSetup="grid-rows-home">
      <Navbar />
      <SearchHero />
      <Footer />
    </Layout>
  );
};

export default HomeView;
