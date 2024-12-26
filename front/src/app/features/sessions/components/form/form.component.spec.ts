import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { faker } from '@faker-js/faker';
import { of } from 'rxjs';
import { FormComponent } from './form.component';
import { Session } from '../../interfaces/session.interface';
import { Teacher } from 'src/app/interfaces/teacher.interface';

describe('FormComponent', () => {
  beforeAll(() => {
    HTMLElement.prototype.animate = jest.fn().mockImplementation(() => ({
      onfinish: null,
      cancel: jest.fn(),
      play: jest.fn(),
      pause: jest.fn(),
      addEventListener: jest.fn(),
    }));
  });

  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        SessionApiService,
      ],
      declarations: [FormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update session if onUpdate is true', () => {
    const updateSpy = jest
      .spyOn(component['sessionApiService'], 'update')
      .mockReturnValue(of({} as Session));
    const exitPageSpy = jest.spyOn(component as any, 'exitPage');

    jest
      .spyOn(component['route'].snapshot.paramMap, 'get')
      .mockReturnValue('1');
    component.onUpdate = true;
    component['id'] = '1';

    const session: Session = {
      name: faker.company.name(),
      date: faker.date.future(),
      teacher_id: faker.number.int(),
      description: faker.lorem.sentence(),
      users: [faker.number.int(), faker.number.int()],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    component['initForm'](session);
    fixture.detectChanges();

    component.sessionForm?.setValue({
      name: session.name,
      date: new Date(session.date),
      teacher_id: session.teacher_id,
      description: session.description,
    });
    component.submit();
    fixture.detectChanges();

    const expectedSession = {
      name: session.name,
      date: new Date(session.date.toISOString()),
      teacher_id: session.teacher_id,
      description: session.description,
    };

    expect(updateSpy).toHaveBeenCalledWith('1', expectedSession);
    expect(exitPageSpy).toHaveBeenCalledWith('Session updated !');
  });

  it('should assign form value to session variable', () => {
    const createSpy = jest
      .spyOn(component['sessionApiService'], 'create')
      .mockReturnValue(of({} as Session));
    const exitPageSpy = jest.spyOn(component as any, 'exitPage');

    const session = {
      name: 'New Session',
      date: new Date().toISOString().split('T')[0],
      teacher_id: faker.number.int(),
      description: 'A new session description.',
    };

    component.sessionForm?.setValue(session);
    expect(component.sessionForm?.value).toBeDefined();

    component.submit();
    fixture.detectChanges();

    expect(createSpy).toHaveBeenCalledWith(session);
    expect(exitPageSpy).toHaveBeenCalledWith('Session created !');
  });

  it('should create session when onUpdate is false', () => {
    const session = {
      name: 'New Session',
      date: new Date().toISOString().split('T')[0],
      teacher_id: faker.number.int(),
      description: 'A new session description.',
    };

    component.onUpdate = false;
    const createSpy = jest
      .spyOn(component['sessionApiService'], 'create')
      .mockReturnValue(of({} as Session));
    const exitPageSpy = jest.spyOn(component as any, 'exitPage');

    component.sessionForm?.setValue(session);
    component.submit();
    fixture.detectChanges();

    expect(createSpy).toHaveBeenCalledWith(session);
    expect(exitPageSpy).toHaveBeenCalledWith('Session created !');
  });

  it('should show error if a required field is missing', () => {
    const createSpy = jest
      .spyOn(component['sessionApiService'], 'create')
      .mockReturnValue(of({} as Session));
    const exitPageSpy = jest.spyOn(component as any, 'exitPage');

    component.sessionForm?.setValue({
      name: faker.company.name(),
      date: '',
      teacher_id: faker.number.int(),
      description: faker.lorem.sentence(),
    });

    component.sessionForm?.markAllAsTouched();
    fixture.detectChanges();

    const nameControl = component.sessionForm?.get('name');
    const dateControl = component.sessionForm?.get('date');
    const teacherIdControl = component.sessionForm?.get('teacher_id');
    const descriptionControl = component.sessionForm?.get('description');

    expect(nameControl?.valid).toBe(true);
    expect(dateControl?.invalid).toBe(true);
    expect(teacherIdControl?.valid).toBe(true);
    expect(descriptionControl?.valid).toBe(true);
    expect(component.sessionForm?.invalid).toBe(true);

    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton.disabled).toBe(true);

    expect(createSpy).toHaveBeenCalledTimes(0);
    expect(exitPageSpy).toHaveBeenCalledTimes(0);
    expect(component.sessionForm?.invalid).toBeTruthy();
  });

  it('should initialize the form on init', () => {
    const navigateSpy = jest.spyOn(component['router'], 'navigate');
    component.ngOnInit();

    expect(component.sessionForm).toBeDefined();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should navigate if not admin', () => {
    const navigateSpy = jest.spyOn(component['router'], 'navigate');

    if (component['sessionService'].sessionInformation) {
      component['sessionService'].sessionInformation.admin = false;
    }
    component.ngOnInit();

    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  });

  it('should update session if onUpdate is true', () => {
    const updateSpy = jest
      .spyOn(component['sessionApiService'], 'update')
      .mockReturnValue(of({} as Session));
    const exitPageSpy = jest.spyOn(component as any, 'exitPage');

    jest
      .spyOn(component['route'].snapshot.paramMap, 'get')
      .mockReturnValue('1');
    component.onUpdate = true;
    component['id'] = '1';

    const session: Session = {
      name: faker.company.name(),
      date: faker.date.future(),
      teacher_id: faker.number.int(),
      description: faker.lorem.sentence(),
      users: [faker.number.int(), faker.number.int()],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    component['initForm'](session);
    fixture.detectChanges();

    component.sessionForm?.setValue({
      name: session.name,
      date: new Date(session.date),
      teacher_id: session.teacher_id,
      description: session.description,
    });
    component.submit();
    fixture.detectChanges();

    const expectedSession = {
      name: session.name,
      date: new Date(session.date.toISOString()),
      teacher_id: session.teacher_id,
      description: session.description,
    };

    expect(updateSpy).toHaveBeenCalledWith('1', expectedSession);
    expect(exitPageSpy).toHaveBeenCalledWith('Session updated !');
  });

  it('should display session information correctly', () => {
    const session: Session = {
      id: faker.number.int(),
      name: 'Test Session',
      date: new Date(),
      teacher_id: faker.number.int(),
      description: 'A test session description.',
      users: [faker.number.int(), faker.number.int()],
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };

    component['initForm'](session);
    fixture.detectChanges();

    const nameInput = fixture.nativeElement.querySelector(
      'input[formControlName="name"]'
    );
    const dateInput = fixture.nativeElement.querySelector(
      'input[formControlName="date"]'
    );
    const descriptionInput = fixture.nativeElement.querySelector(
      'textarea[formControlName="description"]'
    );

    expect(nameInput.value).toBe(session.name);
    expect(new Date(dateInput.value).toISOString().split('T')[0]).toBe(
      session.date.toISOString().split('T')[0]
    );
    expect(descriptionInput.value).toBe(session.description);
  });

  it('should initialize form with default values', () => {
    component['initForm']();

    expect(component.sessionForm?.value).toEqual({
      name: '',
      date: '',
      teacher_id: '',
      description: '',
    });
  });
  it('should initialize form with session values', () => {
    const session: Session = {
      id: faker.number.int(),
      name: faker.company.name(),
      date: faker.date.future(),
      teacher_id: faker.number.int(),
      description: faker.lorem.sentence(),
      users: [faker.number.int(), faker.number.int()],
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };

    component['initForm'](session);

    expect(component.sessionForm?.value).toEqual({
      name: session.name,
      date: new Date(session.date).toISOString().split('T')[0],
      teacher_id: session.teacher_id,
      description: session.description,
    });
  });

  it('should set onUpdate to true and initialize form with session details if URL includes update', () => {
    const session: Session = {
      id: faker.number.int(),
      name: faker.company.name(),
      date: faker.date.future(),
      teacher_id: faker.number.int(),
      description: faker.lorem.sentence(),
      users: [faker.number.int(), faker.number.int()],
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };

    const detailSpy = jest
      .spyOn(component['sessionApiService'], 'detail')
      .mockReturnValue(of(session));
    const initFormSpy = jest.spyOn(component as any, 'initForm');

    jest
      .spyOn(component['router'], 'url', 'get')
      .mockReturnValue('/sessions/update/1');
    jest
      .spyOn(component['route'].snapshot.paramMap, 'get')
      .mockReturnValue('1');

    component.ngOnInit();

    expect(component.onUpdate).toBe(true);
    expect(detailSpy).toHaveBeenCalledWith('1');
    expect(initFormSpy).toHaveBeenCalledWith(session);
  });

  it('should show error if a required field is missing', () => {
    const session = {
      name: '',
      date: '',
      teacher_id: '',
      description: '',
    };

    component.sessionForm?.setValue(session);
    component.sessionForm?.markAllAsTouched();
    fixture.detectChanges();

    expect(component.sessionForm?.invalid).toBe(true);

    const nameControl = component.sessionForm?.get('name');
    const dateControl = component.sessionForm?.get('date');
    const teacherIdControl = component.sessionForm?.get('teacher_id');
    const descriptionControl = component.sessionForm?.get('description');

    expect(nameControl?.invalid).toBe(true);
    expect(dateControl?.invalid).toBe(true);
    expect(teacherIdControl?.invalid).toBe(true);
    expect(descriptionControl?.invalid).toBe(true);
  });
});

describe("FormComponent tests d'intégrations", () => {
  beforeAll(() => {
    HTMLElement.prototype.animate = jest.fn().mockImplementation(() => ({
      onfinish: null,
      cancel: jest.fn(),
      play: jest.fn(),
      pause: jest.fn(),
      addEventListener: jest.fn(),
    }));
  });

  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let teacherServiceSpy: jest.SpyInstance;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        SessionApiService,
      ],
      declarations: [FormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    teacherServiceSpy = jest.spyOn(component['teacherService'], 'all');

    fixture.detectChanges();
  });

  it('should navigate away if user is not admin', () => {
    const navigateSpy = jest.spyOn(component['router'], 'navigate');

    if (component['sessionService'].sessionInformation) {
      component['sessionService'].sessionInformation.admin = false;
    }
    component.ngOnInit();

    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  });
  it('should load session data for update', () => {
    const session: Session = {
      id: faker.number.int(),
      name: faker.company.name(),
      date: faker.date.future(),
      teacher_id: faker.number.int(),
      description: faker.lorem.sentence(),
      users: [faker.number.int(), faker.number.int()],
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };

    const detailSpy = jest
      .spyOn(component['sessionApiService'], 'detail')
      .mockReturnValue(of(session));
    const initFormSpy = jest.spyOn(component as any, 'initForm');

    jest
      .spyOn(component['router'], 'url', 'get')
      .mockReturnValue('/sessions/update/1');
    jest
      .spyOn(component['route'].snapshot.paramMap, 'get')
      .mockReturnValue('1');

    component.ngOnInit();

    expect(detailSpy).toHaveBeenCalledWith('1');
    expect(initFormSpy).toHaveBeenCalledWith(session);
  });

  it('should initialize empty form in create mode', () => {
    const initFormSpy = jest.spyOn(component as any, 'initForm');

    jest
      .spyOn(component['router'], 'url', 'get')
      .mockReturnValue('/sessions/create');

    component.ngOnInit();

    expect(initFormSpy).toHaveBeenCalled();
  });

  it('should submit form and create session', () => {
    const session = {
      name: 'New Session',
      date: new Date().toISOString().split('T')[0],
      teacher_id: faker.number.int(),
      description: 'A new session description.',
    };

    const createSpy = jest
      .spyOn(component['sessionApiService'], 'create')
      .mockReturnValue(of({} as Session));
    const exitPageSpy = jest.spyOn(component as any, 'exitPage');

    component.sessionForm?.setValue(session);
    component.submit();
    fixture.detectChanges();

    expect(createSpy).toHaveBeenCalledWith(session);
    expect(exitPageSpy).toHaveBeenCalledWith('Session created !');
  });
  it('should submit form and update session', () => {
    const updateSpy = jest
      .spyOn(component['sessionApiService'], 'update')
      .mockReturnValue(of({} as Session));
    const exitPageSpy = jest.spyOn(component as any, 'exitPage');

    jest
      .spyOn(component['route'].snapshot.paramMap, 'get')
      .mockReturnValue('1');
    component.onUpdate = true;
    component['id'] = '1';

    const session: Session = {
      name: faker.company.name(),
      date: faker.date.future(),
      teacher_id: faker.number.int(),
      description: faker.lorem.sentence(),
      users: [faker.number.int(), faker.number.int()],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    component['initForm'](session);
    fixture.detectChanges();

    component.sessionForm?.setValue({
      name: session.name,
      date: new Date(session.date),
      teacher_id: session.teacher_id,
      description: session.description,
    });
    component.submit();
    fixture.detectChanges();

    const expectedSession = {
      name: session.name,
      date: new Date(session.date.toISOString()),
      teacher_id: session.teacher_id,
      description: session.description,
    };

    expect(updateSpy).toHaveBeenCalledWith('1', expectedSession);
    expect(exitPageSpy).toHaveBeenCalledWith('Session updated !');
  });
  it('should show success message on create', () => {
    const session = {
      name: 'New Session',
      date: new Date().toISOString().split('T')[0],
      teacher_id: faker.number.int(),
      description: 'A new session description.',
    };

    const createSpy = jest
      .spyOn(component['sessionApiService'], 'create')
      .mockReturnValue(of({} as Session));
    const exitPageSpy = jest.spyOn(component as any, 'exitPage');

    component.sessionForm?.setValue(session);
    component.submit();
    fixture.detectChanges();

    expect(createSpy).toHaveBeenCalledWith(session);
    expect(exitPageSpy).toHaveBeenCalledWith('Session created !');
  });
  it('should show success message on update', () => {
    const updateSpy = jest
      .spyOn(component['sessionApiService'], 'update')
      .mockReturnValue(of({} as Session));
    const exitPageSpy = jest.spyOn(component as any, 'exitPage');

    jest
      .spyOn(component['route'].snapshot.paramMap, 'get')
      .mockReturnValue('1');
    component.onUpdate = true;
    component['id'] = '1';

    const session: Session = {
      name: faker.company.name(),
      date: faker.date.future(),
      teacher_id: faker.number.int(),
      description: faker.lorem.sentence(),
      users: [faker.number.int(), faker.number.int()],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    component['initForm'](session);
    fixture.detectChanges();

    component.sessionForm?.setValue({
      name: session.name,
      date: new Date(session.date),
      teacher_id: session.teacher_id,
      description: session.description,
    });
    component.submit();
    fixture.detectChanges();

    const expectedSession = {
      name: session.name,
      date: new Date(session.date.toISOString()),
      teacher_id: session.teacher_id,
      description: session.description,
    };

    expect(updateSpy).toHaveBeenCalledWith('1', expectedSession);
    expect(exitPageSpy).toHaveBeenCalledWith('Session updated !');
  });
  it('should disable save button if form is invalid', () => {
    const session = {
      name: '',
      date: '',
      teacher_id: '',
      description: '',
    };

    component.sessionForm?.setValue(session);
    component.sessionForm?.markAllAsTouched();
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton.disabled).toBe(true);
  });

  it('should populate teacher select options', () => {
    const teachers = [
      {
        id: faker.number.int(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      },
    ];

    const teacherServiceSpy = jest
      .spyOn(component['teacherService'], 'all')
      .mockReturnValue(of(teachers));

    component.ngOnInit();
    fixture.detectChanges();

    component.teachers$.subscribe((result) => {
      expect(teacherServiceSpy).toHaveBeenCalled();
      expect(result).toEqual(teachers);
    });
  });

  it('should navigate back on cancel button click', () => {
    const navigateSpy = jest.spyOn(component['router'], 'navigate');
    component['router'].navigate(['/sessions']);
    fixture.detectChanges();
    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  });
});
