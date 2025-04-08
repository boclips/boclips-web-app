import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { PendoService } from 'src/services/analytics/pendo/PendoService';
import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

describe('Pendo Service', () => {
  it('passes essential user data to pendo', () => {
    const user = UserFactory.sample({
      id: 'user-id',
      email: 'user@monday.com',
      firstName: 'M',
      lastName: 'J',
      jobTitle: 'barista',
      audiences: ['caffeine addicts'],
      desiredContent: 'books&coffee',
      account: {
        ...UserFactory.sample().account,
        id: 'account-id',
        name: 'account name',
        marketingInformation: {
          companySegments: ['Publisher'],
        },
        type: AccountType.STANDARD,
        products: [Product.CLASSROOM],
      },
    });

    const initializeSpy = jest.fn();
    const service = new PendoService({
      ...window.pendo,
      initialize: initializeSpy,
    });

    service.identify(user);

    expect(initializeSpy).lastCalledWith({
      visitor: {
        id: 'user-id',
        email: 'user@monday.com',
        full_name: 'M J',
        role: 'barista',
        content: 'books&coffee',
        audiences: ['caffeine addicts'],
      },
      account: {
        id: 'account-id',
        name: 'account name',
        type: ['Publisher'],
        product: [Product.CLASSROOM],
      },
    });
  });

  it('uses n/a when there is no account id defined', () => {
    let user = UserFactory.sample({
      id: 'user-id',
      email: 'user@monday.com',
      firstName: 'M',
      lastName: 'J',
      jobTitle: undefined,
      audiences: undefined,
      desiredContent: undefined,
    });
    user = { ...user, account: null };

    const initializeSpy = jest.fn();
    const service = new PendoService({
      ...window.pendo,
      initialize: initializeSpy,
    });

    service.identify(user);

    expect(initializeSpy).lastCalledWith({
      visitor: {
        id: 'user-id',
        email: 'user@monday.com',
        full_name: 'M J',
        role: '',
        content: '',
        audiences: [],
      },
      account: {
        id: 'n/a',
        name: 'n/a',
        type: [],
        product: [],
      },
    });
  });

  it('tracks classroom account creation failure', () => {
    const trackSpy = jest.fn();
    const service = new PendoService({
      ...window.pendo,
      isReady(): boolean {
        return true;
      },
      track: trackSpy,
    });

    service.trackClassroomAccountCreationFailure(
      'email@gmail.com',
      'High School Musical',
      'error message is here',
    );

    expect(trackSpy).lastCalledWith('Classroom Registration Failure', {
      email: 'email@gmail.com',
      schoolName: 'High School Musical',
      errorMessage: 'error message is here',
    });
  });

  it('tracks classroom district account creation failure', () => {
    const trackSpy = jest.fn();
    const service = new PendoService({
      ...window.pendo,
      isReady(): boolean {
        return true;
      },
      track: trackSpy,
    });

    service.trackClassroomDistrictAccountCreationFailure(
      'email@gmail.com',
      'District Musical',
      'error message is here',
    );

    expect(trackSpy).lastCalledWith('Classroom District Registration Failure', {
      email: 'email@gmail.com',
      districtName: 'District Musical',
      errorMessage: 'error message is here',
    });
  });

  it('tracks assistant entry point usage', () => {
    const trackSpy = jest.fn();
    const service = new PendoService({
      ...window.pendo,
      isReady(): boolean {
        return true;
      },
      track: trackSpy,
    });

    service.trackAssistantEntryPointUsed('coolSecretLink');

    expect(trackSpy).lastCalledWith('Assistant Entry Point Used', {
      entryPoint: 'coolSecretLink',
    });
  });

  it('tracks assistant suggestion clicks', () => {
    const trackSpy = jest.fn();
    const service = new PendoService({
      ...window.pendo,
      isReady(): boolean {
        return true;
      },
      track: trackSpy,
    });

    service.trackAssistantSuggestionClicked('What are tariffs?');

    expect(trackSpy).lastCalledWith('Assistant Suggestion Clicked', {
      suggestion: 'What are tariffs?',
    });
  });

  it('tracks assistant video navigation from highlight', () => {
    const trackSpy = jest.fn();
    const service = new PendoService({
      ...window.pendo,
      isReady(): boolean {
        return true;
      },
      track: trackSpy,
    });

    service.trackAssistantVideoNavigatedTo('clip-id', 'video-id');

    expect(trackSpy).lastCalledWith('Assistant Video Navigated To', {
      clipId: 'clip-id',
      videoId: 'video-id',
    });
  });
});
