pipeline {
  agent any
  stages {
    stage('Download') {
      steps {
        sh '''git clone git@github.com:unfetter-discover/unfetter.git
git clone git@github.com:unfetter-discover/unfetter-store.git
git clone git@github.com:unfetter-discover/unfetter-ui.git
git clone git@github.com:unfetter-discover/stix.git'''
      }
    }
    stage('Build') {
      steps {
        sh '''cd unfetter
docker-compose -f docker-compose.development.yml up -d'''
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