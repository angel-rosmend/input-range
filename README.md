# Mango Range Challenge

A monorepo containing a Next.js Range Component application and a mock API server.

## 📦 Project Structure

- `/frontend` - Next.js application with Range component
- `/mock-server` - Express mock API server

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation


# 1 - Clone the repository
```bas
git clone https://github.com/angel-rosmend/range-component.git
cd mango-range-challenge
```

# 2 - Install all dependencies (root + both apps)
```bash
npm run install:all
```

### 3 -  Running the Project

**Option 1: Run both apps together (Recommended)**

```bash
npm run dev
```

This will start:
- Mock server on http://localhost:4000
- Next.js app on http://localhost:8080

**Option 2: Run apps separately**

# Terminal 1 - Mock Server
```bash
npm run dev:server
```

# Terminal 2 - Frontend
```bash
npm run dev:frontend
```

### Running Tests

```bash
npm test
```bash

## 📚 Documentation

- [Frontend Documentation](./apps/frontend/README.md)

## 🛠️ Available Scripts

- `npm run dev` - Run both apps concurrently
- `npm run dev:frontend` - Run only the Next.js app
- `npm run dev:server` - Run only the mock server
- `npm run build` - Build the frontend for production
- `npm test` - Run frontend tests
- `npm run install:all` - Install dependencies for all apps
- `npm run clean` - Remove all node_modules and build artifacts

## 🌐 API Endpoints

The mock server provides:

- `GET http://localhost:4000/range?mode=normal` - Normal range data
- `GET http://localhost:4000/range?mode=fixed` - Fixed range values

## 📝 License

MIT
