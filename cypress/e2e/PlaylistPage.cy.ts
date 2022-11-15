import { Constants } from '../fixtures/Constants';

context('Playlist page', () => {
  it('renders empty playlist', () => {
    cy.visit('/');
    cy.bo((bo) => bo.create.emptyPlaylist());
    cy.get('[data-qa="playlists-button"]').click();

    cy.findByText('My empty playlist').click();

    cy.get('[data-qa="playlistTitle"]').should('be.visible');

    cy.percySnapshot('Empty playlist view', {
      widths: Constants.SNAPSHOT_VIEW_WIDTHS,
    });
  });
});
