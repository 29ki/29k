import {createContext} from 'react';

export type ActionConfig = {
  text: string;
  action: () => void;
};

export type ErrorBannerContextProps = {
  showError: (
    header: string,
    message: string,
    actionConfig?: ActionConfig,
  ) => void;
};

export const ErrorBannerContext = createContext<
  ErrorBannerContextProps | undefined
>(undefined);
