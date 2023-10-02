import React from 'react';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import { Helmet } from 'react-helmet';
import RegistrationForm from 'src/components/registration/RegistrationForm';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { Constants } from 'src/AppConstants';

const CAPTCHA_TOKEN = Constants.CAPTCHA_TOKEN;

const RegistrationView = () => {
  return (
    <>
      <Helmet title="Register" />
      <Layout rowsSetup="grid-rows-registration-view" responsiveLayout>
        <GoogleReCaptchaProvider reCaptchaKey={CAPTCHA_TOKEN}>
          <RegistrationForm />
        </GoogleReCaptchaProvider>
        <Footer className="col-start-2 col-end-26 row-start-6" />
      </Layout>
    </>
  );
};

export default RegistrationView;
