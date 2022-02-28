import { disciplines } from '../../src/components/disciplinesWidget/disciplinesFixture';

context('UI Regression', () => {
  const endpoint = 'http://localhost:9000';

  const snapshotViewWidths = [1280, 1440, 1680];

  it('has a homepage', () => {
    cy.visit(`${endpoint}/`);

    cy.bo((bo) =>
      bo.interact((apiClient) => {
        disciplines.forEach((discipline) => {
          apiClient.disciplines.insertMyDiscipline(discipline);
          discipline.subjects.forEach((subject) =>
            apiClient.subjects.insertSubject(subject),
          );
        });
      }),
    );

    cy.get('img').click();

    cy.percySnapshot('Home Page', {
      widths: snapshotViewWidths,
    });

    cy.get('button').contains('Business').click();

    cy.percySnapshot('Home Page with subjects', {
      widths: snapshotViewWidths,
    });
  });

  it('renders account panel', () => {
    cy.visit(`${endpoint}/`);
    cy.get('[data-qa="account-menu"]').click();

    cy.percySnapshot('Account panel', {
      widths: snapshotViewWidths,
    });
  });

  it('applies filters', () => {
    cy.visit(`${endpoint}/`);

    cy.bo((bo) => bo.create.fixtureSet.eelsBiologyGeography());

    cy.findByPlaceholderText('Search for videos');
    cy.findByRole('button', { name: 'search' }).click();

    cy.get('[data-qa="video-card-wrapper"]').should((videoCard) => {
      expect(videoCard.length).to.equal(2);
    });

    cy.percySnapshot('Search before filtering', {
      widths: snapshotViewWidths,
    });

    cy.get('label').contains('Biology').click();
    cy.get('[data-qa="video-card-wrapper"]').should((videoCard) => {
      expect(videoCard.length).to.equal(1);
    });

    cy.percySnapshot('Search with filters', {
      widths: snapshotViewWidths,
    });
  });

  it('renders the cart and order flow', () => {
    cy.visit(`${endpoint}/`);

    cy.bo((bo) => bo.create.cartWithVideos());

    cy.get('[data-qa="cart-button"]').click();

    cy.percySnapshot('Cart view', {
      widths: snapshotViewWidths,
    });

    cy.contains('Place order').click();

    cy.percySnapshot('Order confirmation modal', {
      widths: snapshotViewWidths,
    });

    cy.get('button').contains('Confirm order').click();
    cy.wait(100);
    cy.get('button').contains('View order details').click();

    cy.percySnapshot('Order view', {
      widths: snapshotViewWidths,
    });
  });
});
