# GameVault

A modern full-stack application for managing and organizing your game collection.

## Overview

GameVault is a TypeScript-based application designed to provide a comprehensive platform for game management. Built with a monorepo structure using pnpm workspaces, it features a powerful backend API and an intuitive frontend interface.

## 🏗️ Project Structure

```
GameVault/
├── backend/          # Backend API server
├── frontend/         # Frontend application (Next.js)
├── pnpm-workspace.yaml
└── README.md
```

### Tech Stack

- **Language**: TypeScript
- **Package Manager**: pnpm (monorepo setup)
- **Frontend**: Next.js
- **Build Tools**: Modern JavaScript tooling

## 📋 Prerequisites

- Node.js (LTS recommended)
- pnpm (package manager)

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rupesh17-rtg/GameVault.git
cd GameVault
```

2. Install dependencies:
```bash
pnpm install
```

### Development

To start development across the monorepo:

```bash
# Install all workspace dependencies
pnpm install

# Run development servers
pnpm dev
```

The workspace includes configuration for optional builds:
- MSW (Mock Service Worker) - API mocking
- Sharp - Image processing

## 📦 Packages

### Backend
Located in `/backend`, handles:
- API endpoints for game management
- Database operations
- Business logic

### Frontend
Located in `/frontend`, provides:
- Next.js-based user interface
- Game discovery and management
- Responsive design

## 🔧 Configuration

The project uses pnpm workspaces for monorepo management. Build options can be configured in `pnpm-workspace.yaml`.

## 📄 License

This project is currently unlicensed.

## 👤 Author

[rupesh17-rtg](https://github.com/rupesh17-rtg)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📞 Support

For issues and questions, please use the GitHub Issues page.

---

**Happy gaming! 🎮**
