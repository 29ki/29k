// credits goes to https://stackoverflow.com/a/50375286
// function intersection producec - functin overloads
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type Values<T> = T[keyof T];
