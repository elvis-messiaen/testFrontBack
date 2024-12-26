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

  it('should detail acces succes', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    cy.url().should('include', '/sessions');
    cy.get('mat-card').contains('Detail').should('be.visible').click();
  });

  it('should title not empty', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    cy.url().should('include', '/sessions');
    cy.get('mat-card').contains('Detail').should('be.visible').click();

    cy.get('h1').should('not.be.empty');
  });

  it('should fullName not empty', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    cy.url().should('include', '/sessions');
    cy.get('mat-card').contains('Detail').should('be.visible').click();

    cy.get('.ml3').should('not.be.empty');
  });

  it('should image not empty', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    cy.url().should('include', '/sessions');
    cy.get('mat-card').contains('Detail').should('be.visible').click();

    cy.get('.picture').should('have.attr', 'src').and('not.be.empty');
  });

  it('should date not empty', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    cy.url().should('include', '/sessions');
    cy.get('mat-card').contains('Detail').should('be.visible').click();

    cy.get('.ml1').should('not.be.empty');
  });

  it('should description not empty', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    cy.url().should('include', '/sessions');
    cy.get('mat-card').contains('Detail').should('be.visible').click();

    cy.get('.description').should('not.be.empty');
  });

  it('should created not empty', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    cy.url().should('include', '/sessions');
    cy.get('mat-card').contains('Detail').should('be.visible').click();

    cy.get('.created').should('not.be.empty');
  });

  it('should updated not empty', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    cy.url().should('include', '/sessions');
    cy.get('mat-card').contains('Detail').should('be.visible').click();

    cy.get('.updated').should('not.be.empty');
  });

  it('should detail delete session and redirect to /sessions', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    cy.url().should('include', '/sessions');

    cy.get('mat-card').contains('Detail').should('be.visible').click();

    cy.get('button').contains('Delete').should('be.visible').click();

    cy.url().should('include', '/sessions');
  });
});
