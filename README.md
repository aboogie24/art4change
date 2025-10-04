# Art for Change Podcast - Docker Deployment

**Current Version**: 0.0.1

This repository contains the Docker Compose configuration to deploy the Art for Change Podcast website.

## Prerequisites

- Docker
- Docker Compose
- Git (for versioning and releases)

## Quick Start

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd art_for_change
   ```

3. Start the application:
   ```bash
   docker-compose up -d
   ```

4. Access the website at: http://localhost:8080

## Files Structure

```
art_for_change/
├── docker-compose.yml    # Docker Compose configuration
├── nginx.conf           # Nginx server configuration
├── index.html          # Main website file
└── README.md           # This file
```

## Services

### art-for-change-web
- **Image**: nginx:alpine
- **Port**: 8080 (host) → 80 (container)
- **Purpose**: Serves the static HTML website

## Configuration Details

### Docker Compose Features
- Uses nginx:alpine for lightweight deployment
- Exposes the website on port 8080
- Mounts the HTML file and nginx configuration as read-only volumes
- Includes restart policy for production reliability
- Creates a dedicated network for the service

### Nginx Configuration Features
- Gzip compression for better performance
- Security headers for enhanced protection
- Caching policies for static assets
- Health check endpoint at `/health`
- Custom error page handling
- Protection against hidden file access

## Management Commands

### Start the service
```bash
docker-compose up -d
```

### Stop the service
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f art-for-change-web
```

### Restart the service
```bash
docker-compose restart
```

### Check service status
```bash
docker-compose ps
```

## Health Check

You can check if the service is running properly by visiting:
- Website: http://localhost:8080
- Health endpoint: http://localhost:8080/health

## Customization

### Change Port
To change the exposed port, modify the `ports` section in `docker-compose.yml`:
```yaml
ports:
  - "YOUR_PORT:80"
```

### SSL/HTTPS Support
The docker-compose.yml includes commented configuration for SSL support using Certbot. Uncomment and configure the certbot service if you need HTTPS.

### Production Deployment
For production deployment:
1. Change the port mapping as needed
2. Configure proper domain names
3. Set up SSL certificates
4. Consider using a reverse proxy like Traefik or nginx-proxy
5. Implement proper backup strategies

## Troubleshooting

### Port Already in Use
If port 8080 is already in use, change it in the docker-compose.yml file:
```yaml
ports:
  - "8081:80"  # Use port 8081 instead
```

### Permission Issues
Ensure Docker has proper permissions to read the files in the directory.

### Container Won't Start
Check the logs:
```bash
docker-compose logs art-for-change-web
```

## Development

To make changes to the website:
1. Edit the `index.html` file
2. Restart the container:
   ```bash
   docker-compose restart art-for-change-web
   ```

The changes will be reflected immediately since the HTML file is mounted as a volume.

## Versioning and Releases

This project uses **semantic versioning** (SemVer: MAJOR.MINOR.PATCH).

### Current Version: 0.0.1

For detailed information on how to create releases and push to Docker Hub, see [VERSIONING.md](VERSIONING.md).

### Quick Release Guide

To create and push version 0.0.1:

```bash
# Commit all changes
git add .
git commit -m "Prepare for initial release v0.0.1"
git push origin main

# Create and push the version tag
git tag -a v0.0.1 -m "Initial release - version 0.0.1"
git push origin v0.0.1
```

The GitHub Action will automatically:
- Build the Docker image
- Tag it with `0.0.1`, `0.0`, `0`, and `latest`
- Push to Docker Hub

### Using Versioned Docker Images

```bash
# Pull specific version
docker pull YOUR_DOCKERHUB_USERNAME/art4change:0.0.1

# Run specific version
docker run -d -p 8080:80 YOUR_DOCKERHUB_USERNAME/art4change:0.0.1
```

## Documentation

- [VERSIONING.md](VERSIONING.md) - Complete semantic versioning guide
- [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) - Docker deployment details
- [LIGHTHOUSE_FIXES.md](LIGHTHOUSE_FIXES.md) - Performance optimization notes

## Contributing

When contributing, please:
1. Follow semantic versioning guidelines
2. Update version labels in Dockerfile when appropriate
3. Test changes before creating release tags

# art4change
