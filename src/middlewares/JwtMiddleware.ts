import { AuthError } from "@wisegar-org/wgo-core";
import { IsNullOrUndefined } from "@wisegar-org/wgo-object-extensions";
import express from "express";
import { IContextOptions } from "../interfaces/IContextOptions";
import { IServerOptions } from "../interfaces/IServerOptions";
import {
  AccessTokenData,
  jwtValidator,
  validateAccessToken,
} from "../services/JwtAuthService";

const isGraphql = (req: express.Request) => {
  return req.originalUrl.toLocaleLowerCase().includes("graphql");
};

const expressTokenErrorHandler = (res: express.Response, error: any) => {
  console.error(error);
  res.status(401);
  res.statusMessage = `${AuthError.NotAuthorized}`;
  res.end();
};

const graphqlTokenErrorHandler = (res: express.Response, error: any) => {
  console.error(error);
  res.status(200);
  res.send(
    `{"errors":[{"message":"${AuthError.NotAuthorized}"}, {"message":"${error}"}], "data":null }`
  );
  res.end();
};

export const JwtMiddleware = (options: IServerOptions) => {
  return (req: express.Request, res: express.Response, next: () => void) => {
    try {
      const tokenData: AccessTokenData | undefined = jwtValidator(
        req,
        res,
        validateAccessToken,
        options.expiresIn,
        options.publicKey,
        options.privateKey,
        options.timeBeforeExpiration,
        options.expirationFreq
      );
      if (IsNullOrUndefined(tokenData)) {
        next();
        return;
      }
      if (isGraphql(req)) {
        (req as any).tokenPayload = tokenData;
        next();
        return;
      }
      const contextOptions: IContextOptions = {
        tokenPayload: tokenData,
        requestHeaders: req.headers,
        responseHeaders: res.getHeaders(),
      };
      options.context(contextOptions).then((result: any) => {
        (req as any).context = result;
        next();
      });
    } catch (error) {
      if (isGraphql(req)) {
        graphqlTokenErrorHandler(res, error);
        return;
      }
      expressTokenErrorHandler(res, error);
    }
  };
};

export const UseJwtMiddleware = (options: IServerOptions) => {
  if (IsNullOrUndefined(options)) throw new Error("Invalid options parameter");
  if (IsNullOrUndefined(options.app))
    throw new Error("Invalid options app parameter");
  options?.app?.use(JwtMiddleware(options));
};
