import {
  FacetFactory,
  FacetsFactory,
} from 'boclips-api-client/dist/test-support/FacetsFactory';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';

// search page feature flags
// featureGate role: BO_WEB_APP_COPY_VIDEO_ID_BUTTON

context('Search page -- feature flags off', () => {
  it('applies filters', () => {
    cy.visit('/');
    cy.bo((bo) => {
      bo.create.fixtureSet.eelsBiologyGeography();
      bo.set.features({
        BO_WEB_APP_COPY_VIDEO_ID_BUTTON: false,
      });
    });

    cy.findByPlaceholderText('Search for videos');
    cy.findByRole('button', { name: 'search' }).click();

    cy.get('[data-qa="video-card-wrapper"]').should((videoCard) => {
      expect(videoCard.length).to.equal(2);
    });

    cy.findAllByLabelText('Copy video id').should('not.exist');

    cy.get('[id="date-from"]').should('be.visible');
    cy.percySnapshot('Search before filtering -- without feature flags');

    cy.findByLabelText('Discipline').click();
    cy.findByLabelText('Biology and Environmental Science').click();

    cy.get('[data-qa="video-card-wrapper"]').should((videoCard) => {
      expect(videoCard.length).to.equal(1);
    });

    cy.percySnapshot('Search with filters -- without feature flags');
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

context('Search page -- feature flags on', () => {
  it('applies filters', () => {
    cy.visit('/');
    cy.bo((bo) => {
      bo.create.fixtureSet.eelsBiologyGeography();
      bo.set.features({
        BO_WEB_APP_COPY_VIDEO_ID_BUTTON: true,
      });
    });

    cy.findByPlaceholderText('Search for videos');
    cy.findByRole('button', { name: 'search' }).click();

    cy.get('[data-qa="video-card-wrapper"]').should((videoCard) => {
      expect(videoCard.length).to.equal(2);
    });

    cy.findAllByLabelText('Copy video id').should('exist');

    cy.get('[id="date-from"]').should('be.visible');
    cy.percySnapshot('Search before filtering -- with feature flags');
  });
});
