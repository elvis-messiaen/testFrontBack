/// <reference types="cypress" />
describe('sessions form spec', () => {
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

  it('sessions form successfull', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
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

    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains('Margot DELAHAYE').click();

    cy.get('textarea[formControlName=description]')
      .clear()
      .type('testFormDescription')
      .blur();

    cy.get('form').should('not.have.class', 'ng-invalid');
    cy.get('button[type="submit"]').should('not.be.disabled').click();

    cy.url().should('include', '/sessions');
  });

  it('sessions form name empty', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
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

    cy.get('input[formControlName=name]').focus();
    cy.get('input[formControlName=name]').blur();
    cy.get('input[formControlName=date]').type('2024-12-13');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains('Margot DELAHAYE').click();

    cy.get('textarea[formControlName=description]')
      .clear()
      .type('testFormDescription')
      .blur();

    cy.get('mat-form-field input[formControlName="name"]')
      .parents('mat-form-field')
      .should('have.class', 'mat-form-field-invalid');
  });

  it('sessions form date empty', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
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
    cy.get('input[formControlName=date]').focus();
    cy.get('input[formControlName=date]').blur();
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains('Margot DELAHAYE').click();

    cy.get('textarea[formControlName=description]')
      .clear()
      .type('testFormDescription')
      .blur();

    cy.get('mat-form-field input[formControlName="date"]')
      .parents('mat-form-field')
      .should('have.class', 'mat-form-field-invalid');
  });

  it('sessions form description empty', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
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

    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains('Margot DELAHAYE').click();

    cy.get('textarea[formControlName=description]').focus();
    cy.get('textarea[formControlName=description]').blur();

    cy.get('mat-form-field textarea[formControlName="description"]')
      .parents('mat-form-field')
      .should('have.class', 'mat-form-field-invalid');
  });

  it('sessions form teacher_id empty', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
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

    cy.get('mat-select[formControlName="teacher_id"]').focus();
    cy.get('mat-select[formControlName="teacher_id"]').blur();

    cy.get('textarea[formControlName=description]')
      .clear()
      .type('testFormDescription')
      .blur();

    cy.get('mat-form-field mat-select[formControlName="teacher_id"]')
      .parents('mat-form-field')
      .should('have.class', 'mat-form-field-invalid');
  });

  it('sessions form submit is invalid', () => {
    cy.visit('/sessions', {
      onBeforeLoad: (win) => {
        win.document.cookie = `auth_token=${token}`;
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
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

    cy.get('button[type=submit').should('be.disabled');
  });
});
