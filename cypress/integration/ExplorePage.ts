import { Constants } from '../fixtures/Constants';

context('Explore page', () => {
  it('renders a list of books', () => {
    cy.visit('/');
    cy.bo((bo) => bo.create.fixtureSet.openstaxBooks());
    // As the explore is behind a feature flag we have to click on another page to force a load
    cy.findByRole('button', { name: 'Cart' }).click();
    cy.findByRole('button', { name: 'Explore' }).click();

    cy.findByRole('button', { name: 'book Maths book' }).should('be.visible');
    cy.findByRole('button', { name: 'subject Physics' }).click();
    cy.findByRole('button', { name: 'book Physics book' }).should('be.visible');

    cy.percySnapshot('Explore page', {
      widths: Constants.SNAPSHOT_VIEW_WIDTHS,
    });
  });
});
