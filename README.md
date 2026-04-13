# Expense Tracker — Node.js Implementation
## Module 8 DevOps Capstone Project

Welcome to your DevOps journey! This is a **pre-built expense tracker application** designed for the **Module 8 capstone project**. Your job is to:

1. **Personalize** the application with your name
2. **Complete** the Dockerfile (skeleton provided)
3. **Complete** the docker-compose.yml (skeleton provided)
4. **Submit** screenshot proof of your DevOps workflow

---

## 📋 Quick Start (Before Personalizing)

```bash
# Clone this repository
git clone https://github.com/[your-fork]/expense-tracker-nodejs.git
cd expense-tracker-nodejs

# Install dependencies
npm install

# Create .env file (for local development)
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_tracker
DB_USER=postgres
DB_PASSWORD=password
NODE_ENV=development
EOF

# Start local PostgreSQL (if not using Docker yet)
# ... (use Docker Compose once you complete it)

# Run tests
npm test

# Start development server
npm run dev
```

---

## 🎯 Your DevOps Tasks

### Task 1: Personalize the Application ✨

Before you start DevOps work, make the app yours:

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/personalize-for-[yourname]
   ```

2. **Update HTML pages** — Replace `[studentname]` with your actual name:
   - Edit `src/public/expenses.html` (line ~22)
   - Edit `src/routes/dashboard.js` (line ~47)
   - Search for `[studentname]` and replace with your name

3. **Update application title** in `package.json`:
   ```json
   "description": "Expense tracker for [Your Name] — DevOps Demo Project"
   ```

4. **Create Git commits for each change:**
   ```bash
   git add src/public/expenses.html
   git commit -m "feat: personalize app for [yourname]"
   
   git add src/routes/dashboard.js
   git commit -m "feat: update dashboard title for [yourname]"
   
   git add package.json
   git commit -m "feat: update package metadata for [yourname]"
   ```

5. **Push your personalization branch:**
   ```bash
   git push origin feature/personalize-for-[yourname]
   ```

### Task 2: Complete the Dockerfile 🐳

Now for **Module 6 content** — You learned how to create Dockerfiles. Time to apply it!

**Where:** `docker/Dockerfile`

**What to do:** Follow the 8 tasks in the skeleton file. Use the guidance below:

#### Guidance: How to Write Your Dockerfile

**Step 1: Choose your base image**
Questions to ask yourself:
- What Node.js version did you test with? (Check `package.json` → `"engines"`)
- Do you want the smallest image (Alpine), balanced (slim), or full Debian?
- Examples: `node:18-alpine` (~170MB), `node:18-slim` (~400MB), `node:18` (~900MB)

**Recommendation:** For this project, use `node:18-alpine` (smallest, still has what we need)

**Module 6 Reminder:** Alpine Linux is a minimal base with Docker best practices embedded.

---

**Step 2: Set working directory**
- Where should your app live in the container?
- Common choice: `/app` (simple and clear)
- Instruction: `WORKDIR /app`

**Why:** ALL subsequent instructions run from this directory

---

**Step 3: Copy dependency files**
- Node.js uses `package.json` and `package-lock.json` to define dependencies
- Copy these BEFORE source code (Docker layer caching magic)
- Instruction: `COPY package*.json ./`

**Module 6 Reminder:** The `*` wildcard matches both `package.json` and `package-lock.json`

**Why copy early:** If source code changes, Docker rebuilds from here, not from npm install

---

**Step 4: Install dependencies**
- Which command? `npm install` or `npm ci`?
- In production images, use `npm ci` (reproducible from lock file)
- Instruction: `RUN npm ci --only=production`

**Module 6 Reminder:** `npm ci` is like `npm install` but uses exact versions from `package-lock.json`

**Why production only:** Dev dependencies (jest, nodemon) aren't needed in running container

---

**Step 5: Copy application source code**
- Now copy the src/ directory and other files
- Instruction: `COPY . .`

**Why after dependencies:** Source code changes frequently; npm install caches if unchanged

---

**Step 6: Expose port**
- What port does the Express app listen on?
- Check `src/server.js` → `PORT = process.env.PORT || 3000`
- Instruction: `EXPOSE 3000`

**Module 6 Reminder:** EXPOSE documents and enables port mapping, but doesn't actually open the port

---

**Step 7: Health check (optional but recommended)**
- How can Docker know if your app is healthy?
- Check if the app responds to HTTP requests
- Pattern:
  ```dockerfile
  HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
    CMD curl -f http://localhost:3000/health || exit 1
  ```

**Module 6 Reminder:** Health checks are used by Docker Compose to know when service is ready

---

**Step 8: Start the application**
- What command starts a Node.js app?
- Check `package.json` → `"start": "node src/server.js"`
- Instruction: `CMD ["node", "src/server.js"]` or `CMD ["npm", "start"]`

**Module 6 Reminder:** Use JSON array format `["cmd", "arg"]` for best practices

---

**Example completed Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD curl -f http://localhost:3000/health || exit 1
CMD ["npm", "start"]
```

---

### Task 3: Complete docker-compose.yml 🔗

Now for **Module 7 content** — You learned orchestration. Time to apply it!

**Where:** `docker/docker-compose.yml`

**What to do:** Follow the tasks in the skeleton file. Use the guidance below:

#### Guidance: How to Write Your docker-compose.yml

**Web Service Configuration:**

1. **Build section:**
   - Where is your Dockerfile? Path should be relative to docker-compose.yml location
   - Answer: `dockerfile: ./Dockerfile` (same directory)

2. **Container name:**
   - Should include your name for personalization
   - Example: `container_name: expense-tracker-jean-dupont`

3. **Ports:**
   - Format: `external:internal`
   - This app runs on port 3000, expose as 3000
   - Answer: `"3000:3000"`

4. **Environment variables:**
   - These tell your Node app how to connect to PostgreSQL
   - **CRITICAL:** DATABASE_URL must use service name `db`, not `localhost`
   - Example: `postgresql://postgres:password@db:5432/expense_tracker`

**Module 7 Reminder:** Service names become hostnames in Docker Compose. So `db` service is at `db:5432`

5. **depends_on:**
   - This web service depends on db service being healthy
   - Use: `depends_on: db: condition: service_healthy`

**Module 7 Reminder:** `service_healthy` ensures database is ready before app starts (prevents connection errors)

6. **restart:**
   - Keep the app alive if it crashes
   - Use: `restart: unless-stopped`

---

**Database Service Configuration:**

1. **Image:**
   - Use PostgreSQL 15 Alpine: `postgres:15-alpine`
   - Don't change this

2. **Environment variables:**
   - Set database name, password, user
   - Example:
     ```yaml
     POSTGRES_PASSWORD: password
     POSTGRES_DB: expense_tracker
     POSTGRES_USER: postgres
     ```

3. **Volumes:**
   - Persist database data across restarts
   - Use named volume: `db_data:/var/lib/postgresql/data`

**Module 7 Reminder:** Named volumes persist data; if not defined, data is lost on container restart

4. **Healthcheck:**
   - Tell Docker when database is ready
   - Use: `["CMD-SHELL", "pg_isready -U postgres"]`

5. **Networks:**
   - Put services on same network for communication
   - Use: `networks: - app_network`

---

**Volumes section (at root level):**
```yaml
volumes:
  db_data:
    driver: local
```

**Module 7 Reminder:** Define named volumes at root, then reference them in services

---

**Example completed docker-compose.yml:**
```yaml
version: '3.8'

services:
  web:
    build:
      context: ..
      dockerfile: ./docker/Dockerfile
    container_name: expense-tracker-jean-dupont
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://postgres:password@db:5432/expense_tracker
      DB_HOST: db
      DB_PORT: 5432
      DB_NAME: expense_tracker
      DB_USER: postgres
      DB_PASSWORD: password
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - app_network

  db:
    image: postgres:15-alpine
    container_name: expense-tracker-db
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: expense_tracker
      POSTGRES_USER: postgres
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
    networks:
      - app_network

volumes:
  db_data:
    driver: local

networks:
  app_network:
    driver: bridge
```

---

### Task 4: Test Your Docker Setup ✅

Once you've completed Dockerfile and docker-compose.yml:

```bash
# Validate YAML syntax
docker-compose config

# Start services
docker-compose up -d

# Check services are running
docker-compose ps
# OUTPUT: Both web and db should show "Up" and "healthy"

# Test health checks
docker-compose ps | grep healthy
# OUTPUT: Both services should show (healthy)

# Test app accessibility
curl http://localhost:3000/
# OUTPUT: HTML dashboard page

# Test database connectivity
curl http://localhost:3000/api/expenses
# OUTPUT: JSON array (emptor or with sample data)

# Add an expense (test POST)
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"description":"Test","amount":10,"category":"Food"}'
# OUTPUT: Created expense with ID

# View logs
docker-compose logs -f

# Stop services (keeping data)
docker-compose down

# Restart (verify data persists)
docker-compose up -d
curl http://localhost:3000/api/expenses
# OUTPUT: Expense should still be there!
```

---

## 📚 References

**Module 6 - Docker in Practice:**
- Read: `modules/module-6/2-lecture-notes.md` for Dockerfile concepts
- Review: `modules/module-6/3-lab-walkthrough.md` for working examples

**Module 7 - Docker Compose:**
- Read: `modules/module-7/2-lecture-notes.md` for Compose concepts
- Review: `modules/module-7/3-lab-walkthrough.md` for working examples

**Official Documentation:**
- Docker: https://docs.docker.com/engine/reference/builder/
- Docker Compose: https://docs.docker.com/compose/compose-file/

---

## 🚀 Project Structure

```
expense-tracker-nodejs/
├── src/
│   ├── server.js              # Express app entry point
│   ├── config/
│   │   └── database.js        # PostgreSQL configuration
│   ├── routes/
│   │   ├── dashboard.js       # GET / (main page)
│   │   └── expenses.js        # API endpoints
│   └── public/
│       ├── expenses.html      # Web form for expenses
│       └── css/
│           └── style.css      # Bootstrap styles
├── tests/
│   ├── server.test.js         # Server tests
│   ├── dashboard.test.js      # Dashboard tests
│   └── expenses.test.js       # API tests
├── docker/
│   ├── Dockerfile             # ✨ YOU COMPLETE THIS
│   └── docker-compose.yml     # ✨ YOU COMPLETE THIS
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions (completed)
├── package.json               # Node.js dependencies
├── jest.config.js             # Test configuration
└── README.md                  # This file
```

---

## 🔄 Git Workflow (Module 2 Reminder)

Follow feature branching:

```bash
# Create feature branch
git checkout -b feature/add-dockerfile

# Edit Dockerfile
# ... complete the tasks ...

# Commit
git add docker/Dockerfile
git commit -m "feat: complete Dockerfile with Alpine base"

# Create another feature branch for docker-compose
git checkout -b feature/add-docker-compose

# Edit docker-compose.yml
# ... complete the tasks ...

# Commit
git add docker/docker-compose.yml
git commit -m "feat: complete docker-compose with 2 services"

# Merge to main (after testing)
git checkout main
git merge feature/add-dockerfile
git merge feature/add-docker-compose
```

---

## 🐛 Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| `ECONNREFUSED localhost:5432` | App can't reach database | Check DATABASE_URL uses `db` not `localhost` |
| `unknown database "expense_tracker"` | Database name mismatch | Verify POSTGRES_DB matches DB_NAME |
| `Port 3000 already in use` | Another service on port | Change port mapping to `3001:3000` |
| `services don't start` | Invalid YAML | Run `docker-compose config` to check syntax |
| `permission denied while trying to connect` | Database access | Check POSTGRES_PASSWORD in docker-compose |
| `data lost after restart` | No volume persistence | Verify `db_data` volume is defined at root |

---

## ✨ Expected Outcome

After completing all tasks, you should have:

✅ Personal Git fork with 7+ commits  
✅ Completed Dockerfile (8 sections filled)  
✅ Completed docker-compose.yml (web + db configured)  
✅ GitHub Actions pipeline passing all tests  
✅ Docker image built and named with your name  
✅ Application running at http://localhost:3000 with your name  
✅ Dashboard showing expense metrics  
✅ Ability to add/view expenses  
✅ Database data persisting across restarts  

---

## 📝 Assessment

Your work will be evaluated on:

1. **Git history** — Clean commits with meaningful messages
2. **Dockerfile completeness** — All 8 tasks completed correctly
3. **docker-compose.yml completeness** — Services working together
4. **Tests passing** — GitHub Actions pipeline succeeds
5. **Application functionality** — App runs and handles requests
6. **Screenshots** — Proof of all steps for Quiz submission

---

**Version:** 1.0.0  
**Last Updated:** 2026-04-09  
**Module:** 8 - Synthesis & Integration  
**Technology:** Node.js + Express.js + PostgreSQL
