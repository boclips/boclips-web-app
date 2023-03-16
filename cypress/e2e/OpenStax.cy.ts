context('OpenStax', () => {
  it('OpenStax user journey', () => {
    cy.visit('/');
    cy.bo((bo) => bo.create.fixtureSet.openstaxBooks());

    cy.findByRole('button', { name: 'Explore openstax books' }).click();

    cy.findByRole('button', { name: 'theme Maths book' }).should('be.visible');
    cy.findByRole('button', { name: 'type Physics' }).click();
    cy.findByRole('button', { name: 'theme Physics book' }).should(
      'be.visible',
    );
    cy.findByRole('button', { name: 'type Maths' }).click();

    cy.percySnapshot('OpenStax explore page');

    cy.findByRole('button', { name: 'theme Maths book' }).click();

    cy.findAllByRole('heading', { name: 'Chapter 1: chapter-one' }).should(
      'have.length',
      2,
    );

    cy.findByRole('heading', { name: '1.2 section we want to view' }).click();

    cy.findByRole('link', { name: 'our target video grid card' }).should(
      'be.visible',
    );

    cy.percySnapshot('OpenStax theme page');
  });
});
