/// <reference types="jest" />

import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    service = new SessionService();
  });

  it('should call logIn method and update session', () => {
    const user: SessionInformation = {
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'username',
      firstName: 'First',
      lastName: 'Last',
      admin: true,
    };

    const spy = jest.spyOn(service, 'logIn');

    service.logIn(user);

    expect(spy).toHaveBeenCalledWith(user);
    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(user);
  });

  it('should call logOut method and reset session', () => {
    const spy = jest.spyOn(service, 'logOut');

    service.logOut();

    expect(spy).toHaveBeenCalled();
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should emit correct login state', (done) => {
    const user: SessionInformation = {
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'username',
      firstName: 'First',
      lastName: 'Last',
      admin: true,
    };

    service.$isLogged().subscribe((isLogged) => {
      if (isLogged) {
        expect(service.isLogged).toBe(true);
        done();
      }
    });

    service.logIn(user);
  });

  it('should emit correct logout state', async () => {
    let isLogged: boolean | undefined;

    const subscription = service.$isLogged().subscribe((state) => {
      isLogged = state;
    });

    service.logOut();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(isLogged).toBe(false);
    subscription.unsubscribe();
  });
});
