import CodeBlock from '../components/CodeBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox } from '../components/Section'

export default function DockerPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">🐳</div>
        <div>
          <h1>Docker</h1>
          <p>Docker packages your application and all its dependencies into a container — a lightweight, portable, self-sufficient unit that runs identically on any machine. Think of it as a Java JAR that includes its own JVM, OS libraries, and everything else it needs.</p>
          <div className="badges">
            <span className="badge green">Containerization</span>
            <span className="badge">OCI Standard</span>
            <span className="badge yellow">Immutable Images</span>
            <span className="badge purple">Layered Filesystem</span>
          </div>
        </div>
      </div>

      <Section num="1" title="Core Concepts">
        <table>
          <thead><tr><th>Concept</th><th>Description</th><th>Java Analogy</th></tr></thead>
          <tbody>
            <tr><td>Image</td><td>Read-only template: OS + runtime + app + deps</td><td>Class definition</td></tr>
            <tr><td>Container</td><td>Running instance of an image</td><td>Object instance</td></tr>
            <tr><td>Dockerfile</td><td>Recipe to build an image</td><td>Source code that compiles to a class</td></tr>
            <tr><td>Registry</td><td>Image storage (Docker Hub, ECR, GCR)</td><td>Maven Central / Nexus</td></tr>
            <tr><td>Volume</td><td>Persistent data outside the container</td><td>External storage / DB</td></tr>
            <tr><td>Network</td><td>Virtual network between containers</td><td>Service discovery / localhost</td></tr>
            <tr><td>Layer</td><td>Each Dockerfile instruction creates a layer</td><td>Incremental class loading</td></tr>
          </tbody>
        </table>
        <InfoBox>Containers share the host OS kernel — they are not VMs. A container starts in milliseconds, not minutes. On Linux, Docker containers use namespaces + cgroups for isolation.</InfoBox>
      </Section>

      <Section num="2" title="Dockerfile — Building Images">
        <Sub title="Basic Dockerfile">
          <CodeBlock language="dockerfile" code={`# Dockerfile for a Node.js app
FROM node:20-alpine          # base image (alpine = minimal Linux)

WORKDIR /app                 # set working directory inside container

# Copy dependency files first (layer caching optimization)
COPY package*.json ./
RUN npm ci --only=production  # install deps (cached if package.json unchanged)

# Copy application source
COPY . .

# Set environment variable
ENV NODE_ENV=production
ENV PORT=3000

# Expose port (documentation only — doesn't actually publish)
EXPOSE 3000

# Create non-root user (security best practice)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD wget -qO- http://localhost:3000/health || exit 1

# Command to run when container starts
CMD ["node", "server.js"]`} />
        </Sub>
        <Sub title="Multi-Stage Build — Smaller Images">
          <p>Multi-stage builds separate the build environment from the runtime environment — like having a fat JDK for compilation but only a slim JRE for production.</p>
          <CodeBlock language="dockerfile" code={`# Stage 1: Build (has all build tools)
FROM node:20 AS builder
WORKDIR /build
COPY package*.json ./
RUN npm ci                      # all devDependencies included
COPY . .
RUN npm run build               # compile TypeScript, bundle, etc.
RUN npm run test                # run tests in build stage

# Stage 2: Production (minimal, no build tools)
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /build/dist ./dist          # only compiled output
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package.json .

ENV NODE_ENV=production
USER node                        # run as non-root
CMD ["node", "dist/server.js"]
# Result: image is 150MB instead of 800MB

# Java multi-stage example
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /src
COPY pom.xml .
RUN mvn dependency:go-offline  # cache dependencies
COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /src/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]`} />
        </Sub>
        <Sub title=".dockerignore">
          <CodeBlock language="bash" code={`# .dockerignore — like .gitignore for Docker builds
node_modules
.git
.github
*.md
.env
.env.*
dist
coverage
*.test.js
Dockerfile*
docker-compose*`} />
        </Sub>
      </Section>

      <Section num="3" title="Essential Docker Commands">
        <CodeBlock language="bash" code={`# === Images ===
docker build -t myapp:1.0 .         # build image from Dockerfile in current dir
docker build -t myapp:1.0 -f Dockerfile.prod .  # specify Dockerfile
docker images                        # list local images
docker pull nginx:latest             # download image from registry
docker push myrepo/myapp:1.0         # push to registry
docker rmi myapp:1.0                 # remove image
docker image prune                   # remove unused images

# === Containers ===
docker run nginx                                   # run in foreground
docker run -d nginx                                # run in background (detached)
docker run -d -p 8080:80 nginx                     # map host:container port
docker run -d --name webserver -p 8080:80 nginx    # give container a name
docker run -e DB_HOST=localhost myapp              # set env variable
docker run -v $(pwd)/data:/app/data myapp          # mount volume
docker run --rm myapp                              # auto-remove when stopped
docker run -it ubuntu bash                         # interactive terminal

# List containers
docker ps                  # running only
docker ps -a               # all (including stopped)

# Manage containers
docker stop webserver      # graceful stop (SIGTERM)
docker kill webserver      # force kill (SIGKILL)
docker restart webserver
docker rm webserver        # remove stopped container
docker rm -f webserver     # force remove running container

# Inspect
docker logs webserver          # view stdout/stderr
docker logs -f webserver       # follow logs (tail -f)
docker exec -it webserver sh   # open shell in running container
docker inspect webserver       # full JSON metadata
docker stats                   # live CPU/memory usage

# Cleanup
docker system prune -a         # remove ALL unused resources`} />
      </Section>

      <Section num="4" title="Docker Compose — Multi-Container Apps">
        <p>Docker Compose defines a multi-service application in a single YAML file. One command starts everything. Like a Java application context that wires together all your beans.</p>
        <CodeBlock language="yaml" code={`# docker-compose.yml
version: '3.9'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: production          # multi-stage target
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGO_URL=mongodb://mongo:27017/myapp  # 'mongo' = service name = hostname
      - REDIS_URL=redis://redis:6379
    depends_on:
      mongo:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - ./logs:/app/logs            # bind mount for logs
    restart: unless-stopped
    networks:
      - app-network

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"               # only expose in dev!
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secret
    volumes:
      - mongo_data:/data/db         # named volume — persists data
      - ./mongo-init.js:/docker-entrypoint-initdb.d/init.js
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - api
    networks:
      - app-network

volumes:
  mongo_data:
  redis_data:

networks:
  app-network:
    driver: bridge`} />
        <Sub title="Compose Commands">
          <CodeBlock language="bash" code={`docker compose up              # start all services (foreground)
docker compose up -d           # start in background
docker compose up --build      # rebuild images before starting
docker compose down            # stop and remove containers
docker compose down -v         # also remove volumes
docker compose logs -f api     # follow logs for 'api' service
docker compose exec api sh     # shell into running api container
docker compose ps              # list services
docker compose scale api=3     # run 3 replicas of api
docker compose restart api     # restart a service`} />
        </Sub>
      </Section>

      <Section num="5" title="Volumes and Data Persistence">
        <CodeBlock language="bash" code={`# Named volume (managed by Docker, persists across containers)
docker volume create mydata
docker run -v mydata:/app/data myapp

# Bind mount (maps host directory)
docker run -v /host/path:/container/path myapp
docker run -v $(pwd):/app myapp           # current dir (dev mode)

# Read-only bind mount (security)
docker run -v $(pwd)/config:/app/config:ro myapp

# Inspect volumes
docker volume ls
docker volume inspect mydata

# Remove unused volumes
docker volume prune`} />
      </Section>

      <Section num="6" title="Networking">
        <CodeBlock language="bash" code={`# Docker creates a default bridge network
# Containers on same network can reach each other by service name (DNS)

# Create custom network
docker network create app-net

# Run containers on same network
docker run -d --name api --network app-net myapp
docker run -d --name db  --network app-net mongo

# api can reach db via hostname 'db' → mongo:27017

# Port publishing (-p)
docker run -p 8080:80 nginx       # host:container
docker run -p 127.0.0.1:8080:80 nginx  # bind to specific host IP

# List networks
docker network ls
docker network inspect app-net`} />
      </Section>

      <Section num="7" title="Best Practices">
        <table>
          <thead><tr><th>Practice</th><th>Why</th></tr></thead>
          <tbody>
            <tr><td>Use specific tags (not latest)</td><td>Reproducible builds — latest changes unexpectedly</td></tr>
            <tr><td>Run as non-root user</td><td>Security — limit damage if container is compromised</td></tr>
            <tr><td>Use multi-stage builds</td><td>Smaller images — less attack surface, faster pulls</td></tr>
            <tr><td>Use .dockerignore</td><td>Faster builds — don't send unnecessary files to build context</td></tr>
            <tr><td>One process per container</td><td>Easier scaling, logging, restarts</td></tr>
            <tr><td>COPY package*.json before COPY . .</td><td>Layer caching — npm install cached unless package.json changes</td></tr>
            <tr><td>Use HEALTHCHECK</td><td>Orchestrators know when container is ready/unhealthy</td></tr>
            <tr><td>Don't store secrets in images</td><td>Images are shareable — use env vars or secrets managers</td></tr>
            <tr><td>Keep images small (Alpine base)</td><td>Faster pull times, smaller attack surface</td></tr>
          </tbody>
        </table>
      </Section>
    </div>
  )
}
