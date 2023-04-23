context('Homepage', () => {
  it('has a homepage', () => {
    cy.visit('/');
    cy.percySnapshot('Home Page');
  });

  it('renders account panel', () => {
    cy.visit('/');
    cy.get('[data-qa="account-menu"]').click();

    cy.percySnapshot('Account panel');
  });
});
