import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { RegisterComponent } from '../register.component';
import { AuthService } from '../../../services/auth.service';
import { of, throwError } from 'rxjs';

describe('RegisterComponent Integration Tests', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
      providers: [AuthService],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create the component', () => {
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

  it('should have validation errors for all fields', () => {
    component.form.controls['firstName'].setValue('');
    component.form.controls['lastName'].setValue('');
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');

    component.form.controls['firstName'].markAsTouched();
    component.form.controls['lastName'].markAsTouched();
    component.form.controls['email'].markAsTouched();
    component.form.controls['password'].markAsTouched();

    expect(component.form.controls['firstName'].hasError('required')).toBe(
      true
    );
    expect(component.form.controls['lastName'].hasError('required')).toBe(true);
    expect(component.form.controls['email'].hasError('required')).toBe(true);
    expect(component.form.controls['password'].hasError('required')).toBe(true);
  });

  it('should submit the form and register a new user', async () => {
    const navigateSpy = jest
      .spyOn(router, 'navigate')
      .mockImplementation(() => Promise.resolve(true));
    const registerSpy = jest
      .spyOn(authService, 'register')
      .mockReturnValue(of(void 0));

    component.form.controls['firstName'].setValue('Paul');
    component.form.controls['lastName'].setValue('Louis');
    component.form.controls['email'].setValue('paul.louis@example.com');
    component.form.controls['password'].setValue('password123');

    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton.disabled).toBeFalsy();

    component.submit();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(registerSpy).toHaveBeenCalledWith({
      firstName: 'Paul',
      lastName: 'Louis',
      email: 'paul.louis@example.com',
      password: 'password123',
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should display error message on registration failure', async () => {
    const errorMessage = 'Registration failed';
    jest
      .spyOn(authService, 'register')
      .mockReturnValue(throwError(() => new Error(errorMessage)));

    component.form.controls['firstName'].setValue('Invalid');
    component.form.controls['lastName'].setValue('User');
    component.form.controls['email'].setValue('invalid-email@example.com');
    component.form.controls['password'].setValue('short');

    component.submit();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.onError).toBe(true);
    const errorMessageElement = fixture.nativeElement.querySelector('.error');
    expect(errorMessageElement).toBeTruthy();
    expect(errorMessageElement.textContent).toContain('An error occurred');
  });

  it('should disable the submit button when form is invalid', () => {
    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );

    component.form.controls['firstName'].setValue('');
    component.form.controls['lastName'].setValue('');
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');

    fixture.detectChanges();

    expect(submitButton.disabled).toBeTruthy();
  });

  it('should call router.navigate on successful registration', async () => {
    const navigateSpy = jest
      .spyOn(router, 'navigate')
      .mockImplementation(() => Promise.resolve(true));
    const registerSpy = jest
      .spyOn(authService, 'register')
      .mockReturnValue(of(void 0));

    component.form.controls['firstName'].setValue('ValidFirstName');
    component.form.controls['lastName'].setValue('ValidLastName');
    component.form.controls['email'].setValue('valid.email@example.com');
    component.form.controls['password'].setValue('ValidPassword123');

    component.submit();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(registerSpy).toHaveBeenCalledWith({
      firstName: 'ValidFirstName',
      lastName: 'ValidLastName',
      email: 'valid.email@example.com',
      password: 'ValidPassword123',
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should handle error on registration failure', async () => {
    const errorMessage = 'Registration failed';
    jest
      .spyOn(authService, 'register')
      .mockReturnValue(throwError(() => new Error(errorMessage)));

    component.form.controls['firstName'].setValue('ValidFirstName');
    component.form.controls['lastName'].setValue('ValidLastName');
    component.form.controls['email'].setValue('valid.email@example.com');
    component.form.controls['password'].setValue('ValidPassword123');

    component.submit();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.onError).toBe(true);
  });
});
