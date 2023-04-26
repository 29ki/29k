import Koa from 'koa';
import * as yup from 'yup';

import validation, {
  assertValidatedRequest,
  assertValidatedResponse,
  RequestValidationError,
  ResponseContext,
  ResponseValidationError,
} from './validation';

describe('validation', () => {
  describe('validator', () => {
    describe('request body', () => {
      it('should validate request body', async () => {
        const middleware = validation({
          body: yup.object({name: yup.string().required()}),
        });
        const ctx = {
          request: {
            body: {
              name: 'value',
              unknown: 'unkown',
            },
          },
          state: {},
        } as Koa.Context;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.state.body).toEqual({name: 'value'});
      });

      it('should validate request body and keep unknown', async () => {
        const middleware = validation(
          {
            body: yup.object({name: yup.string().required()}),
          },
          {body: {stripUnknown: false}},
        );
        const ctx = {
          request: {
            body: {
              name: 'value',
              unknown: 'unkown',
            },
          },
          state: {},
        } as Koa.Context;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.state.body).toEqual({name: 'value', unknown: 'unkown'});
      });

      it('should not validate body if no validation set', async () => {
        const middleware = validation({});
        const ctx = {
          request: {
            body: {
              name: 'value',
              unknown: 'unkown',
            },
          },
          state: {},
        } as Koa.Context;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.state.body).toBe(undefined);
      });

      it('should throw if body validation fails', async () => {
        const middleware = validation({
          body: yup.object({name: yup.string().required()}),
        });
        const ctx = {
          request: {
            body: {
              unknown: 'unkown',
            },
          },
          state: {},
        } as Koa.Context;
        const next = jest.fn();

        try {
          await middleware(ctx, next);
        } catch (e) {
          const error = e as RequestValidationError;
          expect(error.validationError.message).toEqual(
            'name is a required field',
          );
        }
      });
    });

    describe('request query', () => {
      it('should validate request query', async () => {
        const middleware = validation({
          query: yup.object({name: yup.string().required()}),
        });
        const ctx = {
          request: {
            query: {
              name: 'value',
              unknown: 'unkown',
            } as unknown,
          },
          state: {},
        } as Koa.Context;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.state.query).toEqual({name: 'value'});
      });

      it('should validate request query and keep unknown', async () => {
        const middleware = validation(
          {
            query: yup.object({name: yup.string().required()}),
          },
          {query: {stripUnknown: false}},
        );
        const ctx = {
          request: {
            query: {
              name: 'value',
              unknown: 'unkown',
            } as unknown,
          },
          state: {},
        } as Koa.Context;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.state.query).toEqual({name: 'value', unknown: 'unkown'});
      });

      it('should not validate query if no validation set', async () => {
        const middleware = validation({});
        const ctx = {
          request: {
            query: {
              name: 'value',
              unknown: 'unkown',
            } as unknown,
          },
          state: {},
        } as Koa.Context;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.state.query).toBe(undefined);
      });

      it('should throw if query validation fails', async () => {
        const middleware = validation({
          query: yup.object({name: yup.string().required()}),
        });
        const ctx = {
          request: {
            query: {
              unknown: 'unkown',
            } as unknown,
          },
          state: {},
        } as Koa.Context;
        const next = jest.fn();

        try {
          await middleware(ctx, next);
        } catch (e) {
          const error = e as RequestValidationError;
          expect(error.validationError.message).toEqual(
            'name is a required field',
          );
        }
      });
    });

    describe('response body', () => {
      it('should validate response body', async () => {
        const middleware = validation({
          response: yup.object({name: yup.string().required()}),
        });
        const ctx = {
          body: {
            name: 'value',
            unknown: 'unkown',
          },
          state: {},
          status: 200,
        } as Koa.Context;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.state.response).toEqual({name: 'value'});
        expect(ctx.body).toEqual({name: 'value'});
      });

      it('should validate response body and keep unknown', async () => {
        const middleware = validation(
          {
            response: yup.object({name: yup.string().required()}),
          },
          {response: {stripUnknown: false}},
        );
        const ctx = {
          body: {
            name: 'value',
            unknown: 'unkown',
          },
          state: {},
          status: 200,
        } as Koa.Context;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.state.response).toEqual({name: 'value', unknown: 'unkown'});
        expect(ctx.body).toEqual({name: 'value', unknown: 'unkown'});
      });

      it('should validate response body array', async () => {
        const middleware = validation({
          response: yup.object({name: yup.string().required()}),
        });
        const ctx = {
          body: [
            {
              name: 'value',
              unknown: 'unkown',
            },
          ],
          state: {},
          status: 200,
        } as Koa.Context;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.state.response).toEqual([{name: 'value'}]);
        expect(ctx.body).toEqual([{name: 'value'}]);
      });

      it('should validate response body only if status is 200', async () => {
        const middleware = validation({
          response: yup.object({name: yup.string().required()}),
        });
        const ctx = {
          body: {
            name: 'value',
            unknown: 'unkown',
          },
          state: {},
          status: 401,
        } as Koa.Context;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.state.response).toBe(undefined);
      });

      it('should validate response body only if context has body', async () => {
        const middleware = validation({
          response: yup.object({name: yup.string().required()}),
        });
        const ctx = {
          body: {},
          state: {},
          status: 200,
        } as Koa.Context;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.state.response).toBe(undefined);
      });

      it('should throw if body validation fails', async () => {
        const middleware = validation({
          response: yup.object({name: yup.string().required()}),
        });
        const ctx = {
          body: {
            unknown: 'unkown',
          },
          state: {},
        } as Koa.Context;
        const next = jest.fn();

        try {
          await middleware(ctx, next);
        } catch (e) {
          const error = e as ResponseValidationError;
          expect(error.validationError.message).toEqual(
            'name is a required field',
          );
        }
      });
    });
  });

  describe('assertValidatedRequest', () => {
    it('should move to next when both body and query has been validated', async () => {
      const middleware = assertValidatedRequest();
      const ctx = {
        request: {
          query: {
            param: 'raw value',
          } as unknown,
          body: {
            value: 'raw value',
          },
        },
        state: {
          query: {
            param: 'value',
          },
          body: {
            value: 'value',
          },
        },
      } as ResponseContext;
      const next = jest.fn();

      await middleware(ctx, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should move to next when only query was set', async () => {
      const middleware = assertValidatedRequest();
      const ctx = {
        request: {
          query: {
            param: 'raw value',
          } as unknown,
          body: {},
        },
        state: {
          query: {
            param: 'value',
          },
        },
      } as ResponseContext;
      const next = jest.fn();

      await middleware(ctx, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should move to next when only body was set', async () => {
      const middleware = assertValidatedRequest();
      const ctx = {
        request: {
          body: {
            value: 'raw value',
          },
          query: {},
        },
        state: {
          body: {
            value: 'value',
          },
        },
      } as ResponseContext;
      const next = jest.fn();

      await middleware(ctx, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should throw if query was not validated', async () => {
      const middleware = assertValidatedRequest();
      const ctx = {
        request: {
          method: 'GET',
          URL: 'some-url',
          query: {
            value: 'raw value',
          },
          body: {},
        },
        state: {},
      } as unknown as ResponseContext;
      const next = jest.fn();

      try {
        await middleware(ctx, next);
      } catch (e) {
        const error = e as Error;
        expect(error).toEqual(
          new Error('No schema found for the request query to GET at some-url'),
        );
      }

      expect(next).toHaveBeenCalledTimes(0);
    });

    it('should throw if body was not validated', async () => {
      const middleware = assertValidatedRequest();
      const ctx = {
        request: {
          method: 'GET',
          URL: 'some-url',
          body: {
            value: 'raw value',
          },
          query: {},
        },
        state: {},
      } as unknown as ResponseContext;
      const next = jest.fn();

      try {
        await middleware(ctx, next);
      } catch (e) {
        const error = e as Error;
        expect(error).toEqual(
          new Error('No schema found for the request body to GET at some-url'),
        );
      }

      expect(next).toHaveBeenCalledTimes(0);
    });
  });

  describe('assertValidatedResponse', () => {
    it('should move to next response body was validated', async () => {
      const middleware = assertValidatedResponse();
      const ctx = {
        body: {
          value: 'value',
        },
        state: {
          response: {
            value: 'value',
          },
        },
        status: 200,
      } as ResponseContext;
      const next = jest.fn();

      await middleware(ctx, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should move to next if status is not 200', async () => {
      const middleware = assertValidatedResponse();
      const ctx = {
        body: {},
        state: {},
        status: 401,
      } as ResponseContext;
      const next = jest.fn();

      await middleware(ctx, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should throw after next if response was not validated', async () => {
      const middleware = assertValidatedResponse();
      const ctx = {
        request: {
          method: 'GET',
          URL: 'some-url',
        },
        body: {
          value: 'value',
        },
        state: {},
        status: 200,
      } as unknown as ResponseContext;
      const next = jest.fn();

      try {
        await middleware(ctx, next);
      } catch (error) {
        expect(error).toEqual(
          new Error('No schema found for the response to GET at some-url'),
        );
      }

      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
