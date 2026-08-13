export function logErrorResponse(errorObj: unknown, path?: string) {
  const error = errorObj;
  const green = "\x1b[32m";
  const yellow = "\x1b[33m";
  const reset = "\x1b[0m";

  console.log(`${green}> ${yellow}Error Response Data:${reset}`);
  console.dir(errorObj, { depth: null, colors: true });
  console.error(`[Error] ${path ? `in ${path}:` : ''}`, error);
}
