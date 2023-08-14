// homepage feature flags
// featureGate role: BO_WEB_APP_SPARKS
// featureGate link: cart

context('Homepage -- feature flags off', () => {
  it('has a homepage', () => {
    cy.visit('/');
    cy.bo((bo) => {
      bo.set.features({
        BO_WEB_APP_SPARKS: false,
      });
      delete bo.inspect().links.cart;
      bo.create.featuredPlaylists();
    });

    cy.findByText('Sparks').should('not.exist');
    cy.findByText('Cart').should('not.exist');
    cy.percySnapshot('Home Page without feature flags');
  });

  it('renders account panel', () => {
    cy.visit('/');
    cy.bo((bo) => {
      bo.set.features({
        BO_WEB_APP_SPARKS: false,
      });
      delete bo.inspect().links.cart;
      delete bo.inspect().links.userOrders;
      bo.create.featuredPlaylists();
    });
    cy.get('[data-qa="account-menu"]').click();
    cy.findByText('My orders').should('not.exist');

    cy.percySnapshot('Account panel without feature flags');
  });
});

context('Homepage -- feature flags on', () => {
  it('has a homepage', () => {
    cy.visit('/');
    cy.bo((bo) => {
      bo.set.features({
        BO_WEB_APP_SPARKS: true,
      });
      bo.create.featuredPlaylists();
    });
    cy.findByText('Sparks').should('exist');
    cy.findByText('Cart').should('exist');

    cy.percySnapshot('Home Page with feature flags');
  });

  it('renders account panel', () => {
    cy.visit('/');
    cy.bo((bo) => {
      bo.set.features({
        BO_WEB_APP_SPARKS: true,
      });
      bo.create.featuredPlaylists();
    });
    cy.get('[data-qa="account-menu"]').click();
    cy.findByText('My orders').should('exist');

    cy.percySnapshot('Account panel with feature flags');
  });
});
