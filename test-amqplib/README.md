# RabbitMQ Test Setup

## 1. Prerequisites
- Docker
- Node.js

## 2. Setup
Install dependencies:
```bash
npm install
```

Start RabbitMQ server:
```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

## 3. Usage
**Terminal 1 (Receiver):**
```bash
node receive.js
```

**Terminal 2 (Sender):**
```bash
node send.js
```
