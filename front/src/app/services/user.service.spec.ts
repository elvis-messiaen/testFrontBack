import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { User } from '../interfaces/user.interface';
import { faker } from '@faker-js/faker';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a user by id', () => {
    const mockUser: User = {
      id: 1,
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      admin: faker.datatype.boolean(),
      password: faker.internet.password(),
      createdAt: new Date(),
    };

    service.getById(mockUser.id.toString()).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`api/user/${mockUser.id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should delete a user', () => {
    const mockUser: User = {
      id: 1,
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      admin: faker.datatype.boolean(),
      password: faker.internet.password(),
      createdAt: new Date(),
    };

    service.delete(mockUser.id.toString()).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`api/user/${mockUser.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
