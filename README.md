-------------
# IMPORTANT NOTICE

## This repository is now a legacy repository. The maintained components have been moved to [a new repository](https://bitbucket.org/atlassian/atlaskit-mk-2).

**Packages that have been left in this repository are likely not actively maintained.**

-------------

# Brik Website  

[![node](https://img.shields.io/badge/node-6.10%2B-brightgreen.svg)]()
[![npm](https://img.shields.io/badge/npm-3.8%2B-brightgreen.svg)]()

This is the code for Spendwallet website that are currently running on AWS. Can be found on http://brik.io/ or IP ADDRESS ( AW Elastic IP : 18.182.156.23 ) 

## Website test on localhost

1. npm run develop.

2. make a change.

3. access => http://localhost:3000/

4. keep testing.

## Docker deployment process to server  

Docker is good to ensure that the website runs independent of operating system and server.  
The project has a docker file in the root path. It contains general instructions for Docker on how to run and install the project.  

Useful commands:  
`docker ps`		     : list all running container instances  

`docker ps -a`		     : list all containers  

`docker images`              : lists all images downloaded to the server  

`docker rmi container_id`    : remove container to free up space. Sometimes server runs out.  


Tutorial for deploying a node app with docker:  
https://nodejs.org/en/docs/guides/nodejs-docker-webapp/  

Workflow for deploying an updating to the website:  

1. Install docker toolbox from https://www.docker.com/products/docker-toolbox  

2. Login and create a repository on https://hub.docker.com  

3. Pull down website code from bitbucket, run project with: `$ npm install`  

4. Make changes  

5. Cd into project folder 

6. Create the image and specify the repository on docker hub by: `$ docker build -t <your username>/<webapp-name> .`  

7. Push image to repository at docker hub by typing `$ docker push <your username>/<webapp-name>`  

8. SSH into server and make yourself root to see running containers.  

9. `$ docker pull <your username>/<webapp-name>`  

10. `$ docker ps`  

11. `$ docker stop brik_webapp`  

12. `$ docker rm brik_webapp`  

13. `$ docker run -d -p 3000:3000 --name brik_webapp <your username>/<webapp-name>`  

14. The app is now safely deployed to the server.  

15. confirm by `$ docker ps`

## BRIK AWS COMMMAND

`brik_update`		     : is script. it will be pull new docker image and remove astera_webapp container and restart container with new images. it contain process 9 to 15.

## BRIK AWS INFO

1. Use AWS EC2 - Ubuntu 14.04
2. Use Docker CE latest version.
3. Use nginx for port forwarding. (80 to 3000)

## AWS NETWORK SECURITY GROUP - XLAB DEFAULT

!IMPORTANT

## DOCKER HUB

    Link : https://cloud.docker.com/u/xlabbrik/repository/docker/xlabbrik/brik_webapp