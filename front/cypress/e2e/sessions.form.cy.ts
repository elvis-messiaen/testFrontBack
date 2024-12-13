/// <reference types="cypress" />

describe('sessions form spec', () => {
  it('sessions form successfull', () => {
    cy.visit('/login');
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    cy.intercept('GET', '/api/session', {
      body: [],
    }).as('session');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
    cy.url().should('include', '/sessions');

    cy.get('.ml1').click();

    cy.intercept('POST', '/api/sessions/create', {
      statusCode: 201,
      body: {
        name: 'testFormName',
        date: new Date().toISOString(),
        teacher_id: 1,
        description: 'testFormDescription',
      },
    }).as('createSession');

    cy.get('input[formControlName=name]').type('testFormName');
    cy.get('input[formControlName=date]').type('2024-12-13');

    cy.get('[data-cy="teacher-select"]').click({ force: true });
    cy.get('.mat-select-panel').invoke('show'); // Forcer l'affichage du menu
    cy.get('[data-cy="teacher-option"]').first().click();

    cy.wait('@createSession').its('response.statusCode').should('eq', 201);
    cy.url().should('include', '/sessions');
  });
});
