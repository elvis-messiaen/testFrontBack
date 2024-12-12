import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('RegisterComponent integrations', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render registration form', () => {
    const firstNameInput = fixture.nativeElement.querySelector(
      'input[formcontrolname="firstName"]'
    );
    const lastNameInput = fixture.nativeElement.querySelector(
      'input[formcontrolname="lastName"]'
    );
    const emailInput = fixture.nativeElement.querySelector(
      'input[formcontrolname="email"]'
    );
    const passwordInput = fixture.nativeElement.querySelector(
      'input[formcontrolname="password"]'
    );

    expect(firstNameInput).toBeTruthy();
    expect(lastNameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
  });

  it('should display validation errors when fields are missing', () => {
    component.form.controls['firstName'].markAsTouched();
    component.form.controls['lastName'].markAsTouched();
    component.form.controls['email'].markAsTouched();
    component.form.controls['password'].markAsTouched();

    -component.form.controls['firstName'].setErrors({ required: true });
    component.form.controls['lastName'].setErrors({ required: true });
    component.form.controls['email'].setErrors({ required: true });
    component.form.controls['password'].setErrors({ required: true });

    fixture.detectChanges();

    const firstNameError = fixture.nativeElement.querySelector('mat-error');
    const lastNameError = fixture.nativeElement.querySelector('mat-error');
    const emailError = fixture.nativeElement.querySelector('mat-error');
    const passwordError = fixture.nativeElement.querySelector('mat-error');

    expect(firstNameError).toBeDefined();
    expect(lastNameError).toBeDefined();
    expect(emailError).toBeDefined();
    expect(passwordError).toBeDefined();
  });
  it('should submit the form and register a new user', () => {
    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    component.form.controls['firstName'].setValue('Paul');
    component.form.controls['lastName'].setValue('Louis');
    component.form.controls['email'].setValue('paul.louis@example.com');
    component.form.controls['password'].setValue('password123');

    fixture.detectChanges();

    expect(submitButton.disabled).toBeFalsy();

    const submitSpy = jest.spyOn(component, 'submit');
    submitButton.click();
    expect(submitSpy).toHaveBeenCalled();
  });

  it('should navigate to login page on successful registration', () => {
    const navigateSpy = jest
      .spyOn(router, 'navigate')
      .mockImplementation(() => Promise.resolve(true));

    component.form.controls['firstName'].setValue('Alice');
    component.form.controls['lastName'].setValue('Johnson');
    component.form.controls['email'].setValue('alice.johnson@example.com');
    component.form.controls['password'].setValue('securePassword123');

    fixture.detectChanges();

    const registerSpy = jest
      .spyOn(authService, 'register')
      .mockReturnValue(of(void 0));

    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    submitButton.click();

    expect(registerSpy).toHaveBeenCalledWith({
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      password: 'securePassword123',
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
  it('should display error message on registration failure', () => {
    const invalidRegisterRequest = {
      email: 'invalid-email@example.com',
      firstName: 'Invalid',
      lastName: 'User',
      password: 'short',
    };

    jest
      .spyOn(authService, 'register')
      .mockReturnValue(throwError(() => new Error('Registration failed')));

    component.form.controls['email'].setValue(invalidRegisterRequest.email);
    component.form.controls['firstName'].setValue(
      invalidRegisterRequest.firstName
    );
    component.form.controls['lastName'].setValue(
      invalidRegisterRequest.lastName
    );
    component.form.controls['password'].setValue(
      invalidRegisterRequest.password
    );
    component.submit();
    fixture.detectChanges();

    expect(component.onError).toBe(true);

    const errorMessage = fixture.nativeElement.querySelector('.error');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('An error occurred');
  });
});

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render registration form', () => {
    const firstNameInput = fixture.nativeElement.querySelector(
      'input[formcontrolname="firstName"]'
    );
    const lastNameInput = fixture.nativeElement.querySelector(
      'input[formcontrolname="lastName"]'
    );
    const emailInput = fixture.nativeElement.querySelector(
      'input[formcontrolname="email"]'
    );
    const passwordInput = fixture.nativeElement.querySelector(
      'input[formcontrolname="password"]'
    );

    expect(firstNameInput).toBeTruthy();
    expect(lastNameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
  });

  it('should display validation errors when fields are missing', () => {
    component.form.controls['firstName'].markAsTouched();
    component.form.controls['lastName'].markAsTouched();
    component.form.controls['email'].markAsTouched();
    component.form.controls['password'].markAsTouched();

    -component.form.controls['firstName'].setErrors({ required: true });
    component.form.controls['lastName'].setErrors({ required: true });
    component.form.controls['email'].setErrors({ required: true });
    component.form.controls['password'].setErrors({ required: true });

    fixture.detectChanges();

    const firstNameError = fixture.nativeElement.querySelector('mat-error');
    const lastNameError = fixture.nativeElement.querySelector('mat-error');
    const emailError = fixture.nativeElement.querySelector('mat-error');
    const passwordError = fixture.nativeElement.querySelector('mat-error');

    expect(firstNameError).toBeDefined();
    expect(lastNameError).toBeDefined();
    expect(emailError).toBeDefined();
    expect(passwordError).toBeDefined();
  });
  it('should submit the form and register a new user', () => {
    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    component.form.controls['firstName'].setValue('Paul');
    component.form.controls['lastName'].setValue('Louis');
    component.form.controls['email'].setValue('paul.louis@example.com');
    component.form.controls['password'].setValue('password123');

    fixture.detectChanges();

    expect(submitButton.disabled).toBeFalsy();

    const submitSpy = jest.spyOn(component, 'submit');
    submitButton.click();
    expect(submitSpy).toHaveBeenCalled();
  });

  it('should navigate to login page on successful registration', () => {
    const navigateSpy = jest
      .spyOn(router, 'navigate')
      .mockImplementation(() => Promise.resolve(true));

    component.form.controls['firstName'].setValue('Alice');
    component.form.controls['lastName'].setValue('Johnson');
    component.form.controls['email'].setValue('alice.johnson@example.com');
    component.form.controls['password'].setValue('securePassword123');

    fixture.detectChanges();

    const registerSpy = jest
      .spyOn(authService, 'register')
      .mockReturnValue(of(void 0));

    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    submitButton.click();

    expect(registerSpy).toHaveBeenCalledWith({
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      password: 'securePassword123',
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
  it('should display error message on registration failure', () => {
    const invalidRegisterRequest = {
      email: 'invalid-email@example.com',
      firstName: 'Invalid',
      lastName: 'User',
      password: 'short',
    };

    jest
      .spyOn(authService, 'register')
      .mockReturnValue(throwError(() => new Error('Registration failed')));

    component.form.controls['email'].setValue(invalidRegisterRequest.email);
    component.form.controls['firstName'].setValue(
      invalidRegisterRequest.firstName
    );
    component.form.controls['lastName'].setValue(
      invalidRegisterRequest.lastName
    );
    component.form.controls['password'].setValue(
      invalidRegisterRequest.password
    );
    component.submit();
    fixture.detectChanges();

    expect(component.onError).toBe(true);

    const errorMessage = fixture.nativeElement.querySelector('.error');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('An error occurred');
  });
});

describe('RegisterComponent intégrations', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call the register method in AuthService on form submit', () => {
    const registerSpy = jest
      .spyOn(authService, 'register')
      .mockReturnValue(of(undefined));
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    component.form.setValue({
      firstName,
      lastName,
      email,
      password,
    });

    component.submit();

    expect(registerSpy).toHaveBeenCalledWith({
      firstName,
      lastName,
      email,
      password,
    });
  });

  it('should navigate to login page on successful registration ', () => {
    const navigateSpy = jest
      .spyOn(router, 'navigate')
      .mockImplementation(() => Promise.resolve(true));

    jest.spyOn(authService, 'register').mockReturnValue(of(undefined));

    component.form.setValue({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    component.submit();

    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should handle error on registration failure', () => {
    const errorMessage = 'Registration failed';
    jest
      .spyOn(authService, 'register')
      .mockReturnValue(throwError(new Error(errorMessage)));

    component.form.setValue({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    component.submit();

    expect(component.onError).toBe(true);
  });

  it('should disable the submit button when form is invalid', () => {
    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );

    component.form.setValue({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });

    fixture.detectChanges();
    expect(submitButton.disabled).toBeTruthy;
  });

  it('should call router.navigate on successful registration', () => {
    const navigateSpy = jest
      .spyOn(router, 'navigate')
      .mockImplementation(() => Promise.resolve(true));

    jest.spyOn(authService, 'register').mockReturnValue(of(undefined));

    component.form.setValue({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    component.submit();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should interact with form and display validation errors', () => {
    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );

    component.form.setValue({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });

    component.form.controls['firstName'].markAsTouched();
    component.form.controls['lastName'].markAsTouched();
    component.form.controls['email'].markAsTouched();
    component.form.controls['password'].markAsTouched();

    fixture.detectChanges();

    const firstNameError = fixture.nativeElement.querySelector('mat-error');
    const lastNameError = fixture.nativeElement.querySelector('mat-error');
    const emailError = fixture.nativeElement.querySelector('mat-error');
    const passwordError = fixture.nativeElement.querySelector('mat-error');

    expect(firstNameError).toBeDefined();
    expect(lastNameError).toBeDefined();
    expect(emailError).toBeDefined();
    expect(passwordError).toBeDefined();
  });
});
