pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'docker stop $(docker ps -a -q)'
        sh 'docker rm $(docker ps -a -q)'
        sh 'docker rmi -f $(docker images -q)'
        sh 'docker-compose up -d'
      }
    }
    stage('Sleep') {
      steps {
        sleep(time: 5, unit: 'MINUTES')
      }
    }
    stage('Verify') {
      steps {
        sh 'docker ps'
      }
    }
    stage('Test NPM') {
      steps {
        sh 'docker exec -i unfetter-discover-api npm test'
      }
    }
  }
}