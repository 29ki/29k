import {getCorrelationId, init} from '.';
import * as Sentry from '@sentry/react-native';

describe('init', () => {
  it('initializes Sentry', () => {
    init();

    expect(Sentry.init).toHaveBeenCalledWith({
      dist: 'dev',
      dsn: 'some-sentry-dsn',
      environment: 'dev',
      release: 'some-git-hash',
    });
  });
});

describe('getCorrelationId', () => {
  it('generates and sets a correlationId on the current Sentry scope', () => {
    const correlationId = getCorrelationId();

    Sentry.configureScope(scope => {
      expect(scope.setTag).toHaveBeenCalledWith(
        'correlation_id',
        correlationId,
      );
    });
  });
});
