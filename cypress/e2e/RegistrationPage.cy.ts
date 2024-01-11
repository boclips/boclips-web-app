import { cleanupStyles } from 'cypress/mount-utils';

context('Registration Page', () => {
  it('Registration', () => {
    cy.visit('/register');

    cy.bo((bo) => {
      bo.create.user();
      bo.set.features({
        BO_WEB_APP_DEV: true,
      });
    });

    cy.intercept('POST', 'https://www.google.com/recaptcha/api2/reload**', {
      statusCode: 200,
      body: { success: true },
    });

    cy.findByText('Create your free account').should('be.visible');

    cy.findByLabelText('Organization name').should('be.visible');
    cy.findByLabelText('First name').should('be.visible');
    cy.findByLabelText('Last name').should('be.visible');
    cy.findByLabelText('Email Address').should('be.visible');
    cy.findByText('Country').should('be.visible');
    cy.findByLabelText('Password').should('be.visible');
    cy.findByLabelText('Confirm password').should('be.visible');

    cy.findByText(
      'I certify that I am accessing this service solely for Educational Use.',
    ).should('be.visible');

    cy.findByRole('button', { name: 'Create Account' }).should('be.visible');

    cy.percySnapshot('Trial Registration empty page');

    cy.findByLabelText('Organization name').type('TestOrg');
    cy.findByLabelText('First name').type('Bob');
    cy.findByLabelText('Last name').type('Snail');
    cy.findByLabelText('Email Address').type('bobsnail@boclips.com');
    cy.findByRole('button', { name: 'Select country' }).click();
    cy.findByText('Afghanistan').click();
    cy.findByLabelText('Password').type('p@Ss1234');
    cy.findByLabelText('Confirm password').type('p@Ss1234');

    cy.findByText(/I certify that/).click();

    cy.findByRole('button', { name: 'Create Account' }).click();

    cy.findByText('Check your email!').should('be.visible');

    cy.percySnapshot('Trial Registration Verification Prompt');
  });
});
