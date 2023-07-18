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
      bo.create.video({
        id: '123',
        title: 'test title',
        price: { currency: 'USD', amount: 200 },
      });
    });

    cy.findByText('All videos').should('be.visible').click();
    cy.get('[data-qa="video-card"] a').should('be.visible').first().click();

    cy.findByText('Loading').should('not.exist');

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
      bo.create.video({
        id: '123',
        title: 'test title',
        price: { currency: 'USD', amount: 200 },
      });
    });

    cy.findByText('All videos').should('be.visible').click();
    cy.get('[data-qa="video-card"] a').should('be.visible').first().click();

    cy.findByText('Loading').should('not.exist');

    cy.findByText('$200').should('exist');
    cy.percySnapshot('video page -- with feature flags');
  });
});
