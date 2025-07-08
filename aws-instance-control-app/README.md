# AI App: AWS EC2 Instance Controller

This project is a web-based application to control the start/stop state of an AWS EC2 instance. It features:

- Node.js Express backend with AWS SDK
- React frontend (PWA) with touch-friendly slider controls
- REST API for EC2 start/stop

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the backend server:
   ```sh
   node server.js
   ```
3. Start the frontend:
   ```sh
   npm start
   ```

## AWS Credentials

Set your AWS credentials and region as environment variables or in `~/.aws/credentials`.

## Security

This app is for demonstration purposes. Secure the backend before deploying to production.
