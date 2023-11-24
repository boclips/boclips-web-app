context('Libray page', () => {
  it('renders empty library', () => {
    cy.visit('/');
    cy.get('[data-qa="playlists-button"]').click();

    cy.findByRole('button', { name: 'Create new playlist' }).should(
      'be.visible',
    );
    cy.findAllByRole('progressbar').should('not.exist');

    cy.percySnapshot('Empty library view');
  });

  it('renders playlist with videos', () => {
    cy.visit('/');

    cy.bo((bo) => {
      bo.create.playlistWithVideos();
      bo.inspect().links.cart = {
        href: 'https://www.boclips.com',
        templated: false,
      };
    });
    cy.get('[data-qa="playlists-button"]').click();

    cy.findAllByRole('progressbar').should('not.exist');
    cy.findByRole('link', { name: /My Playlist/i }).should('exist');

    cy.percySnapshot('Library with playlist view');

    cy.get('button').contains('Create new playlist').click();
    cy.percySnapshot('Create new playlist modal view');

    cy.findByLabelText('Close Create new playlist modal').click();
    cy.findByText('My playlist').click();

    cy.get('[data-qa="playlistTitle"]').should('be.visible');
    cy.findAllByLabelText('Add or remove from playlist').should('exist');

    cy.percySnapshot('Playlist with videos view');
  });
});
