import { IsNullOrUndefined } from "@wisegar-org/wgo-object-extensions";
import { IServerOptions } from "../interfaces/IServerOptions";
import { configRouter } from "../rest/router";

export const UseRestMiddleware = async (
  options: IServerOptions
): Promise<void> => {
  if (IsNullOrUndefined(options)) throw new Error("Invalid options parameter");
  if (IsNullOrUndefined(options.app))
    throw new Error("Invalid options app parameter");
  if (options.controllers) {
    configRouter(options.controllers, options.app);
  }
};
