// Added to fix issues with types not being passed down properly from .attrs in styled-components
// https://github.com/styled-components/styled-components/issues/4076
type Optional<T, K extends keyof T> = Omit<T, K> & {[P in K]?: T[P]};
