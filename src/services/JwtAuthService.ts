import {
  IsNull,
  IsNullOrUndefined,
  IsStringEmptyNullOrUndefined,
} from "@wisegar-org/wgo-object-extensions";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export interface AccessTokenData {
  userId: number;
  userName: string;
  sessionId: number;
  iat?: number;
  exp?: number;
  expiring?: boolean;
}

export interface IGenerateAccessTokenOptions {
  privateKey?: string;
  expiresIn?: string;
  user: AccessTokenData;
}

export interface IValidateAccessTokenOptions {
  token: string;
  privateKey?: string;
  expiresIn?: string;
  user: AccessTokenData;
  publicKey: string;
}

/**
 * @var algorithm Algotithm to apply encription and decription token
 */
const algorithm = "RS256";
/**
 * @var timeBeforeExpiration Time to token expiration
 */
const timeBeforeExpiration = 3600;

export const generateAccessToken = (options: IGenerateAccessTokenOptions) => {
  if (!options) throw "generateAccessToken - options most be valid";
  if (!options.user)
    throw "generateAccessToken - AccessTokenData most be valid";
  if (!options.user.userId)
    throw "generateAccessToken - user id param most be valid";
  if (!options.privateKey)
    throw "generateAccessToken - privateKey param most be valid";
  if (!options.expiresIn)
    throw "generateAccessToken - privateKey param most be valid";

  const token = jwt.sign(options.user, options.privateKey, {
    expiresIn: options.expiresIn,
    algorithm: algorithm,
  });
  return token;
};

export const validateAccessToken = (
  options: IValidateAccessTokenOptions
): AccessTokenData | null => {
  if (!options) throw "validateAccessToken - options most be valid";
  if (!options.token)
    throw "validateAccessToken - AccessTokenData most be valid";

  try {
    const jwtPayload: AccessTokenData = <AccessTokenData>(
      jwt.verify(options.token, options.publicKey, { algorithms: [algorithm] })
    );
    const exp = (jwtPayload && jwtPayload.exp) || "";
    jwtPayload.expiring = exp > new Date().getTime() - timeBeforeExpiration;
    return jwtPayload;
  } catch (error) {
    throw `validateAccessToken => Error on token validation:  ${error}`;
  }
};

export const JWTMiddleware = (
  req: Request,
  res: Response,
  validateTokenFn: (token: string) => AccessTokenData | null,
  expiresIn: any,
  privateKey: string
): AccessTokenData | undefined => {
  if (IsStringEmptyNullOrUndefined(req.headers["authorization"] as string))
    return;

  const token: string = req.headers["authorization"] || "";
  try {
    const result = validateTokenFn(token);
    if (!result || IsNull(result)) {
      return;
    }
    if (result.expiring) {
      const options: IGenerateAccessTokenOptions = {
        user: result,
        expiresIn: expiresIn,
        privateKey: privateKey,
      };
      const newToken = generateAccessToken(options);
      res.set("authorization-refresh", newToken);
    }
    return result;
  } catch (error) {
    throw error;
  }
};
