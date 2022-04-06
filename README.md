[![Publish React Skeleton to GHCR](https://github.com/UTSCC09/project-arceus/actions/workflows/build.yaml/badge.svg)](https://github.com/UTSCC09/project-arceus/actions/workflows/build.yaml)

# Betrello

## Project URL:

https://betrello.software

## Project Video URL

[https://youtu.be/BnhOg0b6ryg](https://youtu.be/BnhOg0b6ryg "https://youtu.be/BnhOg0b6ryg")

## Project Description

The purpose of this web application is to allow users to create taskboards in order to plan work flow. The user will be prompted to make an account at first and then be give the ability to create taskboards. Within these taskboards, the user can request other users of the application to help in the taskboard. These helpers will have the ability to modify the taskboard as well as be given the option to join a video chat with the members currently on the taskboard. The owner of the board will be able to remove members as well as delete the taskboard entirely. The requested helpers have the ability to stop being a helper of a taskboard if they wish.

## Development

**Task:** Leaving deployment aside, explain how the app is built. Please describe the overall code design and be specific about the programming languages, framework, libraries and third-party api that you have used.

We have constructed the app using a popular stack called MERN stack + graphql.

We built the frontend using React framework and material-ui for styling. With react, we used javascript as our underlying language, and css to style our components. We used ApolloClient in order to connect the front-end to the back-end Apollo Server.

We built the backend using expressjs, apollo-server-express for our server and used express-sessions in order to authenticate users. We used graphql-subscriptions in order to allow for real time updates in the front-end.

We created a dedicated server (socket/socket.js)) strictly for the video chat functionality that utilizes socket.io. Simple-peer and socket.io-client was used in the front-end in order to connect the front-end to the socket server.

We used cloud mongodb as our database, used mongoose in order to make the connection to the database, and graphql as our query language.

## Deployment

**Task:** Explain how you have deployed your application.

We deployed our application through DigitalOcean's droplet. Firstly, we created individual Dockerfiles for the client-side, server-side, and socket components so that we can build and run those images in our droplet. Next, we created a github actions workflow that will create, build, and push these docker images into the Github Container Registry upon any pushes to the master branch. After verifying that the images are stored in the GHCR, we build a docker-compose file that will grab the docker images from GHCR, provision letsencrypt certificate manager docker images, and build and run these images in the droplet, thus starting up our application in the droplet. In order to allow routing, we created and configured a custom nginx file for reverse proxy on the client-side. So far, we are able to set up CI/CD pipline for automatic deployment to our virtual machine. Next, we registered a domain on name.com, and created DNS records on DigitalOcean to have the registered domain (as well as the subdomains) to point to the ip of our virtual machine (our droplet). This way, our registered domain will display our deployed application, as wanted.

## Maintenance

**Task:** Explain how you monitor your deployed app to make sure that everything is working as expected.

We utilized apollo-prometheus-exporter plugin for apollo server in order to export metrics. Next, we installed and configured a grafana agent in the droplet, and route the metrics to grafana cloud. From this cloud, we are able to see dashboards such as cpu usage, memory usage, errors/second, etc, for our application. We are able to observe that everything is working as expected from the cloud. We have also created alerts that sends a notification to our emails when our nodejs/apollo server is down, when the CPU Usage or Memory Usage of the server exceeds a certain limit, and other relevant alerts. In order to monitor our droplet information, we configured alerts on DigitalOcean that will also send an email when CPU Usage or Memory Usage of the droplet exceeds a certain limit.

## Challenges

**Task:** What is the top 3 most challenging things that you have learned/developed for you app? Please restrict your answer to only three items.

1. Implementing websockets/graphql subscriptions for real-time updates on the taskboard
2. Deploying our application and creating a CI/CD pipline
3. Setting up a video chat feature using simple-peer

## Contributions

**Task:** Describe the contribution of each team member to the project. Please provide the full name of each team member (but no student number).

Yu Chin Koo

- Made frontend connection with the backend
- Deployed our application and set up CI/CD pipeline

Manav Patel

- Configured the apollo server backend for the application
- Created resolvers and made connections between frontend and backend
- Styled front-end

Yuanyuan Li

- Main layout of homepage and taskboard frontend
- Setting up video chat socket server and connections to frontend

# One more thing?

**Task:** Any additional comment you want to share with the course staff?
