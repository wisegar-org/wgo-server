import { IsNullOrUndefined } from "@wisegar-org/wgo-object-extensions";
import cors from "cors";
import { IServerOptions } from "../interfaces/IServerOptions";

export const UseCorsMiddleware = (options: IServerOptions) => {
  if (IsNullOrUndefined(options)) throw new Error("Invalid options parameter");
  if (IsNullOrUndefined(options.app))
    throw new Error("Invalid options app parameter");
  if (!options.useCors) {
    console.debug(
      `Cors middleware not setted. Cors options set to:  ${options.useCors}`
    );
    return;
  }
  options?.app?.use(cors());
};
