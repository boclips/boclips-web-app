import { Constants } from '../fixtures/Constants';

context('Cart page', () => {
  it('renders the cart and order flow', () => {
    cy.visit('/');
    cy.bo((bo) => bo.create.cartWithVideos());

    cy.get('[data-qa="cart-button-missing-data-qa"]').click();

    cy.percySnapshot('Cart view', {
      widths: Constants.SNAPSHOT_VIEW_WIDTHS,
    });

    cy.contains('Place order').click();

    cy.percySnapshot('Order confirmation modal', {
      widths: Constants.SNAPSHOT_VIEW_WIDTHS,
    });

    cy.get('button').contains('Confirm order').click();
    cy.wait(100);
    cy.get('button').contains('View order details').click();

    cy.findByRole('heading', { name: /Order/i }).should('exist');
    cy.findByText('To edit or cancel this order, please contact').should(
      'exist',
    );

    cy.percySnapshot('Order view', {
      widths: Constants.SNAPSHOT_VIEW_WIDTHS,
    });
  });
});
