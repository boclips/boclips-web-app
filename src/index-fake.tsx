import './main.less';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactDom from 'react-dom';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsSecurity } from 'boclips-js-security/dist/BoclipsSecurity';
import { Bo, bo } from '@src/testSupport/bo';
import App from './App';

const apiClient = new FakeBoclipsClient();
const fakeSecurity: BoclipsSecurity = {
  isAuthenticated: () => true,
  logout: () => {},
  getTokenFactory: (_validityTime: number) => {
    return () => Promise.resolve('afaketoken');
  },
  configureAxios: () => {},
  ssoLogin: () => {},
  hasRole: (_role: string) => true,
};

ReactDom.render(
  <Router>
    <App apiClient={apiClient} boclipsSecurity={fakeSecurity} />
  </Router>,
  document.getElementById('root'),
);

declare global {
  interface Window {
    bo: Bo;
  }
}

window.bo = bo(apiClient);
