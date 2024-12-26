/// <reference types="cypress" />
describe('sessions list spec', () => {
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

  it('sessions list successfull', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
    cy.url().should('include', '/sessions');
  });

  it('sessions Create and redirect sucessfull', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
    cy.url().should('include', '/sessions');

    cy.get('button[routerLink="create"]').should('be.visible').click();
    cy.url().should('include', '/sessions/create');
  });

  it('should navigate to /sessions/update/:id when clicking on Edit button', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
    cy.url().should('include', '/sessions');

    cy.get('[data-cy="edit"]').each(($button) => {
      cy.wrap($button)
        .invoke('attr', 'routerLink')
        .then((routerLink) => {
          if (routerLink) {
            const segments = routerLink.split('/');
            const id = segments[segments.length - 1];
            cy.wrap($button).click();
            cy.url().should('include', `/sessions/update/${id}`);
          }
        });
    });
  });

  it('should navigate to /sessions/update/:id when clicking on Detail button', () => {
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

  it('should form title is not empty', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
    cy.url().should('include', '/sessions');

    cy.get('mat-card').each(($el) => {
      cy.wrap($el).find('mat-card-title').should('not.be.empty');
    });
  });

  it('should form subtitle is not empty', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
    cy.url().should('include', '/sessions');

    cy.get('mat-card').each(($el) => {
      cy.wrap($el).find('mat-card-subtitle').should('not.be.empty');
    });
  });

  it('should form image is not empty', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
    cy.url().should('include', '/sessions');

    cy.get('mat-card').each(($el) => {
      cy.wrap($el).find('img.picture').should('exist');
    });
  });

  it('should form image is not empty', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
    cy.url().should('include', '/sessions');

    cy.get('mat-card').each(($el) => {
      cy.wrap($el).find('mat-card-content').should('exist');
    });
  });
});
