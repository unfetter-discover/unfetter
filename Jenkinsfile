pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'docker-compose up -d'
        sleep(time: 1, unit: 'MINUTES')
      }
    }
    stage('Verify') {
      steps {
        sh 'docker ps'
      }
    }
  }
}