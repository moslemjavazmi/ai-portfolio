# Taskino — Task Marketplace

Taskino is a task marketplace portfolio project intended to connect customers with service providers. It is being built as a TypeScript/Node.js backend using Express services and a Next.js frontend.

## Frontend
- Next.js, React, TypeScript.

## Backend and architecture
- Node.js and Express with TypeScript.
- A microservices-oriented architecture with an API Gateway.
- Kafka for asynchronous event-driven communication.

## Data stores
- PostgreSQL and Prisma for relational data in several services.
- MongoDB for chat data.

## Business workflow
- Customers create tasks.
- Tasks can go through an approval flow.
- Service providers can submit offers.
- Customers select an offer and the task progresses through acceptance and completion.
- Chat and payment capabilities are part of the project scope; only describe them as complete if the current code and demo confirm that status.

## Services and areas
- Authentication and user management.
- Task workflow and provider matching.
- Chat using Socket.IO and MongoDB in the chat service.
- Payment service using Express, Prisma, PostgreSQL and Kafka, with test-mode payment flow.

## Honesty constraints
- Do not claim production traffic, real customers, revenue, uptime, or production payment processing unless documented separately.
- If asked which exact source files implement a feature, explain that the assistant knowledge base currently contains architecture notes, not the complete repository source code.
