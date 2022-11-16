export type Events = {
  'Submit Sign-in': {
    foo: string;
  };
  'Add to Calendar': undefined;
};

export type UserProperties = {
  isAnonymous: boolean;
  foo: string;
};

export type CoreProperties = {
  bar: 'baz';
};
