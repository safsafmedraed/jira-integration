import crypto from 'crypto';
const SECRET = process.env.JIRA_WEBHOOK_SECRET;

export const authorizeJiraRequest = async (request, reply, done) => {
    const { headers, body } = request;

    const receivedSignature = headers["x-hub-signature"];
    if (!receivedSignature || !receivedSignature.startsWith('sha256=')) {
        return reply.status(401).send({
            status: 401,
            isError: true,
            message: "Unauthorized",
            result: null,
        });
    }

    const methodAndSignature = receivedSignature.split('=');
    const method = methodAndSignature[0];
    const receivedHmac = methodAndSignature[1];

    if (method !== 'sha256') {
        return reply.status(401).send({
            status: 401,
            isError: true,
            message: "Unsupported hash method",
            result: null,
        });
    }

    // Calculate the HMAC using the secret and the payload
    const hmac = crypto.createHmac('sha256', SECRET)
                      .update(JSON.stringify(body))
                      .digest('hex');
        
    if (hmac !== receivedHmac) {
        return reply.status(403).send({
            status: 403,
            isError: true,
            message: "Forbidden",
            result: null,
        });
    }

     done();
};
