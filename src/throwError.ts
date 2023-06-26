const throwError =
  <T, E extends Error>(toError: (input: T) => E) =>
  (input: T) => {
    throw toError(input);
  };

export default throwError;
