import {createContext} from 'react';

export type ActionConfig = {
  text: string;
  action: () => void;
};

export type ErrorBannerContextProps = {
  showError: (
    header: string,
    message: string,
    options?: {
      actionConfig?: ActionConfig;
      disableAutoClose?: boolean;
    },
  ) => void;
};

export const ErrorBannerContext = createContext<
  ErrorBannerContextProps | undefined
>(undefined);
