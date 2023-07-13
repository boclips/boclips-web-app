// homepage feature flags
// featureGate role: BO_WEB_APP_SPARKS
// featureGate link: cart

context('VideoPage -- feature flags off', () => {
  it('has a homepage', () => {
    cy.visit('/videos');
    cy.bo((bo) => {
      bo.create.fixtureSet.eelsBiologyGeography();
      bo.set.features({
        BO_WEB_APP_PRICES: false,
      });
    });

    cy.findByText(
      'TED-Ed: No one can figure out how eels have sex | Lucy Cooke',
    )
      .should('be.visible')
      .click();

    cy.findByText('$1,000').should('not.exist');
    cy.percySnapshot('video page -- without feature flags');
  });
});

context('VideoPage -- feature flags on', () => {
  it('has a homepage', () => {
    cy.visit('/videos');
    cy.bo((bo) => {
      bo.create.fixtureSet.eelsBiologyGeography();
      bo.set.features({
        BO_WEB_APP_PRICES: true,
      });
    });

    cy.findByText(
      'TED-Ed: No one can figure out how eels have sex | Lucy Cooke',
    )
      .should('be.visible')
      .click();

    cy.findByText('$1,000').should('exist');
    cy.percySnapshot('video page -- with feature flags');
  });
});
