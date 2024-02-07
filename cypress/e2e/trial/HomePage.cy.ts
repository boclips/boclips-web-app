context('Trial Home Page', () => {
  it('Fill profile modal -- admin', () => {
    cy.visit('/');

    cy.bo((bo) => {
      bo.create.trialAdminUser();
    });

    cy.findByText('Tell us a bit more about you').should('be.visible');
    cy.findByText('Job Title').should('be.visible');
    cy.findByText('Organization type').should('be.visible');
    cy.findByText('Audience').should('be.visible');
    cy.findByText('I heard about Boclips').should('be.visible');
    cy.findByText('Content Topics').should('be.visible');

    cy.percySnapshot('Trial Homepage for admin before data input');

    cy.get('[data-qa="input-dropdown-job-title"]').within((el) => {
      el.find('button').trigger('click');
      el.find('ul li').first().children()[0].click();
    });

    cy.get('[data-qa="input-dropdown-organization-type"]').within((el) => {
      el.find('button').trigger('click');
      el.find('ul li').first().children()[0].click();
      el.find('button').trigger('click');
    });

    cy.get('[data-qa="input-dropdown-audience"]').within((el) => {
      el.find('button').trigger('click');
      el.find('ul li').first().children()[0].click();
      el.find('button').trigger('click');
    });

    cy.get('[data-qa="input-dropdown-discovery-method"]').within((el) => {
      el.find('button').trigger('click');
      el.find('ul li').first().children()[0].click();
      el.find('button').trigger('click');
    });

    cy.findByLabelText('Content Topics').type('Test baby');

    cy.findByRole('button', { name: "Let's Go!" }).click();

    cy.percySnapshot('Trial Homepage for admin after data input');
  });

  it('Fill profile modal -- regular user', () => {
    cy.visit('/');

    cy.bo((bo) => {
      bo.create.trialRegularUser();
    });

    cy.findByText('Your colleague has invited you to Boclips Library!').should(
      'be.visible',
    );
    cy.findByText('Job Title').should('be.visible');
    cy.findByText('Organization type').should('not.exist');
    cy.findByText('Audience').should('be.visible');
    cy.findByText('I heard about Boclips').should('not.exist');
    cy.findByText('Content Topics').should('be.visible');

    cy.percySnapshot('Trial Homepage for regular user before data input');

    cy.get('[data-qa="input-dropdown-job-title"]').within((el) => {
      el.find('button').trigger('click');
      el.find('ul li').first().children()[0].click();
    });

    cy.get('[data-qa="input-dropdown-audience"]').within((el) => {
      el.find('button').trigger('click');
      el.find('ul li').first().children()[0].click();
      el.find('button').trigger('click');
    });

    cy.findByLabelText('Content Topics').type('Test baby');
    cy.get('[data-qa="input-checkbox-boclips-terms-conditions"').click();

    cy.findByRole('button', { name: "Let's Go!" }).click();

    cy.percySnapshot('Trial Homepage for regular user after data input');
  });

  it('Fill profile modal validation', () => {
    cy.visit('/');

    cy.bo((bo) => {
      bo.create.trialAdminUser();
    });

    cy.findByText('Tell us a bit more about you').should('be.visible');
    cy.findByText('Job Title').should('be.visible');
    cy.findByText('Organization type').should('be.visible');
    cy.findByText('Audience').should('be.visible');
    cy.findByText('I heard about Boclips').should('be.visible');
    cy.findByText('Content Topics').should('be.visible');

    cy.findByRole('button', { name: "Let's Go!" }).click();

    cy.findByText('Job title is required').should('be.visible');
    cy.findByText('Organization type is required').should('be.visible');
    cy.findByText('Audience is required').should('be.visible');
    cy.findByText('I heard about Boclips is required').should('be.visible');
    cy.findByText('Content topics is required').should('be.visible');

    cy.percySnapshot('Trial Homepage validation');
  });
});
