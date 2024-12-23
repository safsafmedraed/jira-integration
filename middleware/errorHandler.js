class ErrorHandler {
  static handle(error, reply) {
    if (error.response) {
      reply.status(error.response.status).send({
        status: error.response.status,
        message: error.response.data,
      });
    } else {
      reply.status(500).send({
        status: 500,
        message: error.message,
      });
    }
  }
}

export default ErrorHandler;