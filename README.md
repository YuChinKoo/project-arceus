# Project Arceus #

## Team Members:
Yu Chin Koo

Manav Patel

Yuanyuan Li

## Description
The purpose of this web application is to allow users to auto-generate their portfolio website. The user is prompted to input information they would like to be added to a website, and then utilized and implemented into website templates of their choosing. If a template was not selected, a set of options will be given to the user like what color scheme to use, what kind of webpage they would like (single scrollable page vs. tabbed), etc. This web application is a single-tenanted system, but supports user authentication for multiple users. Upon auto generating a personal website, this application will provide the auto generated code to the rightful users as that code will be owned and maintained by them.

## Key Features
note: store input values in cookie so that if user wants to go back, the user would not have to put in those values again
- Input form 

initial form for their experiences, etc
- Input form to support and edit pdfs (cherry pick information off of a pdf)
  
if they want to upload pdf instead of typing everything out, like this: https://itsjafer.com/#/parser
- Storing user input information

store as json object
- Website templates
  
website templates to choose from
- Website auto-generated using templates and information from input form

generate code
- Authentication and authorization

implementation of signin/signup/logout
## Additional Features
- Set of options for template modifications
  - what color scheme to use, what kind of webpage they would like (single scrollable page vs. tabbed)
- Send website template code to users (notification)
- Allow edits to their personal website
  - builtin editor
- Allow website auto-generated, and also resume and cover letter (in latex)

## Technology
MERN STACK + GRAPHQL
- React framework (frontend)
- Expressjs (backend)
- MongoDB (database) 
- GraphQL

## Technicalities
- Allowing users to edit and save their website in code,
  ie, built-in code editor for these websites.
- Sending emails
  (required to create a business email if we want to do this)
- Auto generate website based on input forms
- Storage of multiple users and multiple auto generated websites.
- Options for users to change when constructing a template website
