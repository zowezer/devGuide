import CodeBlock from '../components/CodeBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox, DangerBox } from '../components/Section'

const sections = [
  'Core Concepts — The Git Object Model',
  'Setup and Basic Workflow',
  'Branching and Merging',
  'Remote Repositories',
  'Undoing and Fixing Things',
  'Viewing History',
  'Tags and Releases',
  'GitHub Flow — Team Workflow',
  'Useful Git Configuration',
  'Resolving Merge Conflicts',
  'CI/CD — GitHub Actions',
  'CI/CD — GitLab CI',
  'CI/CD Patterns and Best Practices',
]

export default function GitPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">🌿</div>
        <div>
          <h1>Git</h1>
          <p>The distributed version control system. Git tracks every change to your codebase, enables parallel feature development via branches, and lets teams collaborate without overwriting each other. Understanding Git's internals (not just the commands) will prevent you from ever "losing" code again.</p>
          <div className="badges">
            <span className="badge green">Distributed VCS</span>
            <span className="badge">Snapshot-based</span>
            <span className="badge yellow">DAG History</span>
            <span className="badge purple">Content-addressable</span>
          </div>
        </div>
      </div>

      <div className="toc">
        <div className="toc-title">Contents</div>
        <ul>
          {sections.map((t, i) => (
            <li key={t}><a href={`#s${i + 1}`}>{i + 1}. {t}</a></li>
          ))}
        </ul>
      </div>

      <Section num="1" title="Core Concepts — The Git Object Model">
        <InfoBox>Git stores snapshots (not diffs). Every commit is a full snapshot of all tracked files. Git identifies every object (blob, tree, commit, tag) by its SHA-1 hash — the hash IS the content.</InfoBox>
        <table>
          <thead><tr><th>Object</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>blob</td><td>File contents (no name — that's in the tree)</td></tr>
            <tr><td>tree</td><td>Directory: maps filenames to blobs/trees</td></tr>
            <tr><td>commit</td><td>Points to a tree + parent commits + metadata</td></tr>
            <tr><td>tag</td><td>Named pointer to a commit (annotated tags also store metadata)</td></tr>
            <tr><td>ref/branch</td><td>Named pointer to a commit (mutable)</td></tr>
            <tr><td>HEAD</td><td>Pointer to the current branch (or commit in detached state)</td></tr>
          </tbody>
        </table>
        <CodeBlock language="bash" code={`# The three areas
#  Working Tree → Staging Area (Index) → Repository (.git/)
#   (your files)   (git add)              (git commit)

# Visualize what's in Git
git cat-file -t HEAD        # type: commit
git cat-file -p HEAD        # print commit object
git ls-tree HEAD            # list files in this commit
git log --oneline --graph --all  # visual branch graph`} />
      </Section>

      <Section num="2" title="Setup and Basic Workflow">
        <CodeBlock language="bash" code={`# === One-time setup ===
git config --global user.name "Alice"
git config --global user.email "alice@example.com"
git config --global core.editor "code --wait"   # VS Code as editor
git config --global init.defaultBranch main
git config --list                                # view all config

# === Initialize ===
git init                    # create new repo
git clone https://github.com/user/repo.git      # clone existing
git clone repo newname      # clone into specific dir

# === The basic cycle ===
git status                  # see what changed
git diff                    # what changed (unstaged)
git diff --staged           # what's in staging area

git add file.txt            # stage specific file
git add .                   # stage everything
git add -p                  # interactively stage hunks (powerful!)

git commit -m "Add user authentication"
git commit --amend          # fix last commit message (before push)
git commit --amend --no-edit  # add staged changes to last commit

git push origin main        # push to remote
git pull                    # fetch + merge
git fetch                   # fetch without merging`} />
      </Section>

      <Section num="3" title="Branching and Merging">
        <CodeBlock language="bash" code={`# === Branches ===
git branch                   # list local branches
git branch -a                # list all (including remote)
git branch feature/login     # create branch
git checkout feature/login   # switch to branch
git checkout -b feature/login # create + switch (shortcut)
git switch feature/login     # modern way (git 2.23+)
git switch -c feature/login  # create + switch (modern)

# Delete branches
git branch -d feature/done   # delete merged branch
git branch -D feature/bad    # force delete unmerged

# === Merging ===
git checkout main
git merge feature/login       # merge (creates merge commit if needed)
git merge --ff-only feature   # only merge if fast-forward possible
git merge --no-ff feature     # always create merge commit (clear history)

# === Rebase — rewrite history ===
# Instead of merging, replay your commits on top of main
git checkout feature/login
git rebase main              # "I want feature/login on top of main"

# Interactive rebase — squash, reorder, edit commits
git rebase -i HEAD~3         # edit last 3 commits
# Commands: pick, reword, edit, squash, fixup, drop`} />
        <Sub title="Merge vs Rebase">
          <InfoBox><strong>Merge</strong> preserves the exact history of when branches diverged — good for shared branches. <strong>Rebase</strong> creates a linear history — good for local feature branches before pushing. Never rebase shared/public branches.</InfoBox>
        </Sub>
      </Section>

      <Section num="4" title="Remote Repositories">
        <CodeBlock language="bash" code={`# === Remote management ===
git remote -v                         # list remotes
git remote add origin https://github.com/user/repo.git
git remote set-url origin new-url     # change URL
git remote remove upstream

# === Push and pull ===
git push origin main                  # push local main to remote
git push -u origin feature/login      # push + set upstream tracking
git push --force-with-lease           # safer force push (won't overwrite others' work)
git push origin :feature/old          # delete remote branch
git push origin --delete feature/old  # same, explicit

git pull origin main                  # fetch + merge
git pull --rebase origin main         # fetch + rebase (cleaner)

# === Fetch and track ===
git fetch origin                      # get all remote changes
git fetch --prune                     # fetch + remove stale remote refs
git checkout -b feature/x origin/feature/x  # checkout remote branch locally`} />
      </Section>

      <Section num="5" title="Undoing and Fixing Things">
        <DangerBox>Operations that rewrite history (<code>reset --hard</code>, <code>rebase</code>, force push) can lose work if not careful. Check <code>git reflog</code> to recover — Git keeps everything for 30 days.</DangerBox>
        <CodeBlock language="bash" code={`# === Undo unstaged changes ===
git checkout -- file.txt        # discard unstaged changes in file
git restore file.txt            # modern (git 2.23+)
git clean -fd                   # remove untracked files and dirs

# === Undo staged changes ===
git reset HEAD file.txt         # unstage file (keep changes in working tree)
git restore --staged file.txt   # modern equivalent

# === Undo commits ===
git revert abc1234              # create new commit that undoes abc1234 (safe!)
git revert HEAD~2..HEAD         # revert last 2 commits

git reset HEAD~1                # undo last commit, keep changes staged
git reset --soft HEAD~1         # undo commit, keep changes staged
git reset --mixed HEAD~1        # undo commit, unstage changes (default)
git reset --hard HEAD~1         # DISCARD last commit and all changes ⚠️

# === Recover from mistakes ===
git reflog                      # show ALL recent HEAD positions
git reset --hard HEAD@{3}       # go back to 3 moves ago
git cherry-pick abc1234         # apply a specific commit from another branch

# === Stash — temporarily save work ===
git stash                       # save dirty state
git stash push -m "WIP: auth"   # with description
git stash list                  # list stashes
git stash pop                   # apply last stash + remove it
git stash apply stash@{2}       # apply specific stash (keep it)
git stash drop stash@{0}        # discard stash
git stash branch feature/new    # create branch from stash`} />
      </Section>

      <Section num="6" title="Viewing History">
        <CodeBlock language="bash" code={`# === Log ===
git log                           # full log
git log --oneline                 # compact: hash + message
git log --oneline --graph --all   # visual branch graph
git log --author="Alice"          # filter by author
git log --since="2 weeks ago"
git log --until="2024-01-01"
git log -- src/auth.js            # commits affecting a file
git log -p                        # show diffs
git log -S "function login"       # search for string in diffs (pickaxe)
git log --grep="fix"              # search commit messages

# === Diff ===
git diff                          # unstaged changes
git diff --staged                 # staged changes (vs last commit)
git diff main..feature            # between branches
git diff HEAD~3..HEAD             # last 3 commits

# === Blame ===
git blame file.js                 # who changed each line and when
git blame -L 10,20 file.js        # lines 10-20 only

# === Show ===
git show abc1234                  # commit details + diff
git show HEAD:src/app.js          # file at a specific commit
git show HEAD~2:README.md`} />
      </Section>

      <Section num="7" title="Tags and Releases">
        <CodeBlock language="bash" code={`# Lightweight tag (just a pointer)
git tag v1.0.0
git tag v1.0.0 abc1234           # tag a specific commit

# Annotated tag (has message, tagger, date — use for releases)
git tag -a v1.0.0 -m "Release version 1.0.0"

# List and push tags
git tag -l "v1.*"                # list matching tags
git push origin v1.0.0           # push single tag
git push origin --tags           # push all tags
git push origin --follow-tags    # push commits + annotated tags

# Delete
git tag -d v1.0.0                # delete local tag
git push origin :refs/tags/v1.0.0  # delete remote tag`} />
      </Section>

      <Section num="8" title="GitHub Flow — Team Workflow">
        <CodeBlock language="bash" code={`# 1. Create feature branch from main
git switch main
git pull origin main
git switch -c feature/user-auth

# 2. Develop — small, focused commits
git add -p                           # stage carefully
git commit -m "feat: add JWT token generation"
git commit -m "test: add auth endpoint tests"
git commit -m "docs: update API documentation"

# 3. Keep branch up to date with main
git fetch origin
git rebase origin/main              # stay current

# 4. Push and open Pull Request
git push -u origin feature/user-auth
# GitHub: create PR, request review

# 5. Address review feedback
git add file.js
git commit -m "fix: address review comments"
git push

# 6. Merge via PR (or squash merge for clean history)

# 7. Clean up
git switch main
git pull origin main
git branch -d feature/user-auth
git fetch --prune                   # clean remote tracking refs`} />
      </Section>

      <Section num="9" title="Useful Git Configuration">
        <CodeBlock language="bash" code={`# ~/.gitconfig
[alias]
    st  = status
    co  = checkout
    br  = branch
    lg  = log --oneline --graph --all --decorate
    undo = reset --soft HEAD~1
    wip  = commit -am "WIP: work in progress"

[core]
    autocrlf = input       # LF on commit (macOS/Linux)
    whitespace = fix

[pull]
    rebase = true           # pull --rebase by default

[merge]
    tool = vscode
    conflictstyle = diff3  # show original + both sides in conflicts

[push]
    default = current       # push to same-name remote branch

# .gitignore best practices
# Global gitignore (applies to all repos)
git config --global core.excludesfile ~/.gitignore_global

# .gitignore entries
node_modules/
.env
.env.*
dist/
build/
*.log
.DS_Store
*.pyc
__pycache__/
.idea/
.vscode/
*.class
target/`} />
      </Section>

      <Section num="10" title="Resolving Merge Conflicts">
        <CodeBlock language="bash" code={`# Conflict markers in a file:
# <<<<<<< HEAD
# current branch version
# =======
# incoming branch version
# >>>>>>> feature/auth

# Step 1: See which files conflict
git status    # shows "both modified: file.js"

# Step 2: Resolve manually (or use tool)
git mergetool                    # visual diff tool
code file.js                     # edit conflict markers

# Step 3: Mark resolved
git add file.js                  # mark as resolved
git merge --continue             # continue merge (or rebase --continue)

# Step 4: Verify
git status
git log --oneline -5

# Abort if it's too messy
git merge --abort                # abandon merge
git rebase --abort               # abandon rebase`} />
      </Section>

      <Section num="11" title="CI/CD — GitHub Actions">
        <InfoBox>GitHub Actions runs automated workflows triggered by Git events (push, PR, schedule). Workflows live in <code>.github/workflows/*.yml</code> and are version-controlled alongside your code.</InfoBox>
        <Sub title="Core Concepts">
          <table>
            <thead><tr><th>Term</th><th>Meaning</th></tr></thead>
            <tbody>
              <tr><td>Workflow</td><td>A YAML file — one or more jobs triggered by events</td></tr>
              <tr><td>Event</td><td>What triggers the workflow: push, pull_request, schedule, workflow_dispatch...</td></tr>
              <tr><td>Job</td><td>A set of steps that run on the same runner (VM)</td></tr>
              <tr><td>Step</td><td>A single shell command or Action</td></tr>
              <tr><td>Action</td><td>Reusable unit from the Marketplace (e.g. actions/checkout)</td></tr>
              <tr><td>Runner</td><td>The VM that executes jobs: ubuntu-latest, windows-latest, macos-latest</td></tr>
              <tr><td>Secret</td><td>Encrypted variable stored in repo/org settings, injected at runtime</td></tr>
              <tr><td>Artifact</td><td>Files produced by a job, uploadable and downloadable between jobs</td></tr>
            </tbody>
          </table>
        </Sub>
        <Sub title="Basic Node.js CI Workflow">
          <CodeBlock language="yaml" code={`# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]   # test against 3 versions

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js \${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: 'npm'           # cache node_modules between runs

      - name: Install dependencies
        run: npm ci              # ci = clean install, never updates package-lock.json

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          token: \${{ secrets.CODECOV_TOKEN }}`} />
        </Sub>
        <Sub title="Build and Deploy Workflow">
          <CodeBlock language="yaml" code={`# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: \${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: \${{ env.REGISTRY }}
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}   # auto-provided, no setup needed

      - name: Extract metadata for Docker
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix=sha-
            type=raw,value=latest,enable=\${{ github.ref == 'refs/heads/main' }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: \${{ steps.meta.outputs.tags }}
          labels: \${{ steps.meta.outputs.labels }}
          cache-from: type=gha      # GitHub Actions cache
          cache-to: type=gha,mode=max

  deploy:
    needs: build-and-push     # runs only after build succeeds
    runs-on: ubuntu-latest
    environment: production   # requires manual approval if configured

    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: \${{ secrets.DEPLOY_HOST }}
          username: \${{ secrets.DEPLOY_USER }}
          key: \${{ secrets.DEPLOY_SSH_KEY }}
          script: |
            docker pull \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:latest
            docker stop myapp || true
            docker run -d --name myapp --restart unless-stopped \\
              -p 3000:3000 \\
              -e DATABASE_URL=\${{ secrets.DATABASE_URL }} \\
              \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:latest`} />
        </Sub>
        <Sub title="Scheduled Jobs and Workflow Dispatch">
          <CodeBlock language="yaml" code={`# Scheduled workflow (cron)
on:
  schedule:
    - cron: '0 2 * * 1'   # every Monday at 02:00 UTC
  workflow_dispatch:        # allow manual trigger from GitHub UI
    inputs:
      environment:
        description: 'Target environment'
        required: true
        default: 'staging'
        type: choice
        options: [staging, production]

jobs:
  weekly-report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: python scripts/generate_report.py
        env:
          TARGET_ENV: \${{ inputs.environment || 'staging' }}`} />
        </Sub>
        <Sub title="Reusable Workflows">
          <CodeBlock language="yaml" code={`# .github/workflows/reusable-test.yml — define once, call from many workflows
on:
  workflow_call:
    inputs:
      node-version:
        required: false
        type: string
        default: '20'
    secrets:
      NPM_TOKEN:
        required: true

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ inputs.node-version }}
      - run: npm ci
        env:
          NODE_AUTH_TOKEN: \${{ secrets.NPM_TOKEN }}
      - run: npm test

# ── Caller workflow ──────────────────────────────────
# .github/workflows/ci.yml
jobs:
  call-test:
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: '22'
    secrets:
      NPM_TOKEN: \${{ secrets.NPM_TOKEN }}`} />
        </Sub>
      </Section>

      <Section num="12" title="CI/CD — GitLab CI">
        <InfoBox>GitLab CI uses a single <code>.gitlab-ci.yml</code> at the repo root. Stages run sequentially; jobs within a stage run in parallel. GitLab includes a built-in container registry, artifact storage, and environment tracking.</InfoBox>
        <Sub title="Basic Pipeline">
          <CodeBlock language="yaml" code={`# .gitlab-ci.yml
image: node:20-alpine    # default Docker image for all jobs

stages:
  - install
  - lint
  - test
  - build
  - deploy

variables:
  NODE_ENV: test
  FF_USE_FASTZIP: "true"   # speed up artifact transfer

cache:
  key:
    files:
      - package-lock.json   # invalidate cache when lockfile changes
  paths:
    - node_modules/

install:
  stage: install
  script:
    - npm ci

lint:
  stage: lint
  script:
    - npm run lint

test:
  stage: test
  script:
    - npm test -- --coverage
  coverage: '/Lines\s*:\s*(\d+\.?\d*)%/'   # extract coverage %
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
    expire_in: 1 week

build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour`} />
        </Sub>
        <Sub title="Docker Build and Deploy">
          <CodeBlock language="yaml" code={`build-image:
  stage: build
  image: docker:24
  services:
    - docker:24-dind    # Docker-in-Docker
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  before_script:
    - docker login -u \$CI_REGISTRY_USER -p \$CI_REGISTRY_PASSWORD \$CI_REGISTRY
  script:
    - docker build -t \$CI_REGISTRY_IMAGE:\$CI_COMMIT_SHORT_SHA .
    - docker tag  \$CI_REGISTRY_IMAGE:\$CI_COMMIT_SHORT_SHA \$CI_REGISTRY_IMAGE:latest
    - docker push \$CI_REGISTRY_IMAGE:\$CI_COMMIT_SHORT_SHA
    - docker push \$CI_REGISTRY_IMAGE:latest
  only:
    - main

deploy-staging:
  stage: deploy
  image: alpine
  environment:
    name: staging
    url: https://staging.example.com
  before_script:
    - apk add --no-cache openssh-client
    - eval \$(ssh-agent -s)
    - echo "\$DEPLOY_KEY" | ssh-add -
  script:
    - ssh deploy@staging.example.com "
        docker pull \$CI_REGISTRY_IMAGE:latest &&
        docker-compose up -d --no-deps --build app"
  only:
    - main

deploy-production:
  stage: deploy
  environment:
    name: production
    url: https://example.com
  when: manual      # requires a human click in GitLab UI
  only:
    - tags          # only deploy tagged releases`} />
        </Sub>
        <Sub title="Rules, Includes, and Templates">
          <CodeBlock language="yaml" code={`# Conditional job execution with rules:
test-e2e:
  script: npm run test:e2e
  rules:
    - if: \$CI_PIPELINE_SOURCE == "merge_request_event"
    - if: \$CI_COMMIT_BRANCH == "main"
    - when: never    # skip in all other cases

# Reusable job templates via YAML anchors
.node-job: &node-job
  image: node:20
  cache:
    paths: [node_modules/]
  before_script:
    - npm ci

lint:
  <<: *node-job    # merge template
  script: npm run lint

test:
  <<: *node-job
  script: npm test

# Include shared templates from another file or URL
include:
  - local: '.gitlab/ci-templates.yml'
  - project: 'mygroup/shared-ci'
    file: '/templates/docker.yml'`} />
        </Sub>
      </Section>

      <Section num="13" title="CI/CD Patterns and Best Practices">
        <Sub title="Conventional Commits + Semantic Versioning">
          <InfoBox>Conventional Commits give your git history machine-readable structure. Tools like <code>semantic-release</code> parse them to automatically bump versions and generate changelogs.</InfoBox>
          <CodeBlock language="bash" code={`# Conventional Commit format:
# <type>(<scope>): <description>
#
# Types:
#   feat     → new feature           → bumps MINOR version (1.0.0 → 1.1.0)
#   fix      → bug fix               → bumps PATCH version (1.0.0 → 1.0.1)
#   docs     → documentation only
#   style    → formatting, no logic change
#   refactor → neither fix nor feature
#   test     → adding/fixing tests
#   chore    → build, deps, tooling
#   BREAKING CHANGE in footer        → bumps MAJOR version (1.0.0 → 2.0.0)

# Good examples:
git commit -m "feat(auth): add OAuth2 Google login"
git commit -m "fix(api): handle null response from payment service"
git commit -m "feat!: remove deprecated /v1 endpoints"  # ! = breaking

# Bad examples (not parseable):
git commit -m "stuff"
git commit -m "fixed things"
git commit -m "WIP"`} />
          <CodeBlock language="yaml" code={`# .github/workflows/release.yml — automated versioning with semantic-release
name: Release
on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      issues: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0        # need full history for version calculation
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npx semantic-release
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: \${{ secrets.NPM_TOKEN }}`} />
        </Sub>
        <Sub title="Branch Protection and Required Checks">
          <CodeBlock language="bash" code={`# GitHub branch protection rules (set in repo Settings > Branches):
# ✅ Require pull request before merging
# ✅ Require approvals: 1 (or 2 for critical repos)
# ✅ Require status checks to pass before merging:
#       - ci/test (your GitHub Actions job name)
#       - ci/lint
#       - codecov/patch
# ✅ Require branches to be up to date before merging
# ✅ Require conversation resolution before merging
# ✅ Do not allow bypassing the above settings

# Enforce with GitHub CLI:
gh api repos/:owner/:repo/branches/main/protection \\
  --method PUT \\
  --field required_status_checks='{"strict":true,"contexts":["ci/test"]}' \\
  --field enforce_admins=true \\
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \\
  --field restrictions=null`} />
        </Sub>
        <Sub title="Secrets Management">
          <CodeBlock language="bash" code={`# Store secrets via GitHub CLI (never commit secrets to git!)
gh secret set DATABASE_URL --body "postgres://user:pass@host/db"
gh secret set NPM_TOKEN < ~/.npmrc-token

# In workflows — secrets are masked in logs:
- run: echo "token=\${{ secrets.NPM_TOKEN }}"  # will print "token=***"

# Environment secrets (scoped to production/staging environments):
# Settings > Environments > production > Add secret
# Reference:
env:
  API_KEY: \${{ secrets.API_KEY }}   # from environment, not repo

# Use OIDC to avoid long-lived credentials (AWS example):
- name: Configure AWS credentials via OIDC
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789:role/GitHubActionsRole
    aws-region: us-east-1
    # No static keys needed — GitHub mints a short-lived token`} />
        </Sub>
        <Sub title="Caching and Artifacts">
          <CodeBlock language="yaml" code={`# Cache dependencies between runs (speeds up CI 2-5x)
- uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      ~/.cache/pip
    key: \${{ runner.os }}-deps-\${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      \${{ runner.os }}-deps-

# Upload build artifacts (share between jobs or download)
- uses: actions/upload-artifact@v4
  with:
    name: build-output
    path: dist/
    retention-days: 7

# Download in a later job:
- uses: actions/download-artifact@v4
  with:
    name: build-output
    path: dist/`} />
        </Sub>
        <Sub title="Matrix Builds and Parallelism">
          <CodeBlock language="yaml" code={`# Run tests on multiple OS, language versions, or shards in parallel
strategy:
  fail-fast: false    # don't cancel other matrix jobs if one fails
  matrix:
    os: [ubuntu-latest, macos-latest, windows-latest]
    python: ['3.10', '3.11', '3.12']
    exclude:
      - os: windows-latest
        python: '3.10'   # skip this specific combination

# Split slow test suite into parallel shards
strategy:
  matrix:
    shard: [1, 2, 3, 4]

steps:
  - run: npx jest --shard=\${{ matrix.shard }}/4   # each runner handles 1/4 of tests`} />
        </Sub>
        <Sub title="Self-hosted Runners">
          <CodeBlock language="bash" code={`# Use your own hardware for CI (faster, free minutes, access to private network)
# On GitHub: Settings > Actions > Runners > New self-hosted runner

# On your server (Linux example):
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.319.0.tar.gz -L \\
  https://github.com/actions/runner/releases/download/v2.319.0/actions-runner-linux-x64-2.319.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.319.0.tar.gz
./config.sh --url https://github.com/OWNER/REPO --token YOUR_TOKEN
./run.sh   # or install as systemd service: sudo ./svc.sh install

# Target in workflow:
runs-on: self-hosted
# or with labels:
runs-on: [self-hosted, linux, x64, gpu]`} />
        </Sub>
        <Sub title="End-to-End Example: Full CI/CD Pipeline">
          <CodeBlock language="yaml" code={`# .github/workflows/full-pipeline.yml
name: Full Pipeline

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint && npm run typecheck

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm test -- --coverage
      - uses: actions/upload-artifact@v4
        with: { name: coverage, path: coverage/ }

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env: { POSTGRES_PASSWORD: testpass, POSTGRES_DB: testdb }
        options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5
      redis:
        image: redis:7-alpine
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:testpass@localhost/testdb
          REDIS_URL: redis://localhost:6379

  build-image:
    needs: [lint-and-typecheck, unit-tests, integration-tests]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions: { contents: read, packages: write }
    outputs:
      image-tag: \${{ steps.meta.outputs.version }}
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/\${{ github.repository }}
          tags: type=sha,prefix=
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: \${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-staging:
    needs: build-image
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to staging
        run: |
          curl -X POST \${{ secrets.DEPLOY_WEBHOOK_URL }} \\
            -H "Authorization: Bearer \${{ secrets.DEPLOY_TOKEN }}" \\
            -d '{"image_tag":"\${{ needs.build-image.outputs.image-tag }}"}'

  release:
    needs: deploy-staging
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - run: npx semantic-release
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`} />
        </Sub>
      </Section>
    </div>
  )
}
