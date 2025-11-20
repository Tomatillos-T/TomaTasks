![image](https://img.shields.io/badge/Version-0.0.1-blue)

# TomaTasks

**TomaTasks** is a full-stack Cloud Native Agile project management application for Oracle Cloud Infrastructure. It provides comprehensive Scrum/Agile task management, team collaboration, and AI-powered repository analysis.

![image](https://user-images.githubusercontent.com/7783295/116454396-cbfb7a00-a814-11eb-8196-ba2113858e8b.png)

## 🚀 Tech Stack

- **Backend:** Spring Boot 3.5.6 (Java 11)
- **Frontend:** React 19.1.1 with TypeScript, Vite 7.1.7
- **Database:** Oracle Database 23ai with Vector Search
- **AI/ML:** Google Gemini 2.5 Flash Lite, RAG (Retrieval-Augmented Generation)
- **Deployment:** Docker, Kubernetes (OKE), Minikube

## 📋 Prerequisites

Before getting started, ensure you have:

- **Java 11 or higher**
- **Node.js 18+ and npm**
- **Docker Desktop** (for containerized development)
- **Maven 3.6+**
- **Oracle Database 23ai** connection details
- **Git**

Optional for cloud deployment:
- OCI CLI
- kubectl
- Terraform

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Tomatillos-T/TomaTasks.git
cd TomaTasks
```

### 2. Environment Setup

Create a `.env` file in `MtdrSpring/backend/` with your configuration:

```bash
# Database Configuration (Oracle 23ai)
db_url=jdbc:oracle:thin:@<your_connection_string>
db_user=<your_username>
db_password=<your_password>

# Google Gemini API (for AI features)
GOOGLE_API_KEY=<your_api_key>

# Repository Configuration (for RAG features)
REPO_URL=https://github.com/Tomatillos-T/TomaTasks.git
REPO_BRANCH=dev
REPO_PATH=/tmp/repo
```

### 3. Database Setup

The application requires Oracle Database 23ai with specific tables for AI features:

1. Connect to your Oracle 23ai database
2. Run the setup script: `MtdrSpring/backend/src/main/resources/schema.sql`
3. See detailed instructions: `MtdrSpring/backend/src/main/resources/RAG_SETUP.md`

**Note:** The application will start without these tables, but AI-powered features won't work. All core features (projects, tasks, sprints, teams) work normally.

### 4. Oracle Wallet Setup

Place your Oracle Database wallet files in `MtdrSpring/backend/wallet/` directory. This is required for secure database connections.

## 🏃 Running the Application

### Option 1: Docker (Recommended for Development)

**Windows:**
```bash
cd MtdrSpring/backend
buildImgContainer.bat
```

**Manual Docker Build:**
```bash
cd MtdrSpring/backend

# Build and test
mvn clean verify

# Build Docker image
docker build --no-cache -f DockerfileDev --platform linux/amd64 -t agileimage:0.1 .

# Run container
docker run --name agilecontainer -p 8080:8080 -d agileimage:0.1
```

Access the application at: **http://localhost:8080**

### Option 2: Local Development (Backend + Frontend Separately)

**Backend (Terminal 1):**
```bash
cd MtdrSpring/backend
mvn clean package spring-boot:repackage
java -jar target/TomaTask-0.0.1-SNAPSHOT.jar
```

**Frontend (Terminal 2):**
```bash
cd MtdrSpring/backend/src/main/frontend
npm install
npm run dev
```

- Backend: http://localhost:8080
- Frontend: http://localhost:3000 (proxies to backend)

## 🧪 Running Tests

### Backend Tests
```bash
cd MtdrSpring/backend
mvn test
```

### Frontend Tests
```bash
cd MtdrSpring/backend/src/main/frontend
npm test
```

### Full Integration Tests
```bash
cd MtdrSpring/backend
mvn verify
```

## 📁 Project Structure

```
TomaTasks/
├── MtdrSpring/
│   ├── backend/
│   │   ├── src/main/java/com/springboot/TomaTask/
│   │   │   ├── controller/      # REST API controllers
│   │   │   ├── service/         # Business logic
│   │   │   ├── repository/      # Data access layer
│   │   │   ├── model/           # Domain entities
│   │   │   ├── dto/             # Data transfer objects
│   │   │   ├── config/          # Configuration classes
│   │   │   └── security/        # Authentication & authorization
│   │   ├── src/main/frontend/   # React application
│   │   │   ├── src/
│   │   │   │   ├── components/  # Reusable UI components
│   │   │   │   ├── modules/     # Feature modules
│   │   │   │   ├── pages/       # Route pages
│   │   │   │   ├── services/    # API clients
│   │   │   │   └── contexts/    # React contexts
│   │   ├── src/main/resources/
│   │   │   ├── application.properties
│   │   │   ├── schema.sql       # Database setup
│   │   │   └── RAG_SETUP.md     # AI features setup
│   │   └── wallet/              # Oracle DB wallet (not in git)
│   └── minikube/                # Local Kubernetes setup
└── README.md
```

## 🤝 Development Workflow

### Git Branching Strategy

- **`main`** - Production-ready code
- **`dev`** - Integration branch for features
- **`HU<user-story-number>/task<number>-<description>`** - Feature branches

Example: `HU67/task105-AddDashboard`

### Making Changes

1. Create a feature branch from `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b HU##/task###-Description
   ```

2. Make your changes and test locally

3. Build and test:
   ```bash
   cd MtdrSpring/backend
   mvn clean verify
   ```

4. Commit and push:
   ```bash
   git add .
   git commit -m "Add feature description"
   git push origin HU##/task###-Description
   ```

5. Create a Pull Request to `dev` branch

## 🐛 Troubleshooting

### Container stops immediately
- Check logs: `docker logs agilecontainer --tail 100`
- Verify `.env` file exists with all required variables
- Ensure Oracle wallet is in `wallet/` directory

### Database connection fails
- Verify database credentials in `.env`
- Check Oracle wallet files are present and valid
- Ensure database is accessible from your network

### Frontend shows blank page
- Check browser console for errors
- Verify backend is running on port 8080
- Clear browser cache and reload

### Maven build fails
- Ensure Java 11+ is installed: `java -version`
- Check internet connection (Maven downloads dependencies)
- Try: `mvn clean install -U` to force update dependencies

### Docker build is slow
- First build downloads all dependencies (can take 5-10 minutes)
- Subsequent builds use cache and are much faster
- Use `mvn clean verify` separately to test without Docker

## 📚 Additional Resources

- **RAG Setup Guide:** See `MtdrSpring/backend/src/main/resources/RAG_SETUP.md`
- **Oracle Cloud Documentation:** https://docs.oracle.com/en-us/iaas/

## 🎯 Key Features

- **Project Management:** Create and manage Agile projects
- **Sprint Planning:** Define sprints with user stories and tasks
- **Task Tracking:** Assign tasks, track progress, set priorities
- **Team Collaboration:** Manage teams and user assignments
- **AI-Powered Search:** Semantic code search using RAG technology
- **Repository Analysis:** Analyze commit history and code changes

## 🙋 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review logs: `docker logs agilecontainer`
3. Ask your team lead or create an issue in the repository

---

**Happy Coding!** 🍅
