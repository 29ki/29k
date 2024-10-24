export {};

declare global {
  interface Navigator {
    getAutoplayPolicy?: (
      element: HTMLMediaElement,
    ) => 'allowed' | 'allowed-muted' | 'disallowed';
  }
}
