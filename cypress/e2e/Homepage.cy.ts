// homepage feature flags
// featureGate link: cart

import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';

context('Homepage -- feature flags off', () => {
  it('has a homepage', () => {
    cy.visit('/');

    cy.bo((bo) => {
      bo.create.featuredPlaylists();
    });

    cy.findByText('Cart').should('not.exist');

    cy.findByText('All videos').should('be.visible');

    cy.percySnapshot('Home Page without feature flags');
  });

  it('renders account panel', () => {
    cy.visit('/');
    cy.bo((bo) => {
      bo.create.user();
      bo.create.featuredPlaylists();
    });

    cy.get('[data-qa="account-menu"]').click();
    cy.findByText('Order History').should('not.exist');

    cy.percySnapshot('Account panel without feature flags');
  });
});

context('Homepage -- feature flags on', () => {
  it('has a homepage', () => {
    cy.visit('/');
    cy.bo((bo) => {
      bo.create.user();
      bo.inspect().links.cart = {
        href: 'https://www.boclips.com',
        templated: false,
      };

      bo.create.featuredPlaylists();
    });
    cy.get('[data-qa="account-menu"]').click();

    cy.findByText('Alignments').should('exist');
    cy.findByText('Cart').should('exist');

    cy.percySnapshot('Home Page with feature flags');
  });

  it('renders account panel', () => {
    cy.visit('/');
    cy.bo((bo) => {
      bo.inspect().users.insertCurrentUser(UserFactory.sample());
      bo.create.featuredPlaylists();
      bo.inspect().links.cart = {
        href: 'https://www.boclips.com',
        templated: false,
      };
      bo.inspect().links.userOrders = {
        href: 'https://www.boclips.com',
        templated: false,
      };
    });
    cy.get('[data-qa="account-menu"]').click();
    cy.findByText('Order History').should('exist');

    cy.percySnapshot('Account panel with feature flags');
  });
});
