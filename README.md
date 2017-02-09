# unfetter-discover

Unfetter Discover web application and container resources.  Visit <a href="http://unfetter.io">unfetter.io</a> for more information about Unfetter projects.

## System Requirements

* [Docker] (https://www.docker.com/)
* [Docker Compose](https://www.docker.com/products/docker-compose)
* [Node.js](https://nodejs.org)

## The Project Setup
The entire application, Unfetter Discover, is made up of multiple of docker containers.  Each builds upon the other.  We use  [Docker Compose](https://www.docker.com/products/docker-compose) to manage
the startup and shutdown of all those Docker containers.  

The GitHub organization [unfetter-discover](https://www.github.com/unfetter-discover) houses a GitHub project for every container.  There is two ways to run Unfetter Discover.  You can run all the containers from Docker Hub, without recompiling.  
This is recommended for most cases.

If you are a developer, and would liked to build the Unfetter-Discover project from source, then you will need to clone all the repos in [unfetter-discover](https://www.github.com/unfetter-discover) 
and use a different docker-compose config file.

###Build from Docker Hub.  Normal Use Case
You will only need to clone the unfetter project.  Then, run docker-compose with default arguments.  First, go into your working directory that you want to clone the main project.

```bash
git clone https://github.com/unfetter-discover/unfetter.git
cd unfetter
docker-compose up
```

###Build from local source files.  Developer Use Case
You will first need to clone all the projects in [unfetter-discover](https://www.github.com/unfetter-discover). 

```bash
 curl -s https://api.github.com/orgs/unfetter-discover/repos\?per_page\=200 | perl -ne 'print "$1\n" if (/"clone_url": "([^"]+)/)' | xargs -n 1 git clone
 cd unfetter
 docker-compose -f docker-compose.yml -f docker-compose.development.yml up
```

### The Web Application

The User Interface can be viewed after starting Docker Compose at the follow location:

* [https://localhost/unfetter-discover-ui/](https://localhost/unfetter-discover-ui/)
Unfetter-Discover will create certs and store them locally.  You will need to accept the certificates to move forward.

## License 
See [LICENSE](LICENSE.md).

## Disclaimer
See [DISCLAIMER](DISCLAIMER.md).
