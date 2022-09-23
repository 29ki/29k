import React, {useState, createContext, useContext} from 'react';

interface UILibContextInterface {
  enabled: Boolean;
  toggle: () => void;
}

const uiLibState = createContext<UILibContextInterface>({
  enabled: false,
  toggle: () => undefined,
});

const UiLibProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [UILibEnabled, setUILibEnabled] = useState(false);

  let UILib: React.ComponentType | null = null;

  if (UILibEnabled) {
    UILib = require('../components/UiLibRootComponent').default;
  }

  const toggle = () => setUILibEnabled(!UILibEnabled);

  return (
    <uiLibState.Provider
      value={{
        toggle,
        enabled: UILibEnabled,
      }}>
      {UILibEnabled && UILib ? <UILib /> : <>{children}</>}
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
