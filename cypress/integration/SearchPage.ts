import { Constants } from '../fixtures/Constants';

context('Search page', () => {
  const endpoint = Constants.HOME_PAGE_URL;
  const snapshotViewWidths = Constants.SNAPSHOT_VIEW_WIDTHS;

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
});
