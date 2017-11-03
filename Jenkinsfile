pipeline {
  agent any
  stages {
    stage('Test') {
      steps {
        echo 'test'
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
  }
}