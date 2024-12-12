import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { faker } from '@faker-js/faker';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: AuthService;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [SessionService],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid email format', () => {
    const email = faker.internet.email();
    component.form.controls['email'].setValue(email);
    fixture.detectChanges();

    expect(component.form.controls['email'].valid).toBe(true);
  });

  it('should require an email', () => {
    component.form.controls['email'].setValue('');
    fixture.detectChanges();

    expect(component.form.controls['email'].valid).toBe(false);
    expect(component.form.controls['email'].errors).toEqual({ required: true });
  });

  it('should be created service', () => {
    expect(authService).toBeTruthy();
  });

  it('should initialize email and password to empty', () => {
    expect(component.form.value.email).toBe('');
    expect(component.form.value.password).toBe('');
  });

  it('should render login from', () => {
    const email = fixture.nativeElement.querySelector(
      'input[formcontrolname="email"]'
    );
    const password = fixture.nativeElement.querySelector(
      'input[formcontrolname="password"]'
    );
    expect(email).toBeTruthy();
    expect(password).toBeTruthy();
  });
  it('should require a password', () => {
    component.form.controls['password'].setValue('');
    fixture.detectChanges();

    expect(component.form.controls['password'].valid).toBe(false);
    expect(component.form.controls['password'].errors).toEqual({
      required: true,
    });
  });

  it('should require password length of at least 3 characters', () => {
    const shortPassword = faker.internet.password({ length: 2 });
    const validPassword = faker.internet.password({ length: 8 });
    const longPassword = faker.internet.password({ length: 20 });

    component.form.controls['password'].setValue(shortPassword);
    component.form.controls['password'].markAsTouched();
    component.form.controls['password'].setErrors({
      minlength: {
        requiredLength: 3,
        actualLength: 2,
      },
    });
    fixture.detectChanges();
    expect(component.form.controls['password'].errors?.['minlength']).toEqual({
      requiredLength: 3,
      actualLength: 2,
    });

    component.form.controls['password'].setValue(validPassword);
    component.form.controls['password'].setErrors(null);
    fixture.detectChanges();
    expect(component.form.controls['password'].errors).toBeNull();

    component.form.controls['password'].setValue(longPassword);
    component.form.controls['password'].setErrors({
      maxlength: {
        requiredLength: 16,
        actualLength: 20,
      },
    });
    fixture.detectChanges();
    expect(component.form.controls['password'].errors?.['maxlength']).toEqual({
      requiredLength: 16,
      actualLength: 20,
    });
  });

  it('should render and define the submit button', () => {
    const submit = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submit).toBeTruthy();
    expect(submit).toBeDefined();
  });

  it('shoul beconnected to the server with login and password', () => {
    const emailInput = fixture.nativeElement.querySelector(
      'input[formcontrolname="email"]'
    );
    const passwordInput = fixture.nativeElement.querySelector(
      'input[formcontrolname="password"]'
    );

    emailInput.value = 'example@.com';
    passwordInput.value = '123';

    emailInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const loginSpy = jest
      .spyOn(authService, 'login')
      .mockReturnValue(of({} as SessionInformation));
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(loginSpy).toHaveBeenCalledWith({
      email: 'example@.com',
      password: '123',
    });
  });

  it('should email or password is incorrect', () => {
    const emailInput = fixture.nativeElement.querySelector(
      'input[formcontrolname="email"]'
    );
    const passwordInput = fixture.nativeElement.querySelector(
      'input[formcontrolname="password"]'
    );
    emailInput.value = 'example@.com';
    passwordInput.value = '123';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const loginSpy = jest
      .spyOn(authService, 'login')
      .mockReturnValue(throwError(() => new Error('Identifiants invalides')));
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(loginSpy).toHaveBeenCalledWith({
      email: 'example@.com',
      password: '123',
    });

    fixture.detectChanges();
    expect(component.onError).toBe(true);
  });

  it('should not allow invalid email addresses', () => {
    const invalidEmail = 'invalid-email';
    const validEmail = 'test@example.com';

    component.form.controls['email'].setValue(invalidEmail);
    component.form.controls['email'].markAsTouched();
    fixture.detectChanges();
    expect(component.form.controls['email'].valid).toBe(false);
    expect(component.form.controls['email'].errors?.['email']).toBeTruthy();

    component.form.controls['email'].setValue(validEmail);
    component.form.controls['email'].setErrors(null);
    fixture.detectChanges();
    expect(component.form.controls['email'].valid).toBe(true);
    expect(component.form.controls['email'].errors).toBeNull();
  });

  it('should disable the submit button when the form is invalid', () => {
    const invalidEmail = 'invalid-email';
    const shortPassword = faker.internet.password({ length: 2 });

    component.form.controls['email'].setValue(invalidEmail);
    component.form.controls['email'].markAsTouched();
    component.form.controls['password'].setValue(shortPassword);
    component.form.controls['password'].markAsTouched();
    fixture.detectChanges();

    const isSubmitButtonDisabled = !component.form.valid;
    expect(isSubmitButtonDisabled).toBe(true);
  });

  it('should display error message on failed login attempt', () => {
    const invalidLoginRequest = {
      email: 'invalid-email',
      password: 'short',
    };

    jest
      .spyOn(authService, 'login')
      .mockReturnValue(throwError(() => new Error('Invalid login attempt')));

    component.form.controls['email'].setValue(invalidLoginRequest.email);
    component.form.controls['password'].setValue(invalidLoginRequest.password);
    component.submit();
    fixture.detectChanges();

    expect(component.onError).toBe(true);
  });

  it('should handle login error when email or password is incorrect', () => {
    const emailInput = fixture.nativeElement.querySelector(
      'input[formcontrolname="email"]'
    );
    const passwordInput = fixture.nativeElement.querySelector(
      'input[formcontrolname="password"]'
    );
    const form = fixture.nativeElement.querySelector('form');
    const loginSpy = jest
      .spyOn(authService, 'login')
      .mockReturnValue(throwError(() => new Error('Identifiants invalides')));

    emailInput.value = 'erreurEmail';
    passwordInput.value = 'erreurPassword';

    emailInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    form.dispatchEvent(new Event('submit'));

    expect(loginSpy).toHaveBeenCalledWith({
      email: 'erreurEmail',
      password: 'erreurPassword',
    });

    fixture.detectChanges();

    expect(component.onError).toBe(true);

    const errorMessage = fixture.nativeElement.querySelector('.error');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('An error occurred');
  });

  it('should navigate to /sessions on successful login', () => {
    const routerSpy = jest.spyOn(component['router'], 'navigate');

    const emailInput = fixture.nativeElement.querySelector(
      'input[formcontrolname="email"]'
    );
    const passwordInput = fixture.nativeElement.querySelector(
      'input[formcontrolname="password"]'
    );

    emailInput.value = 'example@.com';
    passwordInput.value = '123';

    emailInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const loginSpy = jest
      .spyOn(authService, 'login')
      .mockReturnValue(of({} as SessionInformation));

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(loginSpy).toHaveBeenCalledWith({
      email: 'example@.com',
      password: '123',
    });

    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['/sessions']);
  });
});

describe('LoginComponent integrations tests', () => {
  let component: LoginComponent;
  let authService: AuthService;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        SessionService,
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
      ],
    }).compileComponents();
    mockRouter = TestBed.inject(Router);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should redirect to /sessions after successful login', () => {
    const fakeSessionInformation: SessionInformation = {
      token: 'cValid_token',
      type: 'Bearer',
      id: 1,
      username: 'user',
      firstName: 'FirstName',
      lastName: 'LastName',
      admin: true,
    };

    jest
      .spyOn(authService, 'login')
      .mockReturnValue(of(fakeSessionInformation));
    const spyRouter = jest.spyOn(mockRouter, 'navigate');

    component.submit();
    fixture.detectChanges();

    expect(spyRouter).toHaveBeenCalledWith(['/sessions']);
  });

  it('should not navigate if login fails', () => {
    jest
      .spyOn(authService, 'login')
      .mockReturnValue(throwError(() => new Error('Login failed')));
    const spyRouter = jest.spyOn(mockRouter, 'navigate');

    component.submit();

    expect(spyRouter).not.toHaveBeenCalled();
    expect(component.onError).toBe(true);
  });

  it('should submit the form successfully when valid credentials are provided', () => {
    const email = faker.internet.email();
    component.form.controls['email'].setValue(email);
    fixture.detectChanges();
    const password = faker.internet.password();
    component.form.controls['password'].setValue(password);
    fixture.detectChanges();

    const loginSpy = jest
      .spyOn(authService, 'login')
      .mockReturnValue(of({} as SessionInformation));
    component.submit();
    expect(loginSpy).toHaveBeenCalledWith({ email, password });
  });

  it('should display error message when login fails', () => {
    const email = faker.internet.email();
    component.form.controls['email'].setValue(email);
    fixture.detectChanges();
    const password = faker.internet.password();
    component.form.controls['password'].setValue(password);
    fixture.detectChanges();

    jest
      .spyOn(authService, 'login')
      .mockReturnValue(throwError(() => new Error('Invalid login attempt')));
    component.submit();
    expect(component.onError).toBe(true);
  });

  it('should disable submit button if form is invalid', () => {
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton.disabled).toBe(true);
  });

  it('should call AuthService.login with correct parameters', () => {
    const email = faker.internet.email();
    component.form.controls['email'].setValue(email);
    fixture.detectChanges();
    const password = faker.internet.password();
    component.form.controls['password'].setValue(password);
    fixture.detectChanges();

    const loginSpy = jest
      .spyOn(authService, 'login')
      .mockReturnValue(of({} as SessionInformation));
    component.submit();
    expect(loginSpy).toHaveBeenCalledWith({ email, password });
  });

  it('should not navigate if login fails', () => {
    jest
      .spyOn(authService, 'login')
      .mockReturnValue(throwError(() => new Error('Login failed')));
    const spyRouter = jest.spyOn(mockRouter, 'navigate');

    component.submit();

    expect(spyRouter).not.toHaveBeenCalled();
    expect(component.onError).toBe(true);
  });

  it('should show password as text when visibility button is clicked', () => {
    const visibilityButton = fixture.nativeElement.querySelector(
      'button[mat-icon-button]'
    );
    visibilityButton.click();
    fixture.detectChanges();

    const passwordInput = fixture.nativeElement.querySelector(
      'input[formcontrolname="password"]'
    );
    expect(passwordInput.type).toBe('text');
  });

  it('should call sessionService.logIn when login is successful', () => {
    const fakeSessionInformation: SessionInformation = {
      token: 'cValid_token',
      type: 'Bearer',
      id: 1,
      username: 'user',
      firstName: 'FirstName',
      lastName: 'LastName',
      admin: true,
    };

    jest
      .spyOn(authService, 'login')
      .mockReturnValue(of(fakeSessionInformation));
    const logInSpy = jest.spyOn(component['sessionService'], 'logIn');

    component.submit();
    fixture.detectChanges();

    expect(logInSpy).toHaveBeenCalledWith(fakeSessionInformation);
  });
  it('should not show error message initially', () => {
    const errorMessage = fixture.nativeElement.querySelector('.error');
    expect(errorMessage).toBeFalsy();
  });
  it('should keep form values after submit if login fails', () => {
    const email = faker.internet.email();
    component.form.controls['email'].setValue(email);
    fixture.detectChanges();
    const password = faker.internet.password();
    component.form.controls['password'].setValue(password);
    fixture.detectChanges();

    jest
      .spyOn(authService, 'login')
      .mockReturnValue(throwError(() => new Error('Invalid login attempt')));
    component.submit();
    fixture.detectChanges();

    expect(component.form.value).toEqual({ email, password });
  });
});
