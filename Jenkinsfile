pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh '''#!/bin/bash
# Stop All Containers
docker stop $(docker ps -a -q)

# Delete all containers
docker rm $(docker ps -a -q)
# Delete all images
docker rmi -f $(docker images -q)'''
        sh 'docker-compose up -d'
        sleep(time: 1, unit: 'MINUTES')
      }
    }
    stage('Verify') {
      steps {
        sh 'docker ps'
      }
    }
    stage('Test NPM') {
      steps {
        sh 'docker ps -it unfetter-discover-api npm test'
      }
    }
  }
}