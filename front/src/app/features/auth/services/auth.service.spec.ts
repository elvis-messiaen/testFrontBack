import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { faker } from '@faker-js/faker';

describe('AuthService', () => {
  let service: AuthService;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClientMock = {
      post: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    service = new AuthService(httpClientMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', (done) => {
    const mockRegisterRequest: RegisterRequest = {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password(),
    };

    httpClientMock.post.mockReturnValue(of(undefined));

    service.register(mockRegisterRequest).subscribe(() => {
      expect(httpClientMock.post).toHaveBeenCalledWith('api/auth/register', mockRegisterRequest);
      done();
    });
  });

  it('should login a user', (done) => {
    const mockLoginRequest: LoginRequest = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const mockSessionInformation: SessionInformation = {
      token: faker.string.uuid(),
      type: 'Bearer',
      id: faker.number.int(),
      username: faker.internet.userName(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      admin: faker.datatype.boolean(),
    };

    httpClientMock.post.mockReturnValue(of(mockSessionInformation));

    service.login(mockLoginRequest).subscribe((sessionInfo) => {
      expect(sessionInfo).toEqual(mockSessionInformation);
      expect(httpClientMock.post).toHaveBeenCalledWith('api/auth/login', mockLoginRequest);
      done();
    });
  });
});
