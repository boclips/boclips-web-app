// cart feature flags
// featureGate role: BO_WEB_APP_REQUEST_TRIMMING, BO_WEB_APP_REQUEST_ADDITIONAL_EDITING

import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';

context('Cart page -- feature flags off', () => {
  it('renders the cart and order flow', () => {
    cy.visit('/');
    cy.bo((bo) => {
      bo.create.cartWithVideos();
      bo.inspect().users.insertCurrentUser(
        UserFactory.sample({
          features: {
            BO_WEB_APP_REQUEST_TRIMMING: false,
            BO_WEB_APP_REQUEST_ADDITIONAL_EDITING: false,
            BO_WEB_APP_PRICES: false,
            BO_WEB_APP_SPARKS: true,
          },
        }),
      );
      bo.inspect().links.cart = {
        href: 'https://www.boclips.com',
        templated: false,
      };
    });
    cy.get('[data-qa="account-menu"]').click();

    cy.get('[data-qa="cart-button"]').click();

    cy.findByText('Shopping cart');
    cy.findAllByRole('button', { name: 'Remove Remove' }); // SVG + text leads to this title

    cy.findByText(
      'Request human-generated caption and transcript files (in English)',
    ).should('not.exist');
    cy.findByText('Request other type of editing').should('not.exist');

    cy.percySnapshot('Cart view -- without feature flags');

    cy.contains('Place order').click();
    cy.get('[data-qa="order-modal"]').contains('Total').should('not.exist');

    cy.percySnapshot('Order confirmation modal');

    cy.get('button').contains('Confirm order').click();
    cy.wait(100);
    cy.get('button').contains('View order details').click();

    cy.findByRole('heading', { name: /Order/i }).should('exist');
    cy.findByText(/Please reach out to/).should('exist');
    cy.findByText(/if you have any questions pertaining to your order/).should(
      'exist',
    );

    cy.percySnapshot(
      'Order view without feature flags -- without feature flags',
    );
  });
});

context('Cart page -- feature flags on', () => {
  it('renders the cart and order flow', () => {
    cy.visit('/');

    cy.bo((bo) => {
      bo.create.cartWithVideos();
      bo.inspect().users.insertCurrentUser(
        UserFactory.sample({
          features: {
            BO_WEB_APP_REQUEST_TRIMMING: true,
            BO_WEB_APP_REQUEST_ADDITIONAL_EDITING: true,
            BO_WEB_APP_PRICES: true,
          },
        }),
      );
      bo.inspect().links.cart = {
        href: 'https://www.boclips.com',
        templated: false,
      };
    });
    cy.get('[data-qa="account-menu"]').click();

    cy.get('[data-qa="cart-button"]').click();

    cy.findByText('Shopping cart');
    cy.findAllByRole('button', { name: 'Remove Remove' }); // SVG + text leads to this title

    cy.findAllByText(
      'Request human-generated caption and transcript files (in English)',
    ).should('exist');
    cy.findAllByText('Request other type of editing').should('exist');

    cy.percySnapshot('Cart view -- with feature flags');

    cy.contains('Place order').click();
    cy.get('[data-qa="order-modal"]').contains('Total').should('exist');

    cy.percySnapshot('Order confirmation modal');

    cy.get('button').contains('Confirm order').click();
    cy.wait(100);
    cy.get('button').contains('View order details').click();

    cy.findByRole('heading', { name: /Order/i }).should('exist');
    cy.findByText(/Please reach out to/).should('exist');
    cy.findByText(/if you have any questions pertaining to your order/).should(
      'exist',
    );

    cy.percySnapshot('Order view with feature flags -- with feature flags');
  });
});
