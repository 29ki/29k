import Koa from 'koa';
import * as yup from 'yup';

type Validate = yup.Schema<unknown>['validate'];

type Validator = {
  body: {validate: Validate};
  query: {validate: Validate};
  params: {validate: Validate};
  headers: {validate: Validate};
  response: {validate: Validate};
};

type BaseSchema = yup.Schema;
type DefaultSchema = yup.AnySchema<unknown, unknown, unknown, ''>;

type Validated<
  TBody extends BaseSchema = DefaultSchema,
  TQuery extends BaseSchema = DefaultSchema,
  TParams extends BaseSchema = DefaultSchema,
  THead extends BaseSchema = DefaultSchema,
  TResponse extends BaseSchema = DefaultSchema,
> = {
  body: yup.Asserts<TBody>;
  headers: yup.Asserts<THead>;
  query: yup.Asserts<TQuery>;
  params: yup.Asserts<TParams>;
  response: yup.Asserts<TResponse>;
};

type RequestValidationErrors = {
  body: yup.ValidationError;
  headers: yup.ValidationError;
  query: yup.ValidationError;
  params: yup.ValidationError;
};

interface ValidatedState<
  TBody extends BaseSchema = DefaultSchema,
  TQuery extends BaseSchema = DefaultSchema,
  TParams extends BaseSchema = DefaultSchema,
  THead extends BaseSchema = DefaultSchema,
  TResponse extends BaseSchema = DefaultSchema,
> extends Koa.DefaultState {
  validated: Validated<TBody, TQuery, TParams, THead, TResponse>;
}

type ValidationErrors = {
  [K in keyof Partial<Validator>]: yup.ValidationError;
};

class RequestValidationError extends Error {
  constructor(message: string, validationErrors: ValidationErrors) {
    super(message);
    this.validationErrors = validationErrors;
  }

  validationErrors: ValidationErrors;
}

class ResponseValidationError extends Error {
  constructor(message: string, validationError: yup.ValidationError) {
    super(message);
    this.validationError = validationError;
  }

  validationError: yup.ValidationError;
}

interface ValidationOptions {
  partial?: boolean;
  yup?: yup.ValidateOptions;
}

type ValidatorOptions = {
  [k in keyof Partial<Validator>]: ValidationOptions;
};

const defaultOptions: ValidatorOptions = {
  body: {
    yup: {
      stripUnknown: false,
    },
  },
  headers: {
    yup: {
      stripUnknown: false,
    },
  },
  query: {
    yup: {
      stripUnknown: false,
    },
  },
  params: {
    yup: {
      stripUnknown: false,
    },
  },
  response: {
    yup: {
      stripUnknown: false,
    },
  },
};

export default function createValidationMiddleware<
  TBody extends BaseSchema,
  TQuery extends BaseSchema,
  TParams extends BaseSchema,
  THead extends BaseSchema,
  TResponse extends BaseSchema,
>(
  validators: Partial<Validator>,
  options: ValidatorOptions = defaultOptions,
): Koa.Middleware<ValidatedState<TBody, TQuery, TParams, THead, TResponse>> {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    const results: Partial<
      Validated<TBody, TQuery, TParams, THead, TResponse>
    > = {};
    const requestValidationErrors: Partial<RequestValidationErrors> = {};
    let responseValidationError: yup.ValidationError | null = null;
    const tryValidate = async (
      validate: () => Promise<void>,
      onError: (e: yup.ValidationError) => void,
    ) => {
      try {
        await validate();
      } catch (e) {
        if (e instanceof yup.ValidationError) {
          onError(e);
        } else {
          throw e;
        }
      }
    };

    await tryValidate(
      async () => {
        if (validators.body) {
          results.body = await validators.body.validate.bind(validators.body)(
            ctx.request.body,
            options.body?.yup,
          );
        }
      },
      e => {
        requestValidationErrors.body = e;
      },
    );

    await tryValidate(
      async () => {
        if (validators.headers) {
          results.headers = await validators.headers.validate.bind(
            validators.headers,
          )(ctx.request.headers, options.headers?.yup);
        }
      },
      e => {
        requestValidationErrors.headers = e;
      },
    );

    await tryValidate(
      async () => {
        if (validators.params) {
          results.params = await validators.params.validate.bind(
            validators.params,
          )(ctx.URL.searchParams, options.params?.yup);
        }
      },
      e => {
        requestValidationErrors.params = e;
      },
    );

    await tryValidate(
      async () => {
        if (validators.query) {
          results.query = await validators.query.validate.bind(
            validators.query,
          )(ctx.request.query, options.query?.yup);
        }
      },
      e => {
        requestValidationErrors.query = e;
      },
    );

    if (Object.keys(requestValidationErrors).length > 0) {
      throw new RequestValidationError(
        'Request validation failed',
        requestValidationErrors,
      );
    }
    Object.assign(ctx.request, results);
    ctx.state.validated = results;
    await next();

    await tryValidate(
      async () => {
        if (validators.response) {
          const validator = validators.response.validate.bind(
            validators.response,
          );
          if (Array.isArray(ctx.body)) {
            results.response = await Promise.all(
              ctx.body.map(b => validator(b, options.response?.yup)),
            );
          } else {
            results.response = await validator(ctx.body, options.response?.yup);
          }
        }
      },
      e => {
        responseValidationError = e;
      },
    );

    if (responseValidationError) {
      throw new ResponseValidationError(
        'Response validation failed',
        responseValidationError,
      );
    }

    if (results.response) {
      ctx.body = results.response;
      ctx.state.validated = ctx.state.validated
        ? {...ctx.state.validated, response: results.response}
        : {response: results.response};
    }
  };
}
