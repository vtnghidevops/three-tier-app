# Three-Tier Application

A scalable e-commerce application built using a three-tier architecture with complete CI/CD pipeline implementation.

## Architecture Overview

This application follows the standard three-tier architecture:

- **Presentation Tier**: Frontend interface that users interact with
- **Application Tier**: Backend services that process business logic
- **Data Tier**: Database for data persistence

## Technology Stack

### Frontend
- React.js with Material-UI
- Axios for API communication
- Jest for unit testing

### Backend
- Node.js with Express.js
- Mongoose for MongoDB interactions
- RESTful API endpoints

### Database
- MongoDB for data storage

### DevOps Tools
- Docker for containerization
- Kubernetes for container orchestration
- GitLab CI/CD for continuous integration and deployment
- Trivy for image and code scanning
- SonarQube for code quality analysis

## CI/CD Pipeline

Our pipeline automates the following stages:

1. **Detect Changes**
   - Identifies modified components in the `Application-Code` directory
   - Determines which microservices need to be rebuilt

2. **Prepare Docker Build**
   - Dynamically generates build configurations for changed components
   - Creates a child pipeline for Docker image builds

3. **Build**
   - Builds Docker images for modified components
   - Tags images with commit SHA

4. **Security Scan**
   - Trivy image security scanning for vulnerabilities
   - Trivy code security scanning for code issues
   - SonarQube code quality analysis

5. **Precheck**
   - Manual approval gate before proceeding to production

6. **Push**
   - Generates Software Bill of Materials (SBOM) files
   - Uploads artifacts to MinIO storage
   - Updates Helm chart image tags in GitHub repository

### Pipeline Configuration

The pipeline is configured in `.gitlab-ci.yml` with the following stages:

```yaml
stages:
  - detect-changes
  - prepare-docker-build
  - build
  - scan
  - precheck
  - push
```

Key pipeline jobs:
- **detect-changed-folders**: Identifies which components have changed
- **generate-build-stage**: Creates dynamic build configurations
- **trivy-image-security-scan**: Scans Docker images for vulnerabilities
- **sonarqube-code-quality-scan**: Analyzes code quality
- **Precheck-manual-gate**: Requires manual approval before production
- **update-images-tag**: Updates Helm charts in GitHub repository

## Environment Setup

### Development Environment

1. Clone the repository:
```
git clone https://gitlab.com/devops6472717/three-tier-app.git
cd three-tier-app
```

2. Start local services:
```
docker-compose up -d
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Production Deployment

Production deployment uses Kubernetes and is managed through GitLab CD:

1. Changes to the main branch trigger the CI/CD pipeline
2. After successful testing, images are built and pushed to the Harbor registry
3. Manual approval is required at the precheck gate
4. Helm charts are updated with new image tags in the GitHub repository

## Kubernetes Resources

The application is deployed to Kubernetes using the following resources:

- **Deployments** for Frontend, Backend, and MongoDB
- **Services** for internal communication
- **Ingress** for external access
- **PersistentVolumes** for MongoDB data storage
- **Secrets** for sensitive information

## Security Practices

- Container image scanning with Trivy
- Code security scanning
- SonarQube for code quality analysis
- Secret management in Kubernetes
- Network policies and security groups


