# Zendesk Messaging JWT example

This is an example JWT server, built for the Zendesk messaging web SDK. It demonstrates the behavior of an authenticated messaging experience for your end-users, while also allowing you to contrast it with an unauthenticated session. It is NOT intended for production use.

For more information on how to enable authenticated visitors in your Zendesk instance, take a look at [our documentation on the subject](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/web/enabling_auth_visitors/).

## Table of Contents

- [Zendesk Messaging JWT example](#zendesk-messaging-jwt-example)
  - [Table of Contents](#table-of-contents)
  - [About The App](#about-the-app)
  - [Technologies](#technologies)
  - [Setup](#setup)
  - [Bug reports](#bug-reports)
  - [Credits](#credits)
  - [License](#license)

## About The App

For a quick demo, there is a built-in user database of users with first and last name, email, and password. You can use the below credentials to log in to a test instance of Zendesk and initiate a conversation. Note that no agents will be responding, but you will be able to see the bot interaction.

- email address: bsmith@example.com || lthompson@example.com || jrogers@example.com
- password: password123

The .env file contains private data that will not be visible to you. Once you Remix the project (see below), you will see the .env file, but the values will be scrubbed and you will be able to enter your own details.

## Technologies

This project uses [Node](https://nodejs.org/en) and [Express.js](https://expressjs.com/) for the backend, and vanilla-ish JS and HTML for the frontend. Styling utilizes [Tailwind CSS](https://tailwindcss.com/).

There are also two cookies added on login to handle the state changes of the login form. They are removed on logout.

## Setup

    - Open a terminal window and add the node packages with `npm install`
    - Navigate to the .env file and enter the key ID and shared secret for your widget. See [here](https://support.zendesk.com/hc/en-us/articles/4411666638746-Authenticating-end-users-in-messaging-for-the-Web-Widget-and-mobile-SDK#:~:text=To%20create%20and%20share%20a%20signing%20key) for information on obtaining these values.
    - Navigate to src/index.html and replace the widget key snippet with your own. See [here](https://support.zendesk.com/hc/en-us/articles/4408828655514-Working-with-messaging-in-the-Web-Widget-Legacy#:~:text=is%20turned%20on.-,To%20add%20the%20Web%20Widget%20to%20your%20website,-Click%20the%20Installation) for instructions on obtaining the key snippet.
    - Go back to your terminal and enter `npm run start`
    - Go to http://localhost:3000/ (or whatever port number you specified in .env)
  
- That's it, you're all set to go! You can now log in with one of the credentials listed above and start playing around with the authenticated experience. You can also choose the anonymous chat (which is only available)

## Bug reports

If you run into any issues or have suggestions, please [submit an issue](https://github.com/gkatechis/jwt-messaging-node-example/issues/new).

## Credits

List of contributors:

- Greg Katechis | Dev Advocacy @ Zendesk
- Tipene Hughes | Dev Advocacy @ Zendesk

## License

MIT license

