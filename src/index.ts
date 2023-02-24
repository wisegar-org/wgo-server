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
