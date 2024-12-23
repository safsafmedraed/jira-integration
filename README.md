# Jira Service Integration

This project integrates with Jira to handle various operations such as fetching tickets, updating ticket status, and listening to Jira webhooks. It uses Fastify as the web framework and includes middleware for request authorization.

## Prerequisites

- Node.js
- npm or yarn
- Jira account with API access

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/jira-integration.git
   cd jira-integration

2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install

3. Create a .env file in the root directory and  follow .env.exemple environment variables

## Usage

1. Start the server:
    ```bash
    npm start
    # or
    yarn start

2. The server will start on the specified port (default is 3000).


### Fetch Jira Tickets
- **Endpoint**: `POST /`
- **Description**: Fetches Jira tickets.
- **Authorization**: Basic Auth with Jira email and API token.

### Get Transition IDs
- **Endpoint**: `POST /transitions`
- **Description**: Retrieves transition IDs for Jira tickets.
- **Authorization**: Basic Auth with Jira email and API token.

### Listen to Jira Webhook
- **Endpoint**: `POST /webhook`
- **Description**: Listens to Jira webhooks and updates ticket status if the issue is in progress.
- **Authorization**: HMAC authorization using the secret key.

## Middleware

### Authorization Middleware
- **File**: `authorization.js`
- **Description**: Verifies the HMAC signature of incoming requests to ensure they are authorized.

## Error Handling

### Error Handler
- **File**: `services/errorHandler.js`
- **Description**: Handles errors and sends appropriate responses.

## Logging

Logs are managed using a logger (e.g., winston or pino).
