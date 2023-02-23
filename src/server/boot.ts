import "reflect-metadata";
import express from "express";
import { IServerOptions } from "../interfaces/IServerOptions";
import { UseJwtMiddleware } from "../middlewares/JwtMiddleware";
import { UseCorsMiddleware } from "../middlewares/CorsMiddleware";
import { UseGqlServer } from "../middlewares/GqlServerMiddleware";
import { UseGQLUploadExpress } from "../middlewares/GqlUploadMiddleware";
import { Express } from "express";
import { ExpirationFreqEnum } from "../services/JwtAuthService";
import { ApolloServer, BaseContext } from "@apollo/server";

export const boot = async (options: IServerOptions, onStart?: any) => {
  options.app = options.app ? options.app : express();
  options.expirationFreq = options.expirationFreq
    ? options.expirationFreq
    : ExpirationFreqEnum.Normal;

  UseCorsMiddleware(options);
  UseJwtMiddleware(options);

  const onCreatedGraphQLServer = () => {
    UseGQLUploadExpress(options);
  };
  const onStartedGraphQLServer = (
    server: ApolloServer<BaseContext>,
    app: Express
  ) => {
    // server.applyMiddleware({ app: app });
  };

  await UseGqlServer(options, onCreatedGraphQLServer, onStartedGraphQLServer);

  if (options.middlewares) {
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
