import { IsNull, IsNullOrUndefined } from "wgo-extensions";
import { contextHandler, getApolloServer } from "../graphql/server";
import { IServerOptions } from "../interfaces/IServerOptions";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { json } from "body-parser";
import { UseGQLUploadExpress } from "./GqlUploadMiddleware";

export const UseGqlServer = (options: IServerOptions) => {
  if (IsNullOrUndefined(options)) throw new Error("Invalid options parameter");

  if (!options.app || IsNull(options.app))
    throw new Error("Invalid options app parameter");

  getApolloServer(options).then((server) => {
    UseGQLUploadExpress(options);
    server.start().then(() => {
      options.app.use(
        "/graphql",
        json(),
        expressMiddleware(server, {
          context: async ({ req, res }) => contextHandler(options, req, res),
        })
      );
    });
  });
};
