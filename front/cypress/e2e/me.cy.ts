/// <reference types="cypress" />
describe('sessions detail spec', () => {
  let token;

  before(() => {
    cy.request('POST', '/api/auth/login', {
      email: 'yoga@studio.com',
      password: 'test!1234',
    }).then((response) => {
      token = response.body.token;
      cy.setCookie('auth_token', token);
    });
  });

  it('should navigate to Account page successfully', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    cy.url().should('include', '/sessions');

    cy.get('[data-cy="router-me"]').should('be.visible').click();

    cy.url().should('include', '/me');
  });

  it('should account H1 is not empty', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    cy.url().should('include', '/sessions');
    cy.get('[data-cy="router-me"]').should('be.visible').click();
    cy.url().should('include', '/me');
    cy.get('h1').contains('User information').should('not.be.empty');
  });

  it('should account admin is not empty', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    cy.url().should('include', '/sessions');
    cy.get('[data-cy="router-me"]').should('be.visible').click();
    cy.url().should('include', '/me');

    cy.get('[data-cy="name"]').should('not.be.empty');
  });

  it('should  email is not empty', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    cy.url().should('include', '/sessions');
    cy.get('[data-cy="router-me"]').should('be.visible').click();
    cy.url().should('include', '/me');

    cy.get('[data-cy="email"]').should('not.be.empty');
  });

  it('should  admin or not admin', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    cy.url().should('include', '/sessions');
    cy.get('[data-cy="router-me"]').should('be.visible').click();
    cy.url().should('include', '/me');

    cy.get('.my2').should('not.be.empty');
  });

  it('should  created is not empty', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    cy.url().should('include', '/sessions');
    cy.get('[data-cy="router-me"]').should('be.visible').click();
    cy.url().should('include', '/me');

    cy.get('[data-cy="created"]').should('not.be.empty');
  });

  it('should  updated is not empty', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    cy.url().should('include', '/sessions');
    cy.get('[data-cy="router-me"]').should('be.visible').click();
    cy.url().should('include', '/me');

    cy.get('[data-cy="updated"]').should('not.be.empty');
  });

  it('should go back to the previous page when clicking the back button', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    cy.url().should('include', '/sessions');

    cy.get('[data-cy="router-me"]').should('be.visible').click();
    cy.url().should('include', '/me');

    cy.get('button[mat-icon-button]').click();
    cy.url().should('include', '/sessions');
  });
});
