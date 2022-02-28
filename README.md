# Project Arceus #

## Team Members:
Yu Chin Koo

Manav Patel

Yuanyuan Li

## Description
The purpose of this web application is to allow users to auto-generate their portfolio website. The user is prompted to input information they would like to be added to a website, and then utilized and implemented into website templates of their choosing. If a template was not selected, a set of options will be given to the user  like what color scheme to use, what kind of webpage they would like (single scrollable page vs. tabbed), etc. This web application is a single-tenanted system, but supports user authentication for multiple users. Upon auto generating a personal website, this application will provide the auto generated code to the rightful users as that code will be owned and maintained by them.

## Key Features
- Input form

initial form for their experiences, etc
- input form to support and edit pdfs (cherry pick information off of a pdf)
  
if they want to upload pdf instead of typing everything out, like this: https://itsjafer.com/#/parser
- Storing user input information

store as json object probably
- Authentication and authorization

signin/signup/logout
- website templates
  
bunch of website templates to choose from

## Additional Features
- Website auto-generated using templates

generate code
- Send website code to users (notification)

send code
- (allow edits to their personal website?)

builtin editor
- (maybe not only allow website auto-generated, but also resume, cover letter, etc)

other tools that can be auto generated

## Technology
- React framework (frontend)
- Expressjs (backend)
- SQL? MongoDB? Redis? (database)
- Docker (for deployment)
- Digital Ocean (for cloud provider)

## Technicalities
- Allowing users to edit and save their website in code
  ie, built-in code editor for these websites?
- Sending emails
  we'll probably have to create a business email if we want to do this
- Auto generate website based on input forms
  this is already hard enough
- Storage of multiple users and multiple auto generated websites?
  eh, similar to hw3 webgallery where we have multiple users and multiple images in their gallery
- 