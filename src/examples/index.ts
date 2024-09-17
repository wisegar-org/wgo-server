import { Authorized, NonEmptyArray, Query, Resolver } from "type-graphql";
import {
  boot,
  Controller,
  ExpirationFreqEnum,
  Get,
  IContextOptions,
  IServerOptions,
  Post,
} from ".."; // index file imports

@Resolver()
export class VersionResolver {
  @Authorized()
  @Query(() => String)
  async apiVersion() {
    return "0.0.0.0.0";
  }
}
const authorizationHandler = async (userContext: any, permissions: any) => {
  return true;
};
const contextHandler = async (options: IContextOptions): Promise<any> => {
  const { tokenPayload, requestHeaders, responseHeaders } = options;
  return {
    tokenPayload,
    requestHeaders,
    responseHeaders,
  };
};
export const errorHandler = (err: any): any => {
  return {
    message: err.message,
    code:
      err.originalError && err.originalError.code
        ? err.originalError.code
        : "ServerError",
    locations: err.locations,
    path: err.path,
    original: err.originalError,
  };
};
@Controller("/health")
export class HealthController {
  @Get("/", undefined, undefined, undefined)
  public async getStat(req: any, res: any) {
    try {
      const result = { count: 3 };
      res.status(200).json({ stat: result });
    } catch (error: any) {
      res
        .status(500)
        .json({ error: error, message: error.message, stack: error.stack });
    }
  }

  @Post("/post", undefined, undefined, undefined)
  public async postStat(req: any, res: any) {
    try {
      const body = req.body;
      console.log(body);
      const result = { count: 3 };
      res.status(200).json({ stat: result });
    } catch (error: any) {
      res
        .status(500)
        .json({ error: error, message: error.message, stack: error.stack });
    }
  }
}

const resolversArr: NonEmptyArray<Function> = [VersionResolver];
const serverOptions: IServerOptions = {
  authenticator: authorizationHandler,
  context: contextHandler,
  controllers: [HealthController],
  formatError: errorHandler,
  resolvers: resolversArr,
  production: false,
  port: 6006,
  maxFileSize: 50000000,
  maxFiles: 10,
  middlewares: (app) => {},
  useCors: true,
  publicKey: "settings.PUBLIC_KEY",
  privateKey: "settings.PRIVATE_KEY",
  expiresIn: "settings.TOKEN_EXPIRES_IN",
  expirationFreq: ExpirationFreqEnum.Normal,
};

boot(serverOptions)
  .then(() => {
    console.log("Started");
  })
  .finally(() => {});
