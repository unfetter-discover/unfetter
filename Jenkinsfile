pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'docker-compose up -d'
        sleep(time: 1, unit: 'MINUTES')
        sh '''#!/bin/bash
# Stop All Containers
docker stop $(docker ps -a -q)

# Delete all containers
docker rm $(docker ps -a -q)
# Delete all images
docker rmi -f $(docker images -q)'''
      }
    }
    stage('Verify') {
      steps {
        sh 'docker ps'
      }
    }
  }
}