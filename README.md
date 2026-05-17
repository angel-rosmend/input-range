# Mango Range Challenge

A monorepo containing a Next.js Range Component application

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation


# 1 - Clone the repository
```bash
git clone https://github.com/angel-rosmend/range-component.git
```

```bash
cd mango-range-challenge
```

# 2 - Install dependencies
```bash
npm run install
```

### 3 -  Running the Project

**Option 1: Run App **

```bash
npm run dev
```

This will start:

- Next.js app on http://localhost:8080

### Running Tests

```bash
npm test
```


## 🛠️ Available Scripts

- `npm run dev` - Run both apps concurrently
- `npm run build` - Build the frontend for production
- `npm test` - Run frontend tests
- `npm run install` - Install dependencies for all apps
- `npm run clean` - Remove all node_modules and build artifacts

## 🌐 API Endpoints

This project uses **mockable.io** for mocking API responses. Mockable.io is a service that allows you to create fake HTTP endpoints without writing a backend server. The Range component fetches data from mocked endpoints to simulate loading range configuration (normal vs fixed mode) with proper error handling and loading states.

Available mock endpoints:

- `GET http://localhost:8080/api/range?mode=normal` - Normal range data
- `GET http://localhost:8080/api/range?mode=fixed` - Fixed range values

## 📝 License

MIT
