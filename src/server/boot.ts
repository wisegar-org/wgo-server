import "reflect-metadata";
import express from "express";
import { IServerOptions } from "../interfaces/IServerOptions";
import { UseJwtMiddleware } from "../middlewares/JwtMiddleware";
import { UseCorsMiddleware } from "../middlewares/CorsMiddleware";
import { UseGqlServer } from "../middlewares/GqlServerMiddleware";
import { ExpirationFreqEnum } from "../services/JwtAuthService";
import { UseRestMiddleware } from "../middlewares/RestMiddleware";

export const boot = async (options: IServerOptions, onStart?: any) => {
  options.app = options.app ? options.app : express();

  options.expirationFreq = options.expirationFreq
    ? options.expirationFreq
    : ExpirationFreqEnum.Normal;

  console.debug("Registering Cors middleware");
  UseCorsMiddleware(options);

  console.debug("Registering Jwt middleware");
  UseJwtMiddleware(options);

  if (options.controllers && options.controllers.length > 0) {
    console.debug("Registering Rest middleware");
    UseRestMiddleware(options);
  }

  if (options.resolvers && options.resolvers.length > 0) {
    console.debug("Registering Graphql middleware");
    UseGqlServer(options);
  }

  if (options.middlewares) {
    console.debug("Registering Extras middleware");
    options.middlewares(options.app);
  }

  options.app?.listen(options.port, () => {
    if (onStart) onStart();
    console.log(`> Listening on port ${options.port}`);
  });

  process.on("SIGINT", function () {
    process.exit(0);
  });
};
