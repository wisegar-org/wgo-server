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
  debugger;
  console.log("Running boot!");
  options.app = options.app ? options.app : express();

  const server = await getApolloServer(options);
  await server.start();
  server.applyMiddleware({ app: options.app });

  if (options.useCors) {
    options.app.use(cors());
  }

  options.app.use(JwtMiddleware(options));

  options.app.use(graphqlUploadExpress());

  if (options.middlewares) {
    options.middlewares(options.app);
  }

  if (options.controllers) {
    configRest(options.controllers, options.app);
  }

  options.app.use(
    (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
      console.log("Running ErrorHandler use!");
      const response = JsonResponse(false, err.statusCode || 500, err.message);
      res.json(response);
    }
  );

  options.app.use((req: Request, res: Response, next: NextFunction) => {
    const response = JsonResponse(false, 404, "resource not found");
    console.log("Running Not found use!");
    res.json(response);
  });

  options.app.listen(options.port, () => {
    if (onStart) onStart();
    console.log(`> Listening on port ${options.port}`);
  });

  process.on("SIGINT", function () {
    server.stop();
    process.exit(0);
  });
};
