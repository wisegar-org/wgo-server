import "reflect-metadata";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import { graphqlUploadExpress } from "graphql-upload";
import { getApolloServer } from "../graphql/server";
import { IServerOptions } from "../interfaces/IServerOptions";
import ErrorHandler from "../rest/errorHandler";
import { JsonResponse } from "../rest/responses";
import { configRouter as configRest } from "../rest/router";
import { JwtMiddleware } from "../middlewares/JwtMiddleware";

export const boot = async (options: IServerOptions, onStart?: any) => {
  console.log("Running boot!");
  options.app = options.app ? options.app : express();

  if (options.useCors) {
    options.app.use(cors());
  }

  options.app.use(JwtMiddleware(options));

  if (options.middlewares) {
    options.middlewares(options.app);
  }

  if (options.controllers) {
    configRest(options.controllers, options.app);
  }

  const server = await getApolloServer(options);
  await server.start();
  options.app.use(graphqlUploadExpress());
  server.applyMiddleware({ app: options.app });

  options.app.listen(options.port, () => {
    if (onStart) onStart();
    console.log(`> Listening on port ${options.port}`);
  });

  process.on("SIGINT", function () {
    server.stop();
    process.exit(0);
  });
};
