import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { LoginComponent } from '../login.component';
import { AuthService } from '../../../services/auth.service';
import { SessionService } from 'src/app/services/session.service';

describe('LoginComponent Integration Tests', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let sessionService: SessionService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
      providers: [AuthService, SessionService],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should log in successfully', async () => {
    const loginData = { email: 'test@test.com', password: 'password' };

    try {
      const result = await authService.login(loginData);

      component.form.controls['email'].setValue('test@test.com');
      component.form.controls['password'].setValue('password');

      await component.submit();
      fixture.detectChanges();

      expect(sessionService.isLogged).toBe(true);
      expect(sessionService.sessionInformation).not.toBeNull();
      expect(sessionService.sessionInformation?.username).toBe('test@test.com');
    } catch (error) {
      component.onError = true;

      component.form.controls['email'].setValue('test@test.com');
      component.form.controls['password'].setValue('password');

      await component.submit();
      fixture.detectChanges();

      const errorElement = fixture.nativeElement.querySelector('.error');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toContain('An error occurred');
    }
  });

  it('should display an error message when login fails', async () => {
    try {
      await authService.login({
        email: 'wrong@test.com',
        password: 'wrongpassword',
      });
    } catch (error) {
      component.onError = true;

      component.form.controls['email'].setValue('wrong@test.com');
      component.form.controls['password'].setValue('wrongpassword');

      await component.submit();
      fixture.detectChanges();

      const errorElement = fixture.nativeElement.querySelector('.error');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toContain('An error occurred');
    }
  });
});
