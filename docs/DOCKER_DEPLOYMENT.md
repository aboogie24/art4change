# Docker Deployment Guide

This guide explains how to build and deploy the Art For Change Docker image to Docker Hub using GitHub Actions.

## Prerequisites

1. A Docker Hub account
2. A GitHub repository with this code
3. Docker Hub access token

## Setup Instructions

### 1. Create Docker Hub Access Token

1. Log in to [Docker Hub](https://hub.docker.com/)
2. Go to **Account Settings** → **Security**
3. Click **New Access Token**
4. Give it a name (e.g., "GitHub Actions")
5. Set permissions to **Read, Write, Delete**
6. Click **Generate**
7. **Copy the token** (you won't be able to see it again)

### 2. Create GitHub Environment

1. Go to your GitHub repository
2. Navigate to **Settings** → **Environments**
3. Click **New environment**
4. Name it `dev` (exactly as shown)
5. Click **Configure environment**
6. (Optional) Add environment protection rules if needed

### 3. Configure Environment Secrets

1. In the `dev` environment page (Settings → Environments → dev)
2. Scroll to **Environment secrets**
3. Click **Add secret**
4. Add the following secrets:

   **DOCKERHUB_USERNAME**
   - Value: Your Docker Hub username

   **DOCKERHUB_TOKEN**
   - Value: The access token you created in step 1

> **Note:** The workflow is configured to use the `dev` environment, so secrets must be added to the `dev` environment, not as repository secrets.

### 4. Workflow Configuration

The workflow is configured to:

- **Trigger on:**
  - Push to `main` or `master` branch
  - Pull requests to `main` or `master` branch
  - Version tags (e.g., `v1.0.0`)
  - Manual workflow dispatch

- **Build for multiple platforms:**
  - linux/amd64
  - linux/arm64

- **Tag images:**
  - `latest` (for main/master branch)
  - Branch name (e.g., `main`, `develop`)
  - Git SHA (e.g., `main-abc1234`)
  - Semantic version tags (e.g., `v1.0.0`, `1.0`, `1`)

## Image Name

The Docker image will be pushed as:
```
<your-dockerhub-username>/art4change:latest
<your-dockerhub-username>/art4change:<tag>
```

## Usage

### Automatic Deployment

Once configured, the workflow will automatically run when you:

1. **Push to main/master branch:**
   ```bash
   git add .
   git commit -m "Update website"
   git push origin main
   ```

2. **Create a version tag:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. **Manual trigger:**
   - Go to **Actions** tab in GitHub
   - Select **Build and Push Docker Image**
   - Click **Run workflow**

### Pull and Run the Image

Once the image is pushed to Docker Hub, anyone can pull and run it:

```bash
# Pull the latest image
docker pull <your-dockerhub-username>/art4change:latest

# Run the container
docker run -d -p 8080:80 --name art4change <your-dockerhub-username>/art4change:latest
```

Or use with docker-compose:

```yaml
version: '3.8'

services:
  art-for-change-web:
    image: <your-dockerhub-username>/art4change:latest
    container_name: art-for-change-podcast
    ports:
      - "8080:80"
    restart: unless-stopped
```

## Local Docker Build

To build the image locally for testing:

```bash
# Build the image
docker build -t art4change:local .

# Run locally
docker run -d -p 8080:80 --name art4change-test art4change:local

# View logs
docker logs art4change-test

# Stop and remove
docker stop art4change-test
docker rm art4change-test
```

## Troubleshooting

### Workflow fails with "unauthorized" error
- Verify your `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets are correct
- Ensure the access token has **Read, Write, Delete** permissions
- Check if the token has expired

### Image name conflicts
- Make sure the image name in the workflow matches your Docker Hub repository
- The image name is set in the workflow file: `DOCKER_IMAGE_NAME: art4change`

### Build fails
- Check the Actions logs in GitHub for detailed error messages
- Verify the Dockerfile is valid by building locally first
- Ensure all required files are present in the repository

## Workflow Features

### Caching
The workflow uses GitHub Actions cache to speed up builds:
- Docker layer caching
- BuildKit cache

### Multi-platform Support
Images are built for both AMD64 and ARM64 architectures, making them compatible with:
- x86_64 servers
- Apple Silicon Macs (M1/M2)
- ARM-based cloud instances

### Automatic README Sync
The workflow automatically updates your Docker Hub repository description with the content from README.md (only on main branch pushes).

## Security Notes

- Never commit Docker Hub credentials directly to the repository
- Always use GitHub Secrets for sensitive information
- Rotate access tokens periodically
- Use tokens with minimal required permissions

## Additional Resources

- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Documentation](https://docs.docker.com/engine/reference/commandline/build/)
