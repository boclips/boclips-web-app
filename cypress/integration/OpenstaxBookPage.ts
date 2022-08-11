import { findByRole } from '@testing-library/react';
import { Simulate } from 'react-dom/test-utils';
import click = Simulate.click;

context(`openstax book page`, () => {
  it(`scrolls to relevent section on click in table of contents navbar`, () => {
    cy.visit('/');
    cy.bo((bo) => bo.create.fixtureSet.openstaxBooks());
    // As the explore is behind a feature flag we have to click on another page to force a load
    cy.findByRole('button', { name: 'Cart' }).click();
    cy.findByRole('button', { name: 'Explore' }).click();

    cy.findByRole('button', { name: 'book Maths book' }).click();

    cy.findAllByRole('heading', { name: 'Chapter 1: chapter-one' }).should(
      'have.length',
      2,
    );

    cy.findByRole('heading', { name: '1.2 section we want to view' }).click();

    cy.findByRole('link', { name: 'Our target video grid view' }).should(
      'be.visible',
    );
  });
});
