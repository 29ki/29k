import v5, {V5State, V5UserState} from './v5';

afterEach(jest.clearAllMocks);

describe('v5', () => {
  it('should migrate reminderNotifications to sessionReminderNotifications', async () => {
    const state = {
      someOtherState: 'foo',
      userState: {
        'some-uid': {
          reminderNotifications: true,
        } as V5UserState,
        'some-other-uid': {
          reminderNotifications: false,
        } as V5UserState,
        'some-third-uid': {} as V5UserState,
      },
    };

    const newState = await v5(state);
    expect(newState).toEqual({
      someOtherState: 'foo',
      userState: {
        'some-uid': {
          sessionReminderNotifications: true,
        },
        'some-other-uid': {
          sessionReminderNotifications: false,
        },
        'some-third-uid': {},
      },
    });
  });

  it('should return state as is if reminderNotifications is not present', async () => {
    const state = {
      someOtherState: 'foo',
      userState: {
        'some-uid': {someProp: 'test'},
      },
    } as V5State;

    const unchangedState = await v5(state);

    expect(unchangedState).toEqual(state);
  });
});
