import { Context } from "@wisegar-org/wgo-core";
import { DocumentNode } from "graphql";
import { AuthMode, NonEmptyArray } from "type-graphql";
import { IContextOptions } from "./IContextOptions";
import { Express } from "express";

export interface IServerOptions {
  /**
   * @summary If not provided a new instance on Express app server w'll be used
   */
  app?: Express;
  controllers: any[];
  resolvers: NonEmptyArray<Function> | NonEmptyArray<string>;
  authenticator: (userContext: Context, roles: any) => Promise<boolean>;
  formatError: (err: Error) => Error;
  context: (contextOptions: IContextOptions) => Promise<Context>;
  authMode?: AuthMode;
  production?: boolean;
  middlewares?: (app: any) => void;
  port: number;
  useGraphQLUpload?: boolean;
  //Max allowed non-file multipart form field size in bytes; enough for your queries (default: 1 MB).
  maxFieldSize?: number;
  //Max allowed file size in bytes (default: Infinity).
  maxFileSize?: number;
  //Max allowed number of files (default: Infinity).
  maxFiles?: number;
  useOnlyGraphQL?: boolean;
  typeDefs?: DocumentNode | Array<DocumentNode> | string | Array<string>;
  useCors?: boolean;
  publicKey: string;
  privateKey: string;
  expiresIn: any;
}
