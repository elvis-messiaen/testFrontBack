import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TeacherService } from './teacher.service';
import { Teacher } from '../interfaces/teacher.interface';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeacherService],
    });

    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all teachers', () => {
    const mockTeachers: Teacher[] = [
      {
        id: 1,
        lastName: 'LastNameTeacherOne',
        firstName: 'FirstNameTeacherOne',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        lastName: 'LastNameTeacherTwo',
        firstName: 'FirstNameTeacherTwo',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    service.all().subscribe((teachers) => {
      expect(teachers.length).toBe(2);
      expect(teachers).toEqual(mockTeachers);
    });

    const req = httpMock.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');
    req.flush(mockTeachers);
  });

  it('should fetch teacher details', () => {
    const mockTeacher: Teacher = {
      id: 1,
      lastName: 'LastNameTeacherOne',
      firstName: 'FirstNameTeacherOne',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    service.detail('1').subscribe((teacher) => {
      expect(teacher).toEqual(mockTeacher);
    });

    const req = httpMock.expectOne('api/teacher/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTeacher);
  });

  it('should handle error when fetching all teachers', () => {
    service.all().subscribe(
      () => {},
      (error) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpMock.expectOne('api/teacher');
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle error when fetching teacher details', () => {
    service.detail('1').subscribe(
      () => {},
      (error) => {
        expect(error.status).toBe(404);
      }
    );

    const req = httpMock.expectOne('api/teacher/1');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});
