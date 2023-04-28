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

const mockSchema = yup.object({age: yup.number().required()});

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
              age: '50',
              unknown: 'unknown',
            },
          },
          state: {},
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<typeof mockSchema>
        >;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.request.body).toEqual({age: 50});
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
              age: '50',
              unknown: 'unknown',
            },
          },
          state: {},
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<typeof mockSchema>
        >;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.request.body).toEqual({age: 50, unknown: 'unknown'});
      });

      it('should not validate body if no validation set', async () => {
        const middleware = validation({});
        const ctx = {
          request: {
            body: {
              age: '50',
              unknown: 'unknown',
            },
          },
          state: {},
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<typeof mockSchema>
        >;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.request.body).toEqual({age: '50', unknown: 'unknown'});
      });

      it('should throw if body validation fails', async () => {
        const middleware = validation({
          body: mockSchema,
        });
        const ctx = {
          request: {
            body: {
              unknown: 'unknown',
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
            'age is a required field',
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
              age: '50',
              unknown: 'unknown',
            },
          },
          state: {},
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<typeof mockSchema, typeof mockSchema>
        >;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.request.query).toEqual({age: 50});
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
              age: '50',
              unknown: 'unknown',
            },
          },
          state: {},
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<typeof mockSchema, typeof mockSchema>
        >;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.request.query).toEqual({age: 50, unknown: 'unknown'});
      });

      it('should not validate query if no validation set', async () => {
        const middleware = validation({});
        const ctx = {
          request: {
            query: {
              age: '50',
              unknown: 'unknown',
            },
          },
          state: {},
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<typeof mockSchema, typeof mockSchema>
        >;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.request.query).toEqual({
          age: '50',
          unknown: 'unknown',
        });
      });

      it('should throw if query validation fails', async () => {
        const middleware = validation({
          query: mockSchema,
        });
        const ctx = {
          request: {
            query: {
              unknown: 'unknown',
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
            'age is a required field',
          );
        }
      });
    });

    describe('request params', () => {
      it('should validate params', async () => {
        const middleware = validation({
          params: mockSchema,
        });
        const ctx = {
          params: {
            age: '50',
            unknown: 'unknown',
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

        await middleware(ctx, next);

        expect(ctx.params).toEqual({age: 50});
      });

      it('should validate params that are not strings', async () => {
        const middleware = validation({
          params: mockSchema,
        });
        const ctx = {
          params: {
            age: '50',
            unknown: 'unknown',
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

        await middleware(ctx, next);

        expect(ctx.params).toEqual({age: 50});
      });

      it('should validate params and keep unknowns', async () => {
        const middleware = validation(
          {
            params: mockSchema,
          },
          {params: {stripUnknown: false}},
        );
        const ctx = {
          params: {
            age: '50',
            unknown: 'unknown',
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

        await middleware(ctx, next);

        expect(ctx.params).toEqual({age: 50, unknown: 'unknown'});
      });

      it('should not validate params if no validation set', async () => {
        const middleware = validation({});
        const ctx = {
          params: {
            age: '50',
            unknown: 'unknown',
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

        await middleware(ctx, next);

        expect(ctx.params).toEqual({age: '50', unknown: 'unknown'});
      });

      it('should throw if params validation fails', async () => {
        const middleware = validation({
          params: mockSchema,
        });
        const ctx = {
          params: {
            unknown: 'unknown',
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
          const error = e as RequestValidationError;
          expect(error.validationError.message).toEqual(
            'age is a required field',
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
            age: '50',
            unknown: 'unknown',
          },
          state: {},
          status: 200,
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<
            typeof mockSchema,
            typeof mockSchema,
            typeof mockSchema,
            typeof mockSchema
          >
        >;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.body).toEqual({age: 50});
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
            age: '50',
            unknown: 'unknown',
          },
          state: {},
          status: 200,
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<
            typeof mockSchema,
            typeof mockSchema,
            typeof mockSchema,
            typeof mockSchema
          >
        >;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.body).toEqual({age: 50, unknown: 'unknown'});
        expect(ctx.state.responseValidated).toBe(true);
      });

      it('should validate response body only if status is 200', async () => {
        const middleware = validation({
          response: mockSchema,
        });
        const ctx = {
          body: {
            age: '50',
            unknown: 'unknown',
          },
          state: {},
          status: 401,
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<
            typeof mockSchema,
            typeof mockSchema,
            typeof mockSchema,
            typeof mockSchema
          >
        >;
        const next = jest.fn();

        await middleware(ctx, next);

        expect(ctx.body).toEqual({
          age: '50',
          unknown: 'unknown',
        });
      });

      it('should validate response body only if context has body', async () => {
        const middleware = validation({
          response: mockSchema,
        });
        const ctx = {
          body: {},
          params: {},
          state: {},
          status: 200,
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<
            typeof mockSchema,
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
          response: mockSchema,
        });
        const ctx = {
          body: {
            unknown: 'unknown',
          },
          state: {},
        } as unknown as Koa.ParameterizedContext<
          ValidatedState,
          ValidatedContext<
            typeof mockSchema,
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
