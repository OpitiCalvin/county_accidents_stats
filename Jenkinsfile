pipeline {
    // None parameter in the agent section means that no global agent will be allocated for the entire Pipeline's
    // execution and that each stage directive must specify its own agent section
    agent none
    stages {
        stage('Build') {
            agent {
                docker {
                    image 'python:3.12-bookworm'
                }
            }
            steps {
                sh 'python -m py_compile sources'
            }
        }
    }
}