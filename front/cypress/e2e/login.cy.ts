/// <reference types="cypress" />
describe('Login spec', () => {
  it('Login successfull', () => {
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

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []
    ).as('session');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.url().should('include', '/sessions');
  });

  it('Login Failed', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: {
        message: 'Invalid credentials',
      },
    });

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []
    ).as('session');

    cy.get('input[formControlName=email]').type('emailerror@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
    cy.get('.error').should('contain', 'An error occurred');
  });

  it('Login Failed message email is empty', () => {
    cy.visit('/login');

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []
    ).as('session');

    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
    cy.get('mat-form-field input[formControlName="email"]')
      .parents('mat-form-field')
      .should('have.class', 'mat-form-field-invalid');
  });

  it('Login Failed message password is empty', () => {
    cy.visit('/login');

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []
    ).as('session');

    cy.get('input[formControlName=email]').type(
      `${'emailerror@studio.com'}{enter}{enter}`
    );
    cy.get('mat-form-field input[formControlName="password"]')
      .parents('mat-form-field')
      .should('have.class', 'mat-form-field-invalid');
  });

  it('should display an error message when the site is not accessible', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/**',
      },
      {
        statusCode: 503,
        body: 'Ce site est inaccessible',
        headers: { 'content-type': 'text/html' },
      }
    ).as('getNonAccessiblePage');

    cy.visit('/login', { failOnStatusCode: false });

    cy.contains('Ce site est inaccessible').should('be.visible');
  });
});
