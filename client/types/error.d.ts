interface ErrorConstructor {
  new (message?: string, options?: {cause?: unknown}): Error;
  (message?: string): Error;
  readonly prototype: Error;
}

declare var Error: ErrorConstructor;
