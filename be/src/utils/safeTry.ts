export const safeTry = <T>(fn: () => T): [Error, null] | [null, T] => {
  try {
    return [null, fn()];
  } catch (e) {
    return [e instanceof Error ? e : new Error(String(e)), null];
  }
};
