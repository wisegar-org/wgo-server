import { Request, Response } from "express";
import { Authorized, NonEmptyArray, Query, Resolver } from "type-graphql";
import { Controller } from "./decorators/rest/Controller";
import { Get } from "./decorators/rest/Get";
import { IContextOptions } from "./interfaces/IContextOptions";
import { IServerOptions } from "./interfaces/IServerOptions";
import { boot } from "./server/boot";
import { ExpirationFreqEnum } from "./services/JwtAuthService";

export * from "./interfaces/IContextOptions";
export * from "./interfaces/IResponse";
export * from "./interfaces/IRouteDefinition";
export * from "./interfaces/IServerOptions";

export * from "./decorators/Permission";
export * from "./decorators/rest/Controller";
export * from "./decorators/rest/Delete";
export * from "./decorators/rest/Export";
export * from "./decorators/rest/Get";
export * from "./decorators/rest/Post";
export * from "./decorators/rest/Put";

export * from "./services/JwtAuthService";

export * from "./middlewares/CorsMiddleware";
export * from "./middlewares/GqlServerMiddleware";
export * from "./middlewares/GqlUploadMiddleware";
export * from "./middlewares/JwtMiddleware";
export * from "./middlewares/RestMiddleware";

export * from "./server/boot";
export * from "./graphql/server";
export * from "./rest/router";

/**
 * External exports
 */
export { Express } from "express";
export { UseJwtMiddleware } from "./middlewares/JwtMiddleware";
export { UseCorsMiddleware } from "./middlewares/CorsMiddleware";
export { UseGqlServer } from "./middlewares/GqlServerMiddleware";
export { UseGQLUploadExpress } from "./middlewares/GqlUploadMiddleware";

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
  @Get("", undefined, undefined, undefined)
  public async getStat(req: Request, res: Response) {
    try {
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

boot(serverOptions, () => {
  console.log("");
});
