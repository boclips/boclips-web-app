// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import '@percy/cypress';
import '@testing-library/cypress/add-commands';

Cypress.Commands.add('bo', (callback) => {
  // @ts-ignore
  cy.window().then(({ bo }) => {
    callback(bo);
  });
});

// turn off waiting for the api calls (like logo, pendo etc), we have all necessary data in fake api client
Cypress.Commands.overwrite('intercept', (originalFn, ...args) => {
  const [options] = args;

  if (typeof options === 'string') {
    // @ts-ignore
    return originalFn(args[0], { forceNetworkError: true });
  }
  const modifiedOptions = {
    ...options,
    forceNetworkError: true,
  };

  // @ts-ignore
  return originalFn(...args, modifiedOptions);
});
