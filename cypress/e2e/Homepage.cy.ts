// homepage feature flags
// featureGate role: BO_WEB_APP_SPARKS
// featureGate link: cart

import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';

context('Homepage -- feature flags off', () => {
  it('has a homepage', () => {
    cy.visit('/');

    cy.bo((bo) => {
      bo.set.features({
        BO_WEB_APP_SPARKS: false,
      });

      bo.create.featuredPlaylists();
    });

    cy.findByText('Sparks').should('not.exist');
    cy.findByText('Cart').should('not.exist');

    cy.percySnapshot('Home Page without feature flags');
  });

  it('renders account panel', () => {
    cy.visit('/');
    cy.bo((bo) => {
      bo.create.user();
      bo.set.features({
        BO_WEB_APP_SPARKS: false,
      });
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
      bo.inspect().users.insertCurrentUser(
        UserFactory.sample({ features: { BO_WEB_APP_SPARKS: true } }),
      );
      bo.inspect().links.cart = {
        href: 'https://www.boclips.com',
        templated: false,
      };

      bo.create.featuredPlaylists();
    });
    cy.get('[data-qa="account-menu"]').click();

    cy.findByText('Sparks').should('exist');
    cy.findByText('Cart').should('exist');

    cy.percySnapshot('Home Page with feature flags');
  });

  it('renders account panel', () => {
    cy.visit('/');
    cy.bo((bo) => {
      bo.inspect().users.insertCurrentUser(
        UserFactory.sample({ features: { BO_WEB_APP_SPARKS: true } }),
      );
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
    cy.findByText('My orders').should('exist');

    cy.percySnapshot('Account panel with feature flags');
  });
});
