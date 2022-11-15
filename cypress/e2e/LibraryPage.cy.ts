import { Constants } from '../fixtures/Constants';

context('Libray page', () => {
  const snapshotViewWidths = Constants.SNAPSHOT_VIEW_WIDTHS;

  it('renders empty library', () => {
    cy.visit('/');
    cy.get('[data-qa="playlists-button"]').click();

    cy.findByRole('button', { name: 'Create new playlist' }).should(
      'be.visible',
    );
    cy.findAllByRole('progressbar').should('not.exist');

    cy.percySnapshot('Empty library view', { widths: snapshotViewWidths });
  });

  it('renders playlist with videos', () => {
    cy.visit('/');
    cy.bo((bo) => bo.create.playlistWithVideos());
    cy.get('[data-qa="playlists-button"]').click();

    cy.findAllByRole('progressbar').should('not.exist');
    cy.findByRole('link', { name: /My Playlist/i }).should('exist');

    cy.percySnapshot('Library with playlist view', {
      widths: snapshotViewWidths,
    });

    cy.get('button').contains('Create new playlist').click();
    cy.percySnapshot('Create new playlist modal view', {
      widths: snapshotViewWidths,
    });

    cy.findByLabelText('Close Create new playlist modal').click();
    cy.findByText('My playlist').click();

    cy.get('[data-qa="playlistTitle"]').should('be.visible');
    cy.findAllByLabelText('Add or remove from playlist').should('exist');

    cy.percySnapshot('Playlist with videos view', {
      widths: snapshotViewWidths,
    });
  });
});
