context('Cart page', () => {
  it('renders the cart and order flow', () => {
    cy.visit('/');
    cy.bo((bo) => bo.create.cartWithVideos());

    cy.get('[data-qa="cart-button"]').click();

    cy.findByText('Shopping cart');
    cy.findAllByRole('button', { name: 'Remove Remove' }); // SVG + text leads to this title
    cy.percySnapshot('Cart view');

    cy.contains('Place order').click();

    cy.percySnapshot('Order confirmation modal');

    cy.get('button').contains('Confirm order').click();
    cy.wait(100);
    cy.get('button').contains('View order details').click();

    cy.findByRole('heading', { name: /Order/i }).should('exist');
    cy.findByText('Please reach out to').should('exist');
    cy.findByText('if you have any questions pertaining to your order').should(
      'exist',
    );

    cy.percySnapshot('Order view');
  });
});
