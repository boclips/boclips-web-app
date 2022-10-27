import './main.less';

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactDom from 'react-dom';
import BoclipsSecurity from 'boclips-js-security';
import { ApiBoclipsClient } from 'boclips-api-client';
import axios from 'axios';
import { ExtraErrorData } from '@sentry/integrations';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import App from './App';
import { Constants } from './AppConstants';
import { FallbackApp } from './FallbackApp';
import { defineCustomElements } from '@duetds/date-picker/dist/loader';

defineCustomElements(window);

// eslint-disable-next-line import/extensions
import { loadHotjar } from './thirdParty/loadHotjar.js';

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
  const sentryRelease = process.env.SENTRY_RELEASE;

  Sentry.init({
    release: sentryRelease,
    dsn: 'https://50de7aa7ec43491d9c7140376d0bf128@o236297.ingest.sentry.io/5633299',
    integrations: [new Integrations.BrowserTracing(), new ExtraErrorData()],
    tracesSampleRate: 1.0,
    blacklistUrls: [
      // Chrome extensions
      /extensions\//i,
      /^chrome:\/\//i,
    ],
  });
};

if (Constants.IS_HOTJAR_ENABLED) {
  loadHotjar();
}

if (Constants.IS_HUBSPOT_ENABLED) {
  addHubspotScript();
}

if (Constants.IS_SENTRY_ENABLED) {
  initializeSentry();
}

const onLogin = async () => {
  console.log('hello');
  try {
    const apiClient = await ApiBoclipsClient.create(
      axios,
      Constants.API_PREFIX,
    );

    ReactDom.render(
      <Router>
        <App
          apiClient={apiClient}
          boclipsSecurity={BoclipsSecurity.getInstance()}
        />
      </Router>,
      document.getElementById('root'),
    );
  } catch (e) {
    // If we can't fetch links via the api client (e.g a service is down) show a simple fallback page
    ReactDom.render(<FallbackApp />, document.getElementById('root'));
  }
};

const authOptions = {
  realm: 'boclips',
  clientId: 'boclips-web-app',
  requireLoginPage: true,
  authEndpoint: Constants.AUTH_ENDPOINT,
  onLogin,
};

BoclipsSecurity.createInstance(authOptions);
