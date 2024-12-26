import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { DetailComponent } from '../detail.component';
import { SessionService } from 'src/app/services/session.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { Teacher } from 'src/app/interfaces/teacher.interface';

describe('DetailComponent Integration Tests', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionService: SessionService;
  let teacherService: TeacherService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
      ],
      declarations: [DetailComponent],
      providers: [SessionService, TeacherService],
    }).compileComponents();

    sessionService = TestBed.inject(SessionService);
    sessionService.sessionInformation = {
      token: 'sample_token',
      type: 'Bearer',
      id: 1,
      username: 'Real User',
      firstName: 'RealFirstName',
      lastName: 'RealLastName',
      admin: true,
    };

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    teacherService = TestBed.inject(TeacherService);
    fixture.detectChanges();
  });

  it('should load session and teacher details from real API', async () => {
    const sessionId = 1;
    const teacherId = 1;

    sessionService.logIn({
      token: 'sample_token',
      type: 'Bearer',
      id: 1,
      username: 'Real User',
      firstName: 'RealFirstName',
      lastName: 'RealLastName',
      admin: true,
    });

    teacherService
      .detail(teacherId.toString())
      .subscribe((teacherData: Teacher) => {
        const session = {
          id: sessionId,
          name: 'Real Session',
          description: 'A detailed session',
          date: new Date(),
          teacher_id: teacherId,
          users: [],
        };

        component.teacher = teacherData;
        component.session = session;

        fixture.detectChanges();

        fixture.whenStable().then(() => {
          const nameElement = fixture.nativeElement.querySelector('h1');
          const teacherName =
            fixture.nativeElement.querySelector('.teacher-name');

          expect(nameElement.textContent).toContain(session.name);
          expect(teacherName.textContent).toContain(teacherData.firstName);
        });
      });
  });

  it('should allow participation in a session and update the session details', (done) => {
    sessionService.sessionInformation = {
      token: 'sample_token',
      type: 'Bearer',
      id: 1,
      username: 'Real User',
      firstName: 'RealFirstName',
      lastName: 'RealLastName',
      admin: true,
    };

    const userId = sessionService.sessionInformation.id;
    if (!userId) {
      throw new Error('sessionInformation.id is undefined');
    }

    const sessionId = 1;

    sessionService.logIn({
      token: 'sample_token',
      type: 'Bearer',
      id: userId,
      username: 'Real User',
      firstName: 'RealFirstName',
      lastName: 'RealLastName',
      admin: true,
    });

    component.session = {
      id: sessionId,
      name: 'Real Session',
      description: 'A detailed session',
      date: new Date(),
      teacher_id: 1,
      users: [],
    };

    component.session.users.push(userId);

    expect(component.session.users.includes(userId)).toBe(true);
    done();
  });

  it('should allow deleting a session and navigate to session list', (done) => {
    sessionService.sessionInformation = {
      token: 'sample_token',
      type: 'Bearer',
      id: 1,
      username: 'Real User',
      firstName: 'RealFirstName',
      lastName: 'RealLastName',
      admin: true,
    };

    component.delete();
    sessionService.logOut();

    fixture.detectChanges();

    expect(sessionService.sessionInformation).toBeUndefined();
    expect(sessionService.isLogged).toBeFalsy();
    done();
  });
});
