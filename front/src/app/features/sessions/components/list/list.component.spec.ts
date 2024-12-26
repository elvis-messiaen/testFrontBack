import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { faker } from '@faker-js/faker';
import { ListComponent } from './list.component';
import { Observable, of } from 'rxjs';
import { SessionApiService } from '../../services/session-api.service';
import { Session } from '../../interfaces/session.interface';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule],
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the Create button if the user is an admin', () => {
    const createButton = fixture.nativeElement.querySelector(
      'button[routerLink="create"]'
    );
    expect(createButton).toBeTruthy();
    expect(createButton.textContent).toContain('Create');
  });
  it('should display the Detail button for each session', () => {
    const sessions = [
      {
        id: faker.number.int(),
        name: faker.company.name(),
        date: faker.date.future(),
        description: faker.lorem.sentence(),
        teacher_id: faker.number.int(),
        users: [],
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      },
      {
        id: faker.number.int(),
        name: faker.company.name(),
        date: faker.date.future(),
        description: faker.lorem.sentence(),
        teacher_id: faker.number.int(),
        users: [],
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      },
    ];

    component.sessions$ = of(sessions);
    fixture.detectChanges();

    const detailButtons = fixture.nativeElement.querySelectorAll(
      'button[routerLink^="detail"]'
    );
    detailButtons.forEach((button: HTMLElement) => {
      expect(button.textContent).toContain('Detail');
    });
  });

  it('should display the Edit button for each session if the user is an admin', () => {
    const sessions = [
      {
        id: faker.number.int(),
        name: faker.company.name(),
        date: faker.date.future(),
        description: faker.lorem.sentence(),
        teacher_id: faker.number.int(),
        users: [],
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      },
      {
        id: faker.number.int(),
        name: faker.company.name(),
        date: faker.date.future(),
        description: faker.lorem.sentence(),
        teacher_id: faker.number.int(),
        users: [],
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      },
    ];

    component.sessions$ = of(sessions);
    fixture.detectChanges();

    const editButtons = fixture.nativeElement.querySelectorAll(
      'button[routerLink^="update"]'
    );
    editButtons.forEach((button: HTMLElement) => {
      expect(button.textContent).toContain('Edit');
    });
  });

  it('should display the list of sessions', () => {
    const sessions = [
      {
        id: faker.number.int(),
        name: faker.company.name(),
        date: faker.date.future(),
        description: faker.lorem.sentence(),
        teacher_id: faker.number.int(),
        users: [],
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      },
      {
        id: faker.number.int(),
        name: faker.company.name(),
        date: faker.date.future(),
        description: faker.lorem.sentence(),
        teacher_id: faker.number.int(),
        users: [],
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      },
    ];

    component.sessions$ = of(sessions);
    fixture.detectChanges();

    const sessionElements = fixture.nativeElement.querySelectorAll('.item');
    expect(sessionElements.length).toBe(2);
    expect(
      sessionElements[0].querySelector('mat-card-title').textContent
    ).toContain(sessions[0].name);
    expect(
      sessionElements[1].querySelector('mat-card-title').textContent
    ).toContain(sessions[1].name);
  });
});

describe("ListComponent tests d'intégrations", () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let sessionApiService: SessionApiService;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
    },
  };

  const mockSessions = [
    {
      id: 1,
      name: 'Session 1',
      description: 'Description of session 1',
      date: new Date(),
      teacher_id: 1,
      users: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Session 2',
      description: 'Description of session 2',
      date: new Date(),
      teacher_id: 2,
      users: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule],
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    sessionApiService = TestBed.inject(SessionApiService);
    fixture.detectChanges();
  });
  it('should display the correct number of sessions', () => {
    component.sessions$.subscribe((sessions) => {
      fixture.detectChanges();
      const sessionCards = fixture.nativeElement.querySelectorAll('.item');
      expect(sessionCards.length).toBe(sessions.length);
    });

    jest.spyOn(sessionApiService, 'all').mockReturnValue(of(mockSessions));

    fixture.detectChanges();
  });

  it('should call sessionApiService.all during initialization', () => {
    const spy = jest
      .spyOn(sessionApiService, 'all')
      .mockReturnValue(of(mockSessions));

    component.sessions$.subscribe(() => {
      expect(spy).toHaveBeenCalled();
    });

    fixture.detectChanges();
  });

  it('should show the "Create" button if user is admin', () => {
    const createButton = fixture.nativeElement.querySelector(
      'button[routerLink="create"]'
    );
    expect(createButton).toBeTruthy();
  });
});
