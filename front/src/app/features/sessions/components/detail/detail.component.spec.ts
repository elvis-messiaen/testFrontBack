import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';
import { DetailComponent } from './detail.component';
import { of } from 'rxjs';
import { Session } from '../../interfaces/session.interface';
import { formatDate, registerLocaleData } from '@angular/common';
import { faker } from '@faker-js/faker';
import { Teacher } from 'src/app/interfaces/teacher.interface';
import localeFr from '@angular/common/locales/fr';
import { Router } from '@angular/router';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let service: SessionService;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
    delete: jest.fn().mockReturnValue(of({})),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockMatSnackBar = {
    open: jest.fn(),
  };

  beforeAll(() => {
    registerLocaleData(localeFr, 'fr-FR');
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DetailComponent);
    service = TestBed.inject(SessionService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call back function', () => {
    const backSpy = jest.spyOn(window.history, 'back');
    component.back();

    expect(backSpy).toHaveBeenCalled();
  });

  it('should call participate API and update session', (done) => {
    const participateSpy = jest
      .spyOn(component['sessionApiService'], 'participate')
      .mockReturnValue(of(void 0));
    const fetchSessionSpy = jest
      .spyOn(component as any, 'fetchSession')
      .mockImplementation(() => Promise.resolve());

    component.participate();

    expect(participateSpy).toHaveBeenCalledWith(
      component.sessionId,
      component.userId
    );

    Promise.resolve().then(() => {
      expect(fetchSessionSpy).toHaveBeenCalled();
      done();
    });
  });
  it('should delete session and navigate to sessions', async () => {
    const sessionId = 'some-unique-id';
    component.sessionId = sessionId;

    const deleteSpy = jest
      .spyOn(component['sessionApiService'], 'delete')
      .mockReturnValue(of(null));
    const snackBarSpy = jest.spyOn(mockMatSnackBar, 'open');
    const navigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate');

    await component.delete();

    expect(deleteSpy).toHaveBeenCalledWith(sessionId);
    expect(snackBarSpy).toHaveBeenCalledWith('Session deleted !', 'Close', {
      duration: 3000,
    });
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  });

  it('should display session information correctly', () => {
    const session = {
      id: faker.number.int(),
      name: faker.company.name(),
      date: faker.date.future(),
      description: faker.lorem.sentence(),
      teacher_id: faker.number.int(),
      users: [],
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };

    component.session = session;

    fixture.detectChanges();

    const nameElement = fixture.nativeElement.querySelector('h1');
    const dateElements =
      fixture.nativeElement.querySelectorAll('.my2 span.ml1');
    const dateElement = dateElements[1];
    const descriptionElement =
      fixture.nativeElement.querySelector('.description');

    const toTitleCase = (str: string) =>
      str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const formattedDate = formatDate(
      new Date(session.date),
      'longDate',
      'fr-FR'
    );

    expect(nameElement.textContent).toContain(toTitleCase(session.name));
    expect(dateElements.length).toBe(2);
    expect(descriptionElement.textContent).toContain(session.description);
  });

  it('should display Delete button if the user is an admin', () => {
    component.isAdmin = true;

    const session = {
      id: faker.number.int(),
      name: faker.company.name(),
      date: faker.date.future(),
      description: faker.lorem.sentence(),
      teacher_id: faker.number.int(),
      users: [],
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };

    component.session = session;
    fixture.detectChanges();
    const deleteButton = fixture.nativeElement.querySelector(
      'button[color="warn"]'
    );

    expect(deleteButton).toBeTruthy();
    expect(deleteButton.textContent).toContain('Delete');
  });

  it('should call unParticipate API and update session', (done) => {
    const unParticipateSpy = jest
      .spyOn(component['sessionApiService'], 'unParticipate')
      .mockReturnValue(of(void 0));
    const fetchSessionSpy = jest
      .spyOn(component as any, 'fetchSession')
      .mockImplementation(() => Promise.resolve());

    component.unParticipate();

    expect(unParticipateSpy).toHaveBeenCalledWith(
      component.sessionId,
      component.userId
    );

    Promise.resolve().then(() => {
      expect(fetchSessionSpy).toHaveBeenCalled();
      done();
    });
  });

  it('should fetch session and teacher details', (done) => {
    const session: Session = {
      id: faker.number.int(),
      name: faker.company.name(),
      date: faker.date.future(),
      teacher_id: faker.number.int(),
      description: faker.lorem.sentence(),
      users: [1],
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };

    const teacher: Teacher = {
      id: session.teacher_id,
      lastName: faker.person.lastName(),
      firstName: faker.person.firstName(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };

    const detailSpy = jest
      .spyOn(component['sessionApiService'], 'detail')
      .mockReturnValue(of(session));
    const teacherDetailSpy = jest
      .spyOn(component['teacherService'], 'detail')
      .mockReturnValue(of(teacher));

    component['fetchSession']();

    setTimeout(() => {
      expect(detailSpy).toHaveBeenCalledWith(component.sessionId);
      expect(teacherDetailSpy).toHaveBeenCalledWith(
        session.teacher_id.toString()
      );
      expect(component.session).toEqual(session);
      expect(component.teacher).toEqual(teacher);
      expect(component.isParticipate).toBe(true);
      done();
    }, 0);
  });
});

describe('DetailComponent integrations', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let service: SessionService;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
    participate: jest.fn().mockReturnValue(of({})),
    delete: jest.fn().mockReturnValue(of({})),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockMatSnackBar = {
    open: jest.fn(),
  };

  beforeAll(() => {
    registerLocaleData(localeFr, 'fr-FR');
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DetailComponent);
    service = TestBed.inject(SessionService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should load session details on component initialization', () => {
    const fetchSessionSpy = jest.spyOn(component as any, 'fetchSession');
    component.ngOnInit();
    expect(fetchSessionSpy).toHaveBeenCalled();
  });

  it('should call participate API and update session', (done) => {
    const participateSpy = jest
      .spyOn(component['sessionApiService'], 'participate')
      .mockReturnValue(of(void 0));
    const fetchSessionSpy = jest
      .spyOn(component as any, 'fetchSession')
      .mockImplementation(() => Promise.resolve());

    component.participate();

    expect(participateSpy).toHaveBeenCalledWith(
      component.sessionId,
      component.userId
    );

    Promise.resolve().then(() => {
      expect(fetchSessionSpy).toHaveBeenCalled();
      done();
    });
  });
});
