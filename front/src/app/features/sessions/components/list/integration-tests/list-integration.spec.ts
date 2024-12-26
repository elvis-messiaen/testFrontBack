import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SessionService } from 'src/app/services/session.service';
import { of } from 'rxjs';
import { ListComponent } from '../list.component';
import { SessionApiService } from '../../../services/session-api.service';
import { Session } from '../../../interfaces/session.interface';

describe('ListComponent Integration', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
    },
  };

  const mockSessions: Session[] = [
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
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        {
          provide: SessionApiService,
          useValue: { all: () => of(mockSessions) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct number of sessions', () => {
    const sessionElements = fixture.nativeElement.querySelectorAll('.item');
    expect(sessionElements.length).toBe(2);
    expect(
      sessionElements[0].querySelector('mat-card-title').textContent
    ).toContain(mockSessions[0].name);
    expect(
      sessionElements[1].querySelector('mat-card-title').textContent
    ).toContain(mockSessions[1].name);
  });

  it('should display the "Create" button if the user is admin', () => {
    const createButton = fixture.nativeElement.querySelector(
      'button[routerLink="create"]'
    );
    expect(createButton).toBeTruthy();
  });

  it('should display the "Detail" button for each session', () => {
    const detailButtons = fixture.nativeElement.querySelectorAll(
      'button[routerLink^="detail"]'
    );
    detailButtons.forEach((button: HTMLElement, index: number) => {
      expect(button.textContent).toContain('Detail');
    });
  });

  it('should display the "Edit" button for each session if the user is admin', () => {
    const editButtons = fixture.nativeElement.querySelectorAll(
      'button[routerLink^="update"]'
    );
    editButtons.forEach((button: HTMLElement, index: number) => {
      expect(button.textContent).toContain('Edit');
    });
  });
});
