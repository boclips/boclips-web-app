import { Constants } from '../fixtures/Constants';
import {
  disciplines,
  k12Disciplines,
} from '../../src/components/disciplinesWidget/disciplinesFixture';

context('Homepage', () => {
  const endpoint = Constants.HOME_PAGE_URL;
  const snapshotViewWidths = Constants.SNAPSHOT_VIEW_WIDTHS;

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

    cy.findByLabelText('Discipline Business').should('be.visible');

    cy.percySnapshot('Home Page', {
      widths: snapshotViewWidths,
    });

    cy.findByLabelText('Discipline Business').click();

    cy.percySnapshot('Home Page with subjects', {
      widths: snapshotViewWidths,
    });
  });

  it('has a homepage for k12 disciplines', () => {
    cy.visit(`${endpoint}/`);
    cy.bo((bo) =>
      bo.interact((apiClient) => {
        k12Disciplines.forEach((discipline) => {
          apiClient.disciplines.insertMyDiscipline(discipline);
          discipline.subjects.forEach((subject) =>
            apiClient.subjects.insertSubject(subject),
          );
        });
      }),
    );

    cy.findByLabelText('Discipline English Language Arts').should('be.visible');

    cy.percySnapshot('K12 Home Page', {
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
});
