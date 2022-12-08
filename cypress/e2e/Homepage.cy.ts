import {
  disciplines,
  k12Disciplines,
} from '../../src/components/disciplinesWidget/disciplinesFixture';

context('Homepage', () => {
  it('has a homepage', () => {
    cy.visit('/');
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

    cy.percySnapshot('Home Page');

    cy.findByLabelText('Discipline Business').click();

    cy.percySnapshot('Home Page with subjects');
  });

  it('has a homepage for k12 disciplines', () => {
    cy.visit('/');
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

    cy.percySnapshot('K12 Home Page');
  });

  it('renders account panel', () => {
    cy.visit('/');
    cy.get('[data-qa="account-menu"]').click();

    cy.percySnapshot('Account panel');
  });
});
