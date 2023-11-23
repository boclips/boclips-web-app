/// <reference types="cypress" />

type PathTree<T> = {
  [P in keyof T]: T[P] extends Record<string, unknown>
    ? [P?, ...Path<T[P]>]
    : [P?];
};

type Path<T> = PathTree<T>[keyof PathTree<T>];

declare namespace Cypress {
  type Bo = import('../../src/testSupport/bo').Bo;

  interface Chainable {
    bo: (callback: (bo: Bo) => void) => void;
  }
}
