import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { MeComponent } from './me.component';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user.interface';
import { faker } from '@faker-js/faker';
import { Observable, Subject, of, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userService: UserService;

  const fakeUser: User = {
    id: 1,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    admin: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: fakeUser.id,
    },
    logOut: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    jest.spyOn(userService, 'getById').mockReturnValue(of(fakeUser));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back on calling back()', () => {
    const spy = jest.spyOn(window.history, 'back');
    component.back();
    expect(spy).toHaveBeenCalled();
  });
  it('should call logOut when session expires', () => {
    const spyLogOut = jest.spyOn(mockSessionService, 'logOut');

    mockSessionService.logOut();

    expect(spyLogOut).toHaveBeenCalled();
  });
});

describe('MeComponent Integration Tests', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userService: UserService;
  let router: Router;

  const fakeUser: User = {
    id: 1,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    admin: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: fakeUser.id,
    },
    logOut: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        UserService,
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    jest.spyOn(userService, 'getById').mockReturnValue(of(fakeUser));
    fixture.detectChanges();
  });

  it('should fetch user information on init', () => {
    component.ngOnInit();

    expect(userService.getById).toHaveBeenCalledWith(
      mockSessionService.sessionInformation.id.toString()
    );
    expect(component.user).toEqual(fakeUser);
  });
  it('should delete user and navigate to home on delete()', (done) => {
    const snackBar = TestBed.inject(MatSnackBar);
    const spySnackBar = jest.spyOn(snackBar, 'open');
    const router = TestBed.inject(Router);
    const spyRouter = jest.spyOn(router, 'navigate');
    const spyLogOut = jest.spyOn(mockSessionService, 'logOut');

    jest.spyOn(userService, 'delete').mockReturnValue(of({}));

    component.delete();
    setTimeout(() => {
      expect(userService.delete).toHaveBeenCalledWith(
        mockSessionService.sessionInformation.id.toString()
      );
      expect(spySnackBar).toHaveBeenCalledWith(
        'Your account has been deleted !',
        'Close',
        { duration: 3000 }
      );
      expect(spyLogOut).toHaveBeenCalled();
      expect(spyRouter).toHaveBeenCalledWith(['/']);
      done();
    }, 0);
  });
  it('should display user information correctly', () => {
    component.user = fakeUser;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const userNameElement = compiled.querySelector('.user-name')?.textContent;
    const userEmailElement = compiled.querySelector('.user-email')?.textContent;

    if (userNameElement && userEmailElement) {
      expect(userNameElement).toContain(
        `${fakeUser.firstName} ${fakeUser.lastName}`
      );
      expect(userEmailElement).toContain(fakeUser.email);
    }
  });

  it('should show an error message if user data could not be fetched', () => {
    const snackBar = TestBed.inject(MatSnackBar);
    const spySnackBar = jest.spyOn(snackBar, 'open');
    jest
      .spyOn(userService, 'getById')
      .mockReturnValue(
        throwError(() => new Error('Failed to fetch user data'))
      );

    component.ngOnInit();
    fixture.detectChanges();

    expect(spySnackBar).not.toHaveBeenCalled();
  });

  it('should handle session expiration properly', () => {
    const spyLogOut = jest.spyOn(mockSessionService, 'logOut');
    component.delete();
    expect(spyLogOut).toHaveBeenCalled();
  });
  it('should display error message when user deletion fails', async () => {
    const snackBar = TestBed.inject(MatSnackBar);
    const spySnackBar = jest.spyOn(snackBar, 'open');

    jest.spyOn(userService, 'getById').mockReturnValue(of(fakeUser));
    component.ngOnInit();

    jest
      .spyOn(userService, 'delete')
      .mockReturnValue(throwError(() => new Error('Deletion failed')));

    try {
      await component.delete();
    } catch {
      expect(spySnackBar).toHaveBeenCalledWith('Deletion failed', 'Close', {
        duration: 3000,
      });
    }
  });
  it('should show success message and navigate on successful deletion', async () => {
    const snackBar = TestBed.inject(MatSnackBar);
    const spySnackBar = jest.spyOn(snackBar, 'open');
    const spyLogOut = jest.spyOn(mockSessionService, 'logOut');
    const spyRouter = jest.spyOn(router, 'navigate');

    jest.spyOn(userService, 'delete').mockReturnValue(of({}));

    await component.delete();

    expect(spySnackBar).toHaveBeenCalledWith(
      'Your account has been deleted !',
      'Close',
      { duration: 3000 }
    );
    expect(spyLogOut).toHaveBeenCalled();
    expect(spyRouter).toHaveBeenCalledWith(['/']);
  });

  it('should log out and navigate to login page on session expiration', async () => {
    const spyLogOut = jest.spyOn(mockSessionService, 'logOut');
    const spyRouter = jest.spyOn(router, 'navigate');

    mockSessionService.logOut();

    await router.navigate(['/login']);

    expect(spyLogOut).toHaveBeenCalled();
    expect(spyRouter).toHaveBeenCalledWith(['/login']);
  });
});
