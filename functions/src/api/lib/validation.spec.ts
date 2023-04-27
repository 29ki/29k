import Koa from 'koa';
import * as yup from 'yup';

import validation, {
  assertValidatedResponse,
  RequestValidationError,
  ResponseContext,
  ResponseValidationError,
  ValidatedContext,
  ValidatedState,
} from './validation';

const mockSchema = yup.object({name: yup.string().required()});

describe('validation', () => {
  describe('validator', () => {
    describe('request body', () => {
      it('should validate request body', async () => {
        const middleware = validation({
          body: mockSchema,
        });
        const ctx = {
          request: {
            body: {
              name: 'value',
              unknown: 'unkown',
            },
          },
          state: {},
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<typeof mockSchema>
        >;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.request.body).toEqual({name: 'value'});
      });

      it('should validate request body and keep unknown', async () => {
        const middleware = validation(
          {
            body: mockSchema,
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
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<typeof mockSchema>
        >;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.request.body).toEqual({name: 'value', unknown: 'unkown'});
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
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<typeof mockSchema>
        >;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.request.body).toEqual({name: 'value', unknown: 'unkown'});
      });

      it('should throw if body validation fails', async () => {
        const middleware = validation({
          body: mockSchema,
        });
        const ctx = {
          request: {
            body: {
              unknown: 'unkown',
            },
          },
          state: {},
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<typeof mockSchema>
        >;
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
          query: mockSchema,
        });
        const ctx = {
          request: {
            query: {
              name: 'value',
              unknown: 'unkown',
            },
          },
          state: {},
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<typeof mockSchema, typeof mockSchema>
        >;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.request.query).toEqual({name: 'value'});
      });

      it('should validate request query and keep unknown', async () => {
        const middleware = validation(
          {
            query: mockSchema,
          },
          {query: {stripUnknown: false}},
        );
        const ctx = {
          request: {
            query: {
              name: 'value',
              unknown: 'unkown',
            },
          },
          state: {},
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<typeof mockSchema, typeof mockSchema>
        >;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.request.query).toEqual({name: 'value', unknown: 'unkown'});
      });

      it('should not validate query if no validation set', async () => {
        const middleware = validation({});
        const ctx = {
          request: {
            query: {
              name: 'value',
              unknown: 'unkown',
            },
          },
          state: {},
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<typeof mockSchema, typeof mockSchema>
        >;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.state.responseValidated).toBe(undefined);
      });

      it('should throw if query validation fails', async () => {
        const middleware = validation({
          query: mockSchema,
        });
        const ctx = {
          request: {
            query: {
              unknown: 'unkown',
            } as unknown,
          },
          state: {},
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<typeof mockSchema, typeof mockSchema>
        >;
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
          response: mockSchema,
        });
        const ctx = {
          body: {
            name: 'value',
            unknown: 'unkown',
          },
          state: {},
          status: 200,
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<
            typeof mockSchema,
            typeof mockSchema,
            typeof mockSchema
          >
        >;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.body).toEqual({name: 'value'});
        expect(ctx.state.responseValidated).toBe(true);
      });

      it('should validate response body and keep unknown', async () => {
        const middleware = validation(
          {
            response: mockSchema,
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
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<
            typeof mockSchema,
            typeof mockSchema,
            typeof mockSchema
          >
        >;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.body).toEqual({name: 'value', unknown: 'unkown'});
        expect(ctx.state.responseValidated).toBe(true);
      });

      it('should validate response body only if status is 200', async () => {
        const middleware = validation({
          response: mockSchema,
        });
        const ctx = {
          body: {
            name: 'value',
            unknown: 'unkown',
          },
          state: {},
          status: 401,
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<
            typeof mockSchema,
            typeof mockSchema,
            typeof mockSchema
          >
        >;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.body).toEqual({
          name: 'value',
          unknown: 'unkown',
        });
      });

      it('should validate response body only if context has body', async () => {
        const middleware = validation({
          response: yup.object({name: yup.string().required()}),
        });
        const ctx = {
          body: {},
          state: {},
          status: 200,
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<
            typeof mockSchema,
            typeof mockSchema,
            typeof mockSchema
          >
        >;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.body).toEqual({});
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
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<
            typeof mockSchema,
            typeof mockSchema,
            typeof mockSchema
          >
        >;
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

  describe('assertValidatedResponse', () => {
    it('should move to next response body was validated', async () => {
      const middleware = assertValidatedResponse();
      const ctx = {
        body: {
          value: 'value',
        },
        state: {
          responseValidated: true,
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
