import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { Context } from "@wisegar-org/wgo-core";
import { IServerOptions } from "../interfaces/IServerOptions";

export const getGqlSchema = async (options: IServerOptions) => {
  return await buildSchema({
    resolvers: options.resolvers,
    authChecker: (context, roles: any) => {
      console.log("Running authChecker!");
      return options.authenticator(context as Context, roles);
    },
    authMode: options.authMode ? options.authMode : "null",
  });
};
