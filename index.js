import compress from "@fastify/compress";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import dotenv from "dotenv";
import Fastify from "fastify";
import router from "./routes/index.js";

dotenv.config();

const fastify = Fastify({ logger: true });

const corsConfig = {
  origin: true,
  credentials: true,
};

fastify.register(cors, corsConfig);
fastify.register(compress);
fastify.register(cookie);
fastify.register(helmet);

fastify.addHook("onRequest", (request, reply, done) => {
  global.visited = `${request.method} ${request.url}`;
  done();
});

fastify.setErrorHandler((error, request, reply) => {
  if (error.validation) {
    reply.status(400).send({
      status: 400,
      isError: true,
      message: "Invalid JSON",
      result: null,
    });
  } else {
    reply.send(error);
  }
});

fastify.register(router, { prefix: "/v1" });

fastify.setNotFoundHandler((request, reply) => {
  reply.status(405).send({
    status: 405,
    isError: true,
    message: "Method not allowed",
    result: null,
  });
});


fastify.listen({ port: process.env.PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    // logger.log("error", err);
    process.exit(1);
  }
//   logger.log("info", `Server started on ${address}`);
});
