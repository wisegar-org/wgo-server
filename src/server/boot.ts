import "reflect-metadata";
import express from "express";
import { IServerOptions } from "../interfaces/IServerOptions";
import { UseJwtMiddleware } from "../middlewares/JwtMiddleware";
import { UseCorsMiddleware } from "../middlewares/CorsMiddleware";
import { UseGqlServer } from "../middlewares/GqlServerMiddleware";
import { UseGQLUploadExpress } from "../middlewares/GqlUploadMiddleware";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import { Express } from "express";

export const boot = async (options: IServerOptions, onStart?: any) => {
  options.app = options.app ? options.app : express();
  UseCorsMiddleware(options);
  UseJwtMiddleware(options);
  const onCreatedGraphQLServer = () => {
    UseGQLUploadExpress(options);
  };
  const onStartedGraphQLServer = (
    server: ApolloServer<ExpressContext>,
    app: Express
  ) => {
    server.applyMiddleware({ app: app });
  };

  await UseGqlServer(options, onCreatedGraphQLServer, onStartedGraphQLServer);

  if (options.middlewares) {
    options.middlewares(options.app);
  }

  UseCorsMiddleware(options);

  options.app.listen(options.port, () => {
    if (onStart) onStart();
    console.log(`> Listening on port ${options.port}`);
  });

  process.on("SIGINT", function () {
    process.exit(0);
  });
};
