const localErrorHandler = (err: Error) => {
  if (process.env.FUNCTIONS_EMULATOR) {
    throw err;
  }
};

export default localErrorHandler;
