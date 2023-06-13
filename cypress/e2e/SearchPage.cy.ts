import {
  FacetFactory,
  FacetsFactory,
} from 'boclips-api-client/dist/test-support/FacetsFactory';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';

context('Search page', () => {
  it('applies filters', () => {
    cy.visit('/');
    cy.bo((bo) => bo.create.fixtureSet.eelsBiologyGeography());

    cy.findByPlaceholderText('Search for videos');
    cy.findByRole('button', { name: 'search' }).click();

    cy.get('[data-qa="video-card-wrapper"]').should((videoCard) => {
      expect(videoCard.length).to.equal(2);
    });

    cy.get('[id="date-from"]').should('be.visible');
    cy.percySnapshot('Search before filtering');

    cy.findByLabelText('Discipline').click();
    cy.findByLabelText('Biology and Environmental Science').click();

    cy.get('[data-qa="video-card-wrapper"]').should((videoCard) => {
      expect(videoCard.length).to.equal(1);
    });

    cy.percySnapshot('Search with filters');
  });

  it(`displays special chars in search topics correctly`, () => {
    cy.visit('/videos');
    cy.bo((bo) => {
      bo.create.video(
        VideoFactory.sample({
          title: 'cats',
          topics: ['U2NocsO2ZGluZ2VyJ3MgQ2F0'],
        }),
      );
      bo.set.facets(
        FacetsFactory.sample({
          topics: [
            FacetFactory.sample({
              id: 'U2NocsO2ZGluZ2VyJ3MgQ2F0',
              name: "Schrödinger's cat",
            }),
          ],
        }),
      );
    });

    cy.findByPlaceholderText('Search for videos').type('cats');
    cy.findByRole('button', { name: 'search' }).click();
    cy.findByRole('button', { name: "Schrödinger's cat search topic" }).click();

    cy.findByRole('button', { name: "Schrödinger's cat search topic" }).should(
      'exist',
    );
  });
});
