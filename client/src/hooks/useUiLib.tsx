import React, {useState, createContext, useContext} from 'react';
import {CLIENT_ENVIRONMENT} from 'config';

const IS_PRODUCTION = CLIENT_ENVIRONMENT === 'production';

interface UILibContextInterface {
  enabled: Boolean;
  toggle: () => void;
}

const uiLibState = createContext<UILibContextInterface>({
  enabled: false,
  toggle: () => void 0,
});

const UiLibProvider: React.FunctionComponent<{}> = ({children}) => {
  const [UILibEnabled, setUILibEnabled] = useState(false);

  let UILib: React.ComponentType | null = null;

  if (!IS_PRODUCTION && UILibEnabled) {
    UILib = require('../uiLib/UiLibRootComponent').default;
  }

  const toggle = () => setUILibEnabled(!UILibEnabled);

  return (
    <uiLibState.Provider
      value={{
        toggle,
        enabled: UILibEnabled,
      }}>
      {UILibEnabled && UILib && !IS_PRODUCTION ? <UILib /> : <>{children}</>}
    </uiLibState.Provider>
  );
};

const useUiLib = () => {
  const context = useContext(uiLibState);
  if (context === undefined) {
    throw new Error('useUiLib must be used within a useUiLibProvider');
  }
  return context;
};

export {UiLibProvider, useUiLib};
