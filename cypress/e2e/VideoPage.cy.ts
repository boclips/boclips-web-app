// homepage feature flags
// featureGate role: BO_WEB_APP_SPARKS
// featureGate link: cart

context('VideoPage -- feature flags off', () => {
  it('video page', () => {
    cy.visit('/');

    cy.bo((bo) => {
      bo.set.features({
        BO_WEB_APP_PRICES: false,
      });
      bo.create.featuredPlaylists();
    });

    cy.findByText('My featured playlist').should('be.visible').click();
    cy.findAllByText('video title').should('be.visible').first().click();

    cy.findByText('$1,000').should('not.exist');
    cy.percySnapshot('video page -- without feature flags');
  });
});

context('VideoPage -- feature flags on', () => {
  it('video page', () => {
    cy.visit('/');
    cy.bo((bo) => {
      bo.set.features({
        BO_WEB_APP_PRICES: true,
      });
      bo.create.featuredPlaylists();
    });

    cy.findByText('My featured playlist').should('be.visible').click();
    cy.findAllByText('video title').should('be.visible').first().click();

    cy.findByText('$1,000').should('exist');
    cy.percySnapshot('video page -- with feature flags');
  });
});
