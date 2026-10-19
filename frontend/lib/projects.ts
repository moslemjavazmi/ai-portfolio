export type Accent = "blue" | "violet" | "emerald" | "orange" | "cyan" | "pink";

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  longDescription: string;
  tags: string[];
  liveUrl: string;          // ← update to the real URL
  glow: string;             // tailwind bg for glow
  architecture: {
    layers: {
      label: string;
      accent: Accent;
      items: string[];
      highlight?: boolean;
    }[];
  };
  stack: string[];
}

export const PROJECTS: Project[] = [
  {
    id: "taskino",
    title: "Taskino",
    subtitle: "Microservices Platform",
    shortDescription:
      "Task & offer management platform with 3 frontend apps and 7 backend services.",
    longDescription:
      "A full-scale marketplace connecting taskers and users. Built on a microservices architecture with an API gateway, Kafka event streaming, and independent services for users, tasks, offers, search, notifications, chat, and payments.",
    tags: ["Next.js", "TypeScript", "Express", "Prisma", "Kafka"],
    liveUrl: "https://taskino.example.com",
    glow: "bg-emerald-500",
    architecture: {
      layers: [
        {
          label: "Frontend Applications",
          accent: "blue",
          items: ["tasker-app", "user-app", "admin-app"],
        },
        {
          label: "API Gateway",
          accent: "emerald",
          items: ["Gateway"],
          highlight: true,
        },
        {
          label: "Microservices",
          accent: "violet",
          items: [
            "user-service",
            "task-service",
            "offer-service",
            "search-service",
            "notification-service",
            "chat-service",
            "payment-service",
          ],
        },
        {
          label: "Message Broker",
          accent: "orange",
          items: ["Apache Kafka"],
        },
        {
          label: "Data Layer",
          accent: "cyan",
          items: ["PostgreSQL", "Prisma ORM"],
        },
      ],
    },
    stack: [
      "Next.js",
      "TypeScript",
      "Express",
      "PostgreSQL",
      "Prisma",
      "Kafka",
      "Microservices",
      "API Gateway",
    ],
  },
  {
    id: "simolmetal",
    title: "Simol Metal",
    subtitle: "Industrial Website",
    shortDescription:
      "Corporate website for a metal industry company with a minimalist, responsive design.",
    longDescription:
      "A professional B2B website for the metal industry, focusing on clean design, fast load times, and SEO. Built with Next.js App Router, TypeScript, and Zustand for state management, backed by MongoDB.",
    tags: ["Next.js", "TypeScript", "MongoDB", "Zustand"],
    liveUrl: "https://simolmetal.example.com",
    glow: "bg-orange-500",
    architecture: {
      layers: [
        {
          label: "Client",
          accent: "blue",
          items: ["Next.js App Router", "TypeScript", "Zustand Store"],
        },
        {
          label: "API Layer",
          accent: "emerald",
          items: ["Next.js API Routes"],
          highlight: true,
        },
        {
          label: "Data Layer",
          accent: "cyan",
          items: ["MongoDB", "Mongoose"],
        },
      ],
    },
    stack: ["Next.js", "TypeScript", "MongoDB", "Zustand", "Tailwind CSS"],
  },
  {
    id: "daianweb",
    title: "Daian Web",
    subtitle: "Corporate Site",
    shortDescription:
      "Modern corporate website with a strong focus on UX and performance.",
    longDescription:
      "A corporate web presence built on the same scalable pattern as Simol Metal, but powered by JavaScript instead of TypeScript. Optimized for SEO, RTL, and fast first paint.",
    tags: ["Next.js", "JavaScript", "MongoDB", "Zustand"],
    liveUrl: "https://daianweb.example.com",
    glow: "bg-blue-500",
    architecture: {
      layers: [
        {
          label: "Client",
          accent: "blue",
          items: ["Next.js App Router", "JavaScript", "Zustand Store"],
        },
        {
          label: "API Layer",
          accent: "emerald",
          items: ["Next.js API Routes"],
          highlight: true,
        },
        {
          label: "Data Layer",
          accent: "cyan",
          items: ["MongoDB", "Mongoose"],
        },
      ],
    },
    stack: ["Next.js", "JavaScript", "MongoDB", "Zustand", "Tailwind CSS"],
  },
  {
    id: "chatapp",
    title: "Chat Application",
    subtitle: "Real-time Messaging",
    shortDescription:
      "Real-time chat platform with Socket.io, persistent message history, and MongoDB.",
    longDescription:
      "A real-time messaging application with instant delivery via Socket.io. Supports multiple rooms, typing indicators, and full message history stored in MongoDB.",
    tags: ["Socket.io", "JavaScript", "MongoDB", "Node.js"],
    liveUrl: "https://chat.example.com",
    glow: "bg-violet-500",
    architecture: {
      layers: [
        {
          label: "Client",
          accent: "blue",
          items: ["React / JS", "Socket.io Client"],
        },
        {
          label: "Server",
          accent: "emerald",
          items: ["Node.js", "Express", "Socket.io Server"],
          highlight: true,
        },
        {
          label: "Real-time Events",
          accent: "violet",
          items: ["message", "typing", "presence", "ack"],
        },
        {
          label: "Data Layer",
          accent: "cyan",
          items: ["MongoDB"],
        },
      ],
    },
    stack: ["Socket.io", "Node.js", "Express", "MongoDB", "JavaScript"],
  },
  {
    id: "agent",
    title: "AI Agent",
    subtitle: "LLM Assistant",
    shortDescription:
      "Autonomous AI agent with tool calling, memory, and vector retrieval.",
    longDescription:
      "A production-grade AI agent built with FastAPI and LLM tool-calling. Supports retrieval-augmented generation over a vector database, persistent memory, and multi-step reasoning across external APIs.",
    tags: ["FastAPI", "Python", "LLM", "pgvector"],
    liveUrl: "https://agent.example.com",
    glow: "bg-pink-500",
    architecture: {
      layers: [
        {
          label: "Client",
          accent: "blue",
          items: ["Next.js UI", "Streaming Chat"],
        },
        {
          label: "API Layer",
          accent: "emerald",
          items: ["FastAPI", "Pydantic", "Auth"],
          highlight: true,
        },
        {
          label: "Agent Core",
          accent: "violet",
          items: ["Planner", "Tool Registry", "Memory"],
        },
        {
          label: "LLM & Tools",
          accent: "orange",
          items: ["OpenAI / Claude", "Search", "Calculator", "Custom APIs"],
        },
        {
          label: "Data Layer",
          accent: "cyan",
          items: ["PostgreSQL", "pgvector"],
        },
      ],
    },
    stack: ["FastAPI", "Python", "LangChain", "OpenAI", "PostgreSQL", "pgvector"],
  },
];

export const FEATURED_PROJECT = PROJECTS[0]; // Taskino
export const OTHER_PROJECTS = PROJECTS.slice(1); // the other 4