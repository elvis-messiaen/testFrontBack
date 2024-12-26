import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';
import { faker } from '@faker-js/faker';

describe('SessionApiService', () => {
  let service: SessionApiService;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    service = new SessionApiService(httpClientMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of sessions', (done) => {
    const mockSessions: Session[] = [
      {
        id: faker.number.int(),
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        date: faker.date.future(),
        teacher_id: faker.number.int(),
        users: [faker.number.int(), faker.number.int()],
      },
      {
        id: faker.number.int(),
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        date: faker.date.future(),
        teacher_id: faker.number.int(),
        users: [faker.number.int()],
      },
    ];

    httpClientMock.get.mockReturnValue(of(mockSessions));

    service.all().subscribe((sessions) => {
      expect(sessions).toEqual(mockSessions);
      expect(httpClientMock.get).toHaveBeenCalledWith('api/session');
      done();
    });
  });

  it('should return session details', (done) => {
    const mockSession: Session = {
      id: faker.number.int(),
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      date: faker.date.future(),
      teacher_id: faker.number.int(),
      users: [faker.number.int()],
    };

    httpClientMock.get.mockReturnValue(of(mockSession));

    service.detail('1').subscribe((session) => {
      expect(session).toEqual(mockSession);
      expect(httpClientMock.get).toHaveBeenCalledWith('api/session/1');
      done();
    });
  });

  it('should create a session', (done) => {
    const mockSession: Session = {
      id: faker.number.int(),
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      date: faker.date.future(),
      teacher_id: faker.number.int(),
      users: [faker.number.int()],
    };

    httpClientMock.post.mockReturnValue(of(mockSession));

    service.create(mockSession).subscribe((session) => {
      expect(session).toEqual(mockSession);
      expect(httpClientMock.post).toHaveBeenCalledWith('api/session', mockSession);
      done();
    });
  });

  it('should delete a session', (done) => {
    httpClientMock.delete.mockReturnValue(of(null));

    service.delete('1').subscribe((response) => {
      expect(response).toBeNull();
      expect(httpClientMock.delete).toHaveBeenCalledWith('api/session/1');
      done();
    });
  });

  it('should participate in a session', (done) => {
    httpClientMock.post.mockReturnValue(of(null));

    service.participate('1', '1').subscribe((response) => {
      expect(response).toBeNull();
      expect(httpClientMock.post).toHaveBeenCalledWith('api/session/1/participate/1', null);
      done();
    });
  });

  it('should unparticipate from a session', (done) => {
    httpClientMock.delete.mockReturnValue(of(null));

    service.unParticipate('1', '1').subscribe((response) => {
      expect(response).toBeNull();
      expect(httpClientMock.delete).toHaveBeenCalledWith('api/session/1/participate/1');
      done();
    });
  });
});
