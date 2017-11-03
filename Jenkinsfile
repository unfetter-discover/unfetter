pipeline {
  agent any
  stages {
    stage('Test') {
      steps {
        echo 'Starting to run docker'
      }
    }
    stage('Sleep') {
      steps {
        sleep(time: 5, unit: 'SECONDS')
      }
    }
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