# unfetter-discover

Unfetter Discover web application and container resources. Visit
[unfetter.io](http://unfetter.io) for more information about Unfetter projects.

## System Requirements
### Mac (OSX 10.10.3+)
* [Docker Community Edition](https://www.docker.com) (version 17.06.0-ce or higher)
Docker-compose is part of the installation
* [Docker Compose](https://www.docker.com/products/docker-compose) is installed with Community Edition
* Install [Git](https://git-scm.com/download/mac) and necessary tools

### Windows:
* [Docker Toolbox](https://docs.docker.com/toolbox/overview/) for [Docker on Windows](https://docs.docker.com/docker-for-windows/install/)
* [Docker Compose](https://www.docker.com/products/docker-compose) is installed with Docker Toolbox
* Follow the standard installation instructions for Docker Toolbox for Windows from the Docker website.  Once installed, there should be a Docker quickstart, Oracle VM VirtualBox, and Kitematic shortcuts on the desktop

### Linux/Ubuntu:
* [Docker Community Edition](https://www.docker.com) (version 17.06.0-ce or higher)
* [Docker Compose](https://docs.docker.com/compose/install) needs to be installed separately.
* Install [Git](https://git-scm.com/download/mac) and necessary tools


### Windows 10 Pro (issues):
* Windows 10 Pro and Windows 2016 has native Docker support.  However, it can not run the Linux based Docker containers that Unfetter requires.  Likely, using the Docker Toolbox approach described above will work.

## The Project Setup
The entire application, Unfetter Discover, is made up of multiple of docker
containers. Each build upon the other. We use
[Docker Compose](https://www.docker.com/products/docker-compose) to manage
the startup and shutdown of all those Docker containers.

The GitHub organization [unfetter-discover] GitHub projects that logically separate the Unfetter Discover project.  There are two ways to run Unfetter Discover:

1. You can run all the containers from Docker Hub, without recompiling. This
is recommended for most cases.

2. If you are a developer and would like to build the Unfetter-Discover project
from source, then you will need to clone all the repos in [unfetter-discover](https://www.github.com/unfetter-discover)
and use the `docker-compose.development.yml` config file.

For more information about build types and run modes, see the [Unfetter Build Types & Run Modes](https://github.com/unfetter-discover/unfetter/wiki/Unfetter-Build-Types-&-Run-Modes) wiki.


### Case 1: Normal installation, pulling from approved Docker Hub builds
In general, the Unfetter repos is the only repo you need.  It has the docker-compose.yml file which will build and install all of Unfetter-Discover, leveraging the [Docker Hub Images](https://hub.docker.com/u/unfetter/).  

After following the directions below, you can navigate to Unfetter Discover with Chrome or Firefox at https://localhost/

#### Mac OSX and Linux
```bash
mkdir unfetter-discover
cd unfetter-discover
git clone https://github.com/unfetter-discover/unfetter.git
cd unfetter
docker-compose up
```
It will take few minutes for the Docker images to download and build.

#### Windows 
For Windows, Docker Toolbox will install a virtual machine through VirtualBox and execute inside of that environment.  There is a couple of steps that must happen.

* Double click on the Docker Quickstart Terminal Icon on the windows.  When, done, you will see a $ prompt.
* Check the ip address of the Docker-machine now running.  At the prompt, run "docker-machine.exe ip".  The returning IP is the IP address of the docker machine, usually 192.168.99.100.  NOTE: If no IP address is returned, type "docker-machine.exe env"
* Inside the docker machine, do the following
```bash
mkdir unfetter-discover
cd unfetter-discover
git clone https://github.com/unfetter-discover/unfetter.git
cd unfetter
docker-compose -f docker-compose.virtualbox.yml up
```


### Case 2: OR.....build from local source files.  

Create a directory to hold all the projects, 
```bash
mkdir unfetter-discover
cd unfetter-discover
```
Next, you will need to clone three projects in [unfetter-discover](https://www.github.com/unfetter-discover).  
```bash
 git clone git@github.com:unfetter-discover/unfetter.git
 git clone git@github.com:unfetter-discover/unfetter-ui.git
 git clone git@github.com:unfetter-discover/unfetter-store.git
 cd unfetter
 ```
 Next, change directories into the unfetter directory, which houses the docker-compose.development.yml file, and run docker-compose
 
 For MaxOSX and Linux
 ```
 docker-compose -f docker-compose.development.yml up
```

For Windows
 ```
 docker-compose -f docker-compose.virtualbox.yml -f docker-compose.development.yml up
```

By default, `docker-compose.development.yml` runs in a UAC mode that requires additional configuration.  Setting up UAC for Unfetter is documented [here](https://github.com/unfetter-discover/unfetter/wiki/GitHub-UAC-Configuration).

If you wish to run it without UAC, you can disable it by editing `docker-compose.development.yml` and setting `RUN_MODE=DEMO` (Note, there are multiple instances of this variables.)

### The Web Application

After running the `docker-compose` command you can view the application at:

https://localhost/

Unfetter-Discover will create certs and store them locally. You will need to
accept the certificates to move forward.

# Developers
If you are interested in contributing to Unfetter, take a look at our more detailed [Unfetter Wiki](https://github.com/unfetter-discover/unfetter/wiki)

## License

See [LICENSE](LICENSE.md).

## Disclaimer

See [DISCLAIMER](DISCLAIMER.md).
