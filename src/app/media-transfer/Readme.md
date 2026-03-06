# Media Transfer Module for SE 
## Team: Media Messengers Ohio State University SP25

## Proposed Functionality
1.  ExpressJS folder with API endpoint
2.  Upon API endpoint hit:
-   Stores uploaded files on local disk (`/data/media-transfer/{transferId}/`)
-   Generates secure tokenized links for recipients
-   Streams downloads directly from server storage
3.  Endpoint is Triggered in association with the file's fileID and identifier of user (uid or email)
4.  Endpoint is Triggered by direct API endpoint link sent through SES emailing.

## To run api
-   cd into media-transfer folder
-   run `npm run debug`

## To run frontend
-   cd into repository
-   `npm install -g @angular/cli`
-   `npm install`
-   `ng serve`
-   If you get the following error: "... cannot be loaded because running scripts is disabled on this system..."
       Enter this into your terminal: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

## Email service
- Make sure back end is running
- Access the "Media Transfer" tab through the Digi Clips Frontend
- Fill out the fields accordingly
       Enter a SINGLE email for the sender email (optional)
       You can enter a single email, or multiple emails in regex format for the recipient
       The only required fields are the recipient email and 1 or more files.
- CHECK SPAM MAIL. Some mail providers (gmail) will flag the email as spam. 

## Input Requirements of Media Transfer System
- File name must not have any spaces
- File must be < 10 Gb
- Email must be a valid email format