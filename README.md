# unfetter-discover

Unfetter Discover web application and container resources. Visit
[unfetter.io](http://unfetter.io) for more information about Unfetter projects.

## System Requirements
### Mac (OSX 10.10.3+)
* [Docker Community Edition](https://www.docker.com) (version 17.06.0-ce or higher)
Docker-compose is part of the installation
* [Docker Compose](https://www.docker.com/products/docker-compose) is installed with Community Edition
* Install [Git](https://git-scm.com/download/mac) and necessary tools

## No Longer Supported
### Windows:
We no longer support deployment on Windows systems.  It is still possible with alterations, but we are focusing more on automated deployment through Ansible and scripts.  And Windows Docker just works differently

### Linux/Ubuntu:
* [Docker Community Edition](https://www.docker.com) (version 17.06.0-ce or higher)
* [Docker Compose](https://docs.docker.com/compose/install) needs to be installed separately.
* Install [Git](https://git-scm.com/download/mac) and necessary tools

## The Project Setup
Unfetter Discover is built up from multiple docker containers that are available on Docker Hub (https://hub.docker.com/u/unfetter/).  All source code is in the unfetter-discover GitHub organization (https://github.com/unfetter-discover).  We use Ansible (https://www.ansible.com/) for 
configuration and deployment for production use.

### Deploy for Demo
Its quick and simple to deploy a demo version of Unfetter with a single command.  By Demo, we mean there is no user access controls.

```
mkdir unfetter-discover
cd unfetter-discover
git clone git@github.com:unfetter-discover/unfetter
cd unfetter
docker-compose up
```

It will take few minutes for the Docker images to download and build.  Navigate to Unfetter Discover with Chrome or Firefox at https://localhost/

### Production Build
For production use, you will need to use ansible playbooks to configure the User Access Control.  We tried to use Ansible variables to control the creation and generation
of Unfetter.

```
mkdir unfetter-discover
cd unfetter-discover
git clone git@github.com:unfetter-discover/unfetter
cd unfetter
cd ansible
```

Investigate the hosts.ini file.  There a number of host types availabe.  Each host type has a different set of variables in the ansible group_vars.  For most cases, under ```[deployed]``` there shoudl be ```prod-uac```

Open the file unfetter/ansible/group_vars/production.yml.  Change any variables that are necessary.  The variables are currently set to support local deployment.  To build onto a remote system, change to ansible_connection, ansible_host and ansible_ssh_private_key_file are necessary.   


#### UAC Authentication
For a UAC version of Unfetter, you can use GitHub or GitLab out of the box.  You can change the Autentication services in the file ```unfetter-discover/unfetter/ansible/group_vars/uac.yml```.  To deploy so Unfetter Discover is accessible by others, you will need to change ui_domain and api_domain to point to the proper domain such as ```unfetter.local```.   

#### Configure GitHub/GitLab
You will need to make sure that there is an OAuth App for Unfetter Discover that is approved for use.  When you build Unfetter, you will
need to know the ClientID and the Client Secret.  Look at [Unfetter UAC Configuration](https://github.com/unfetter-discover/unfetter/wiki/GitHub-&-Gitlab-UAC-Configuration) for more instructions

### Running Unfetter
To deploy, just run
```
ansible-playbook deploy.yml
```

Ansible will pull all the docker images from Docker Hub.  You will be asked to enter your ClientID, Client Secret, and passwords.

Go to Unfetter at https://localhost/

## User Setup
TODO

## Ansible Playbooks
You can find out more about our playbooks at ###TODO###

## License

See [LICENSE](LICENSE.md).

## Disclaimer

See [DISCLAIMER](DISCLAIMER.md).
