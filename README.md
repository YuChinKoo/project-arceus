# Project Arceus #

## Deployed Application:
[insert url here]

## Team Members:
Yu Chin Koo

Manav Patel

Yuanyuan Li

## Description
The purpose of this web application is to allow users to create taskboards in order to plan work flow. The user will be prompted to make an account at first and then be give the ability to create taskboards. Within these taskboards, the user can request other users of the application to help in the taskboard. These helpers will have the ability to modify the taskboard as well as be given the option to join a video chat with the members currently on the taskboard. The owner of the board will be able to remove members as well as delete the taskboard entirely. The requested helpers have the ability to stop being a helper of a taskboard if they wish.

## Key Features
Initial form to create a taskboard
- Input form to create taskboards by entering a taskboard name

Give owners the ability to add and remove helpers 
- Helpers will be identified using emails which are stored as unique strings

Owner and helpers have the ability to modify the taskboard
- Adding tasks, removing tasks, moving tasks
  
Real time functionality using websockets (graphql subscriptions)
- Any updates to the taskboard, or taskboard requests/response should be seen by the receiver immediately

SOMETHING ELSE HERE
- 

implementation of signin/signup/logout
## Additional Features
- Video chat tab while on a specific taskboard
- Allow for users to modify the sound levels of video chat participants
- See which users have updated the taskboard through logs
- 

## Technology
MERN STACK + GRAPHQL
- React framework (frontend)
- Expressjs (backend)
- MongoDB (database) 
- GraphQL

## Top Technical Challenges
- Implementing websockets for real time updates
- Using webRTC for video chat feature
- CI/CD
- 
- 
