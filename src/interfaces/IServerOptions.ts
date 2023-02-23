import { Context } from "@wisegar-org/wgo-core";
import { DocumentNode } from "graphql";
import { AuthMode, NonEmptyArray } from "type-graphql";
import { IContextOptions } from "./IContextOptions";
import { ExpirationFreqEnum } from "../services/JwtAuthService";

export interface IServerOptions {
  /**
   * @summary If not provided a new instance on Express app server w'll be used
   */
  app?: any;
  controllers: any[];
  resolvers: NonEmptyArray<Function> | NonEmptyArray<string>;
  authenticator: (userContext: Context, roles: any) => Promise<boolean>;
  formatError: (err: any) => Error;
  context: (contextOptions: IContextOptions) => Promise<Context>;
  authMode?: AuthMode;
  production?: boolean;
  middlewares?: (app: any) => void;
  port?: number;
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
  /**
   * @deprecated Please use property expirationFreq instead
   */
  timeBeforeExpiration?: string;
  expirationFreq: ExpirationFreqEnum;
}
