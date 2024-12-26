/// <reference types="cypress" />
describe('register spec', () => {
  it('register successfull', () => {
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register', {
      statusCode: 201,
      body: {
        firstName: 'testFirstName',
        lastName: 'testLastName',
        email: 'testEmail@gmail.com',
        password: '@&1234testPassword',
      },
    });

    cy.get('input[formControlName=firstName]').type('testFirstName');
    cy.get('input[formControlName=lastName]').type('testLastName');
    cy.get('input[formControlName=email]').type('testEmail@gmail.com');
    cy.get('input[formControlName=password]').type(
      `${'@&1234testPassword'}{enter}{enter}`
    );

    cy.url().should('include', '/login');
  });

  it('register firstName is empty', () => {
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register', {
      statusCode: 201,
      body: {
        firstName: 'testFirstName',
        lastName: 'testLastName',
        email: 'testEmail@gmail.com',
        password: '@&1234testPassword',
      },
    });

    cy.get('input[formControlName=lastName]').type('testLastName');
    cy.get('input[formControlName=email]').type('testEmail@gmail.com');
    cy.get('input[formControlName=password]').type('@&1234testPassword');

    cy.get('mat-form-field input[formControlName="firstName"]').focus().blur();

    cy.get('mat-form-field input[formControlName="firstName"]')
      .parents('mat-form-field')
      .should('have.class', 'mat-form-field-invalid');
  });

  it('register firstName is empty', () => {
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register', {
      statusCode: 201,
      body: {
        firstName: 'testFirstName',
        lastName: 'testLastName',
        email: 'testEmail@gmail.com',
        password: '@&1234testPassword',
      },
    });

    cy.get('input[formControlName=firstName]').type('testFirstName');
    cy.get('input[formControlName=email]').type('testEmail@gmail.com');
    cy.get('input[formControlName=password]').type('@&1234testPassword');

    cy.get('mat-form-field input[formControlName="lastName"]').focus().blur();

    cy.get('mat-form-field input[formControlName="lastName"]')
      .parents('mat-form-field')
      .should('have.class', 'mat-form-field-invalid');
  });

  it('register email is empty', () => {
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register', {
      statusCode: 201,
      body: {
        firstName: 'testFirstName',
        lastName: 'testLastName',
        email: 'testEmail@gmail.com',
        password: '@&1234testPassword',
      },
    });

    cy.get('input[formControlName=firstName]').type('testFirstName');
    cy.get('input[formControlName=lastName]').type('testLastName');
    cy.get('input[formControlName=password]').type('@&1234testPassword');

    cy.get('mat-form-field input[formControlName="email"]').focus().blur();

    cy.get('mat-form-field input[formControlName="email"]')
      .parents('mat-form-field')
      .should('have.class', 'mat-form-field-invalid');
  });

  it('register password is empty', () => {
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register', {
      statusCode: 201,
      body: {
        firstName: 'testFirstName',
        lastName: 'testLastName',
        email: 'testEmail@gmail.com',
        password: '@&1234testPassword',
      },
    });

    cy.get('input[formControlName=firstName]').type('testFirstName');
    cy.get('input[formControlName=lastName]').type('testLastName');
    cy.get('input[formControlName=email]').type('testEmail@gmail.com');

    cy.get('mat-form-field input[formControlName="password"]').focus().blur();

    cy.get('mat-form-field input[formControlName="password"]')
      .parents('mat-form-field')
      .should('have.class', 'mat-form-field-invalid');
  });

  it('register submit is invalid', () => {
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register', {
      statusCode: 201,
      body: {
        firstName: 'testFirstName',
        lastName: 'testLastName',
        email: 'testEmail@gmail.com',
        password: '@&1234testPassword',
      },
    });
    cy.get('button[type=submit').should('be.disabled');
  });
});
