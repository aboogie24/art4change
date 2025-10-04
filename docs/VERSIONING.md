# Semantic Versioning Guide - Art for Change Podcast

This document explains how to use semantic versioning with GitHub Actions to automatically build and push Docker images to Docker Hub.

## Current Version

**Version**: 0.0.1

## Overview

The project uses semantic versioning (SemVer) with the format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Incompatible API changes (breaking changes)
- **MINOR**: Added functionality in a backwards-compatible manner
- **PATCH**: Backwards-compatible bug fixes

## How It Works

The GitHub Action (`.github/workflows/docker-publish.yml`) automatically:
1. Detects when you push a semantic version tag (e.g., `v0.0.1`)
2. Builds the Docker image
3. Tags it with multiple versions:
   - Full version: `0.0.1`
   - Major.Minor: `0.0`
   - Major: `0`
   - `latest` (for main/master branch)
4. Pushes all tags to Docker Hub

## Creating Your First Release (v0.0.1)

### Step 1: Ensure all changes are committed

```bash
git add .
git commit -m "Prepare for initial release v0.0.1"
git push origin main
```

### Step 2: Create and push the version tag

```bash
# Create an annotated tag for version 0.0.1
git tag -a v0.0.1 -m "Initial release - version 0.0.1"

# Push the tag to GitHub
git push origin v0.0.1
```

### Step 3: Monitor the GitHub Action

1. Go to your GitHub repository
2. Click on the "Actions" tab
3. You should see the "Build and Push Docker Image" workflow running
4. Wait for it to complete successfully

### Step 4: Verify on Docker Hub

Once the action completes, your image will be available at:
- `YOUR_DOCKERHUB_USERNAME/art4change:0.0.1`
- `YOUR_DOCKERHUB_USERNAME/art4change:0.0`
- `YOUR_DOCKERHUB_USERNAME/art4change:0`
- `YOUR_DOCKERHUB_USERNAME/art4change:latest`

## Creating Future Releases

### Patch Release (Bug fixes)
For bug fixes and minor updates: `0.0.1` → `0.0.2`

```bash
git tag -a v0.0.2 -m "Bug fix release"
git push origin v0.0.2
```

### Minor Release (New features, backwards-compatible)
For new features: `0.0.2` → `0.1.0`

```bash
git tag -a v0.1.0 -m "Added new features"
git push origin v0.1.0
```

### Major Release (Breaking changes)
For breaking changes: `0.1.0` → `1.0.0`

```bash
git tag -a v1.0.0 -m "Major release with breaking changes"
git push origin v1.0.0
```

## Docker Image Tags Generated

When you tag `v0.0.1`, the GitHub Action creates these Docker tags:

| Git Tag | Docker Tags Generated |
|---------|----------------------|
| v0.0.1  | 0.0.1, 0.0, 0, latest |
| v0.0.2  | 0.0.2, 0.0, 0, latest |
| v0.1.0  | 0.1.0, 0.1, 0, latest |
| v1.0.0  | 1.0.0, 1.0, 1, latest |

## GitHub Secrets Required

Ensure these secrets are configured in your GitHub repository:
- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Your Docker Hub access token

### Setting Up Secrets

1. Go to your GitHub repository
2. Click on "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`

## Workflow Triggers

The GitHub Action runs on:
- **Tag pushes**: When you push tags matching `v*.*.*`
- **Branch pushes**: When you push to `main` or `master` (builds `latest` tag)
- **Pull requests**: Builds but doesn't push (for testing)
- **Manual trigger**: Via workflow_dispatch

## Using the Docker Images

### Pull a specific version

```bash
docker pull YOUR_DOCKERHUB_USERNAME/art4change:0.0.1
```

### Pull the latest version

```bash
docker pull YOUR_DOCKERHUB_USERNAME/art4change:latest
```

### Run a specific version

```bash
docker run -d -p 8080:80 YOUR_DOCKERHUB_USERNAME/art4change:0.0.1
```

## Version Management Best Practices

1. **Always use annotated tags** (`-a` flag) for better Git history
2. **Write meaningful tag messages** describing what changed
3. **Follow SemVer strictly** to avoid confusion
4. **Test before tagging** - ensure your code works
5. **Update CHANGELOG** before creating a release (recommended)
6. **Never delete or reuse tags** - if you make a mistake, create a new version

## Viewing Version History

### List all tags

```bash
git tag -l
```

### Show tag details

```bash
git show v0.0.1
```

### View tags with messages

```bash
git tag -n
```

## Rollback to a Previous Version

If you need to rollback:

```bash
# Deploy a previous version
docker pull YOUR_DOCKERHUB_USERNAME/art4change:0.0.1
docker run -d -p 8080:80 YOUR_DOCKERHUB_USERNAME/art4change:0.0.1
```

## Deleting Tags (If Needed)

⚠️ **Warning**: Only delete tags if absolutely necessary, and never delete tags that have been deployed.

```bash
# Delete local tag
git tag -d v0.0.1

# Delete remote tag
git push origin --delete v0.0.1
```

## Troubleshooting

### GitHub Action fails to push to Docker Hub

**Solution**: Check that your secrets are correctly configured:
- `DOCKERHUB_USERNAME` matches your Docker Hub username exactly
- `DOCKERHUB_TOKEN` is a valid access token (not your password)

### Tag doesn't trigger the workflow

**Verify**:
- Tag follows the pattern `v*.*.*` (e.g., `v0.0.1`, not `0.0.1`)
- You pushed the tag with `git push origin v0.0.1`

### Multiple tags not appearing on Docker Hub

This is expected behavior - the workflow creates multiple tags automatically. Check all tags with:

```bash
docker pull YOUR_DOCKERHUB_USERNAME/art4change:0.0.1
docker pull YOUR_DOCKERHUB_USERNAME/art4change:0.0
docker pull YOUR_DOCKERHUB_USERNAME/art4change:0
docker pull YOUR_DOCKERHUB_USERNAME/art4change:latest
```

## Next Steps

1. ✅ Review this guide
2. ✅ Ensure GitHub secrets are configured
3. ✅ Commit all changes
4. ✅ Create and push the `v0.0.1` tag
5. ✅ Monitor the GitHub Action
6. ✅ Verify images on Docker Hub
7. ✅ Test pulling and running the image

## Example Release Workflow

```bash
# 1. Make your changes
git add .
git commit -m "Add new feature"

# 2. Push to main
git push origin main

# 3. Create a release tag
git tag -a v0.0.1 -m "Initial release with core features"

# 4. Push the tag
git push origin v0.0.1

# 5. Monitor GitHub Actions
# Go to: https://github.com/YOUR_USERNAME/art4change/actions

# 6. Once complete, pull and test
docker pull YOUR_DOCKERHUB_USERNAME/art4change:0.0.1
docker run -d -p 8080:80 YOUR_DOCKERHUB_USERNAME/art4change:0.0.1

# 7. Verify at http://localhost:8080
```

## Additional Resources

- [Semantic Versioning Specification](https://semver.org/)
- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Git Tagging Documentation](https://git-scm.com/book/en/v2/Git-Basics-Tagging)
