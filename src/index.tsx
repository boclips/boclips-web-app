import './main.less';

import React, { ReactElement } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Integration } from '@sentry/types';
import BoclipsSecurity from 'boclips-js-security';
import { ApiBoclipsClient } from 'boclips-api-client';
import axios from 'axios';
import { ExtraErrorData } from '@sentry/integrations';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/react';
import AppUnauthenticated from 'src/AppUnauthenticated';
import { FallbackApp } from 'src/FallbackApp';
import App from './App';
import { Constants } from './AppConstants';

// eslint-disable-next-line import/extensions
import { loadHotjar } from './thirdParty/loadHotjar.js';
// eslint-disable-next-line import/extensions
import { loadPendo } from './thirdParty/loadPendo.js';

const addHubspotScript = () => {
  const hubspotScript = document.createElement('script');
  hubspotScript.setAttribute('type', 'text/javascript');
  hubspotScript.setAttribute('id', 'hs-script-loader');
  hubspotScript.setAttribute('async', 'true');
  hubspotScript.setAttribute('defer', 'true');
  hubspotScript.src = '//js.hs-scripts.com/4854096.js';

  document.head.appendChild(hubspotScript);
};

const initializeSentry = () => {
  const environment = process.env.NODE_ENV;
  const sentryRelease = process.env.SENTRY_RELEASE;

  Sentry.init({
    release: sentryRelease,
    environment,
    dsn: 'https://50de7aa7ec43491d9c7140376d0bf128@o236297.ingest.sentry.io/5633299',
    integrations: [new BrowserTracing() as Integration, new ExtraErrorData()],
    tracesSampleRate: 1.0,
    denyUrls: [
      // Chrome extensions
      /extensions\//i,
      /^chrome:\/\//i,
    ],
  });
};

if (Constants.IS_HOTJAR_ENABLED) {
  loadHotjar();
}

if (Constants.IS_PENDO_ENABLED) {
  loadPendo();
}

if (Constants.IS_HUBSPOT_ENABLED) {
  addHubspotScript();
}

if (Constants.IS_SENTRY_ENABLED) {
  initializeSentry();
}

const container =
  document.getElementById('root') || document.createElement('div');
const root = createRoot(container);
const onLogin = async () => {
  try {
    const apiClient = await ApiBoclipsClient.create(
      axios,
      Constants.API_PREFIX,
    );

    root.render(
      <Router>
        <App
          apiClient={apiClient}
          boclipsSecurity={BoclipsSecurity.getInstance()}
        />
      </Router>,
    );
  } catch (e) {
    root.render(<FallbackApp />);
  }
};

const authOptions = {
  realm: 'boclips',
  clientId: 'boclips-web-app',
  requireLoginPage: true,
  authEndpoint: Constants.AUTH_ENDPOINT,
  onLogin,
};

const AppInitializer = ({ viewMock }: { viewMock?: ReactElement }) => {
  const path = window.location.pathname;
  const isRegisterView = path.match('/register');
  const isVideoShareView = path.match('/videos/shared');

  if (isRegisterView || isVideoShareView) {
    if (viewMock) return viewMock;

    return (
      <Router>
        <AppUnauthenticated />
      </Router>
    );
  }

  BoclipsSecurity.createInstance(authOptions);

  return null;
};

root.render(<AppInitializer />);

export default AppInitializer;
