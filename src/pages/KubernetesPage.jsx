import CodeBlock from '../components/CodeBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox } from '../components/Section'

export default function KubernetesPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">☸️</div>
        <div>
          <h1>Kubernetes</h1>
          <p>The container orchestration platform — it takes your Docker containers and runs them at scale, handles failures, load balances traffic, and automates deployments. Think of it as a "distributed Java Spring context" that manages containers instead of beans.</p>
          <div className="badges">
            <span className="badge green">Container Orchestration</span>
            <span className="badge">Self-healing</span>
            <span className="badge yellow">Declarative Config</span>
            <span className="badge purple">CNCF Standard</span>
          </div>
        </div>
      </div>

      <Section num="1" title="Architecture Overview">
        <table>
          <thead><tr><th>Component</th><th>Role</th><th>Analogy</th></tr></thead>
          <tbody>
            <tr><td>Cluster</td><td>All nodes managed together</td><td>The entire data center</td></tr>
            <tr><td>Node</td><td>A physical/virtual machine</td><td>A server</td></tr>
            <tr><td>Control Plane</td><td>Manages the cluster (API server, scheduler, etcd)</td><td>Operations team</td></tr>
            <tr><td>Pod</td><td>Smallest deployable unit — wraps 1+ containers</td><td>A running Java process</td></tr>
            <tr><td>Deployment</td><td>Manages replicas, rolling updates</td><td>Spring Boot app config</td></tr>
            <tr><td>Service</td><td>Stable network endpoint for a set of pods</td><td>Load balancer / DNS entry</td></tr>
            <tr><td>Ingress</td><td>HTTP routing rules (host/path → service)</td><td>Nginx reverse proxy config</td></tr>
            <tr><td>ConfigMap</td><td>Non-secret config data</td><td>application.properties</td></tr>
            <tr><td>Secret</td><td>Sensitive data (passwords, tokens)</td><td>Vault / environment vars</td></tr>
            <tr><td>Namespace</td><td>Virtual cluster partitioning</td><td>Java packages / modules</td></tr>
            <tr><td>PersistentVolume</td><td>Cluster-wide storage resource</td><td>Network-attached disk</td></tr>
          </tbody>
        </table>
        <InfoBox>Kubernetes is declarative: you describe the desired state in YAML, and Kubernetes constantly works to make reality match your description. If a pod crashes, K8s restarts it.</InfoBox>
      </Section>

      <Section num="2" title="Pod — The Basic Unit">
        <CodeBlock language="yaml" code={`# pod.yaml — rarely created directly; use Deployments instead
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  namespace: default
  labels:
    app: myapp        # labels are key for selectors
    version: "1.0"
spec:
  containers:
    - name: myapp
      image: myrepo/myapp:1.0
      ports:
        - containerPort: 3000
      env:
        - name: NODE_ENV
          value: "production"
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:           # reference a Secret
              name: db-secret
              key: password
      resources:
        requests:
          memory: "64Mi"
          cpu: "100m"               # 100 millicores = 0.1 CPU core
        limits:
          memory: "128Mi"
          cpu: "500m"
      livenessProbe:                # restart pod if this fails
        httpGet:
          path: /health
          port: 3000
        initialDelaySeconds: 10
        periodSeconds: 30
      readinessProbe:               # only send traffic when ready
        httpGet:
          path: /ready
          port: 3000
        initialDelaySeconds: 5
        periodSeconds: 10
  restartPolicy: Always`} />
      </Section>

      <Section num="3" title="Deployment — Managing Replicas">
        <CodeBlock language="yaml" code={`# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deployment
  namespace: production
spec:
  replicas: 3                         # run 3 instances
  selector:
    matchLabels:
      app: myapp                      # manage pods with this label
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1                     # max extra pods during update
      maxUnavailable: 0               # 0 downtime during update
  template:                           # pod template
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: myrepo/myapp:1.2     # update this to deploy new version
          ports:
            - containerPort: 3000
          envFrom:
            - configMapRef:
                name: myapp-config    # load all keys from ConfigMap
            - secretRef:
                name: myapp-secrets
          resources:
            requests: { memory: "128Mi", cpu: "100m" }
            limits:   { memory: "256Mi", cpu: "500m" }
          readinessProbe:
            httpGet: { path: /ready, port: 3000 }
          livenessProbe:
            httpGet: { path: /health, port: 3000 }
      affinity:
        podAntiAffinity:             # spread pods across nodes
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchLabels: { app: myapp }
                topologyKey: kubernetes.io/hostname`} />
      </Section>

      <Section num="4" title="Service — Networking">
        <CodeBlock language="yaml" code={`# ClusterIP — internal traffic only (default)
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  type: ClusterIP
  selector:
    app: myapp                       # routes to pods with this label
  ports:
    - port: 80                       # service port
      targetPort: 3000               # pod port

---
# NodePort — exposes on each node's IP:port (dev/testing)
apiVersion: v1
kind: Service
metadata:
  name: myapp-nodeport
spec:
  type: NodePort
  selector:
    app: myapp
  ports:
    - port: 80
      targetPort: 3000
      nodePort: 30080                # 30000-32767 range

---
# LoadBalancer — provisions cloud load balancer (production)
apiVersion: v1
kind: Service
metadata:
  name: myapp-lb
spec:
  type: LoadBalancer
  selector:
    app: myapp
  ports:
    - port: 80
      targetPort: 3000`} />
      </Section>

      <Section num="5" title="Ingress — HTTP Routing">
        <CodeBlock language="yaml" code={`# ingress.yaml — requires an Ingress Controller (nginx-ingress, traefik, etc.)
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - myapp.example.com
      secretName: myapp-tls           # cert-manager creates this
  rules:
    - host: myapp.example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-service
                port: { number: 80 }
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port: { number: 80 }`} />
      </Section>

      <Section num="6" title="ConfigMap and Secrets">
        <CodeBlock language="yaml" code={`# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: myapp-config
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  DB_HOST: "mongo-service"
  DB_PORT: "27017"
  # Multi-line config file
  nginx.conf: |
    server {
      listen 80;
      location / { proxy_pass http://backend; }
    }

---
# secret.yaml (values must be base64 encoded)
# echo -n "mysecret" | base64
apiVersion: v1
kind: Secret
metadata:
  name: myapp-secrets
type: Opaque
data:
  DB_PASSWORD: bXlzZWNyZXQ=    # base64("mysecret")
  JWT_SECRET: c3VwZXJzZWNyZXQ= # base64("supersecret")
stringData:                     # auto base64-encodes
  API_KEY: "raw-value-here"`} />
        <WarnBox>Kubernetes Secrets are only base64-encoded, NOT encrypted by default. Use <strong>Sealed Secrets</strong>, <strong>External Secrets Operator</strong>, or <strong>HashiCorp Vault</strong> for real security.</WarnBox>
      </Section>

      <Section num="7" title="kubectl — Essential Commands">
        <CodeBlock language="bash" code={`# === Apply / Create ===
kubectl apply -f deployment.yaml       # create or update
kubectl apply -f ./k8s/                # apply all YAMLs in directory
kubectl delete -f deployment.yaml

# === View Resources ===
kubectl get pods                        # list pods
kubectl get pods -n production          # in namespace
kubectl get pods -o wide                # more details (node, IP)
kubectl get all                         # all resources
kubectl get deploy,svc,ingress          # multiple types

# === Inspect ===
kubectl describe pod myapp-pod-abc123   # detailed info + events
kubectl describe deploy myapp-deployment
kubectl logs myapp-pod-abc123           # stdout/stderr
kubectl logs -f myapp-pod-abc123        # follow
kubectl logs --previous myapp-pod       # logs from crashed container

# === Execute in Pod ===
kubectl exec -it myapp-pod-abc123 -- bash
kubectl exec myapp-pod -- env           # print env vars

# === Deployments ===
kubectl rollout status deploy/myapp-deployment
kubectl rollout history deploy/myapp-deployment
kubectl rollout undo deploy/myapp-deployment       # rollback!
kubectl set image deploy/myapp myapp=myrepo/myapp:1.3  # deploy new version
kubectl scale deploy/myapp --replicas=5

# === Port Forwarding (dev) ===
kubectl port-forward pod/myapp-pod 8080:3000
kubectl port-forward svc/myapp-service 8080:80

# === Namespace ===
kubectl create namespace staging
kubectl config set-context --current --namespace=staging
kubectl get pods --all-namespaces

# === Context (switch clusters) ===
kubectl config get-contexts
kubectl config use-context my-cluster`} />
      </Section>

      <Section num="8" title="Horizontal Pod Autoscaler">
        <CodeBlock language="yaml" code={`# hpa.yaml — auto-scale based on CPU/memory
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp-deployment
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70    # scale up when CPU > 70%
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80`} />
      </Section>

      <Section num="9" title="Helm — Package Manager for Kubernetes">
        <TipBox>Helm is to Kubernetes what Maven/Gradle is to Java — it packages Kubernetes YAML into reusable "charts" with configurable values.</TipBox>
        <CodeBlock language="bash" code={`# Install Helm
brew install helm

# Add repositories
helm repo add stable https://charts.helm.sh/stable
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Search and install
helm search repo nginx
helm install my-nginx bitnami/nginx --namespace web

# Install with custom values
helm install myapp ./chart/ -f values-production.yaml

# Upgrade
helm upgrade myapp ./chart/ -f values-production.yaml --atomic

# Rollback
helm rollback myapp 1   # rollback to revision 1

# List and uninstall
helm list -A            # all releases all namespaces
helm uninstall myapp`} />
        <Sub title="Helm Chart Structure">
          <CodeBlock language="bash" code={`myapp-chart/
├── Chart.yaml          # chart metadata (name, version, description)
├── values.yaml         # default configuration values
├── templates/
│   ├── deployment.yaml  # uses {{ .Values.image }} templating
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   └── hpa.yaml
└── charts/             # sub-charts (dependencies)`} />
        </Sub>
      </Section>

      <Section num="10" title="Real-World Deployment Flow">
        <CodeBlock language="bash" code={`# 1. Build and push Docker image (in CI/CD)
docker build -t myrepo/myapp:$GIT_SHA .
docker push myrepo/myapp:$GIT_SHA

# 2. Update image in deployment (GitOps: update values.yaml)
# values.yaml: image.tag: abc1234

# 3. Apply / Helm upgrade
helm upgrade myapp ./chart \\
  --set image.tag=$GIT_SHA \\
  --set replicas=3 \\
  --atomic \\              # rollback if upgrade fails
  --timeout 5m \\
  -n production

# 4. Watch rollout
kubectl rollout status deploy/myapp -n production

# 5. Verify
kubectl get pods -n production
kubectl logs -l app=myapp -n production --tail=50

# 6. If something is wrong:
kubectl rollout undo deploy/myapp -n production`} />
      </Section>
    </div>
  )
}
