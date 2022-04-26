import "reflect-metadata";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import { graphqlUploadExpress } from "graphql-upload";
import { getApolloServer } from "../graphql/server";
import { IServerOptions } from "../interfaces/IServerOptions";
import ErrorHandler from "../rest/errorHandler";
import { JsonResponse } from "../rest/responses";
import { configRouter as configRest } from "../rest/router";

export const start = async (options: IServerOptions, onStart?: any) => {
  options.app = options.app ? options.app : express();

  const server = await getApolloServer(options);
  await server.start();

  if (options.useCors) {
    options.app.use(cors());
  }

  options.app.use(graphqlUploadExpress());

  if (options.middlewares) {
    options.middlewares(options.app);
  }

  if (options.controllers) {
    configRest(options.controllers, options.app);
  }

  options.app.use(
    (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
      const response = JsonResponse(false, err.statusCode || 500, err.message);
      res.json(response);
    }
  );

  options.app.use((req: Request, res: Response, next: NextFunction) => {
    const response = JsonResponse(false, 404, "resource not found");
    res.json(response);
  });

  server.applyMiddleware({ app: options.app });

  options.app.listen(options.port, () => {
    if (onStart) onStart();
    console.log(`> Listening on port ${options.port}`);
    console.log("Server port: ", process.env.PORT);
  });

  process.on("SIGINT", function () {
    process.exit(0);
  });
};
