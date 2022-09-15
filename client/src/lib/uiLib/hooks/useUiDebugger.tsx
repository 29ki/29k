// src/count-context.js
import React, {createContext, useState, useEffect, useContext} from 'react';
import {DevSettings} from 'react-native';

const uiDebuggerState = createContext(false);

// Not the nicest solution to have a scoped variable like this. Feel free to refactor this.
let toggler = () => {};

const addToggler = () => {
  if (__DEV__) {
    DevSettings.addMenuItem('Toggle UI Debugger', () => toggler());
  }
};

const UiDebuggerProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [state, setState] = useState(false);

  // Set-up toggler on mount
  useEffect(addToggler, []);

  // Update toggle function on state change
  useEffect(() => {
    toggler = () => setState(!state);
  }, [state]);

  return (
    <uiDebuggerState.Provider value={state}>
      {children}
    </uiDebuggerState.Provider>
  );
};

const useUiDebugger = () => {
  const context = useContext(uiDebuggerState);
  if (context === undefined) {
    throw new Error('useUiDebugger must be used within a UiDebuggerProvider');
  }
  return context;
};

export {UiDebuggerProvider, useUiDebugger};
