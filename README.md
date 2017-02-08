# unfetter-discover

Unfetter Discover web application and container resources.  Visit <a href="http://unfetter.io">unfetter.io</a> for more information about Unfetter projects.

## System Requirements

* [Docker] (https://www.docker.com/)
* [Docker Compose](https://www.docker.com/products/docker-compose)
* [Node.js](https://nodejs.org)

## The Project Setup
The entire application, Unfetter Discover, is made up of multiple of docker containers.  Each builds upon the other.  We use  [Docker Compose](https://www.docker.com/products/docker-compose) to manage
the startup and shutdown of all those Docker containers.  

The GitHub organization [unfetter-discover](https://www.github.com/unfetter-discover) houses a GitHub project for every container.  Some of these projects only contain configuration files.  Others contain all the code.

You will first need to clone all of the projects.  You can do this one at a time, or through a script
```bash
 curl -s https://api.github.com/orgs/unfetter-discover/repos\?per_page\=200 | perl -ne 'print "$1\n" if (/"clone_url": "([^"]+)/)' | xargs -n 1 git clone
```
Next, go into the unfetter project
```bash
cd unfetter
```

This is the main Unfetter project page.  The docker-compose.yml files are housed here.  This is also the location to make bug requests or ask questions.

## Docker Compose


You can run the Unfetter Discover application in two ways.  You can either run the containers in [Docker Hub](https://hub.docker.com/u/unfetter/dashboard/), or you can build the containers 
from the software.  We recommend you only build the software if you are a developer or planning to change the code.

### Run Docker Hub containers
```bash
docker-compose -f docker-cogitmpose.yml up
```
or just
```bash
docker-compose up
```

### Build the containers from source
```bash
docker-compose -f docker-compose.yml -f docker-compose.development.yml up
```

The configuration starts MongoDB for storage of objects and also runs Nginx to provide a gateway to access REST services over HTTPS.

### Services

The User Interface can be viewed after starting Docker Compose at the follow location:

* [https://localhost/unfetter-discover-ui/](https://localhost/unfetter-discover-ui/)
Unfetter-Discover will create certs and store them locally.  You will need to accept the certificates to move forward.

## License 
See [LICENSE](LICENSE.md).

## Disclaimer
See [DISCLAIMER](DISCLAIMER.md).
