# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

To run the project locally, run:

### `npm run start --prefix /Users/kdv/Projects/GratefulProject/xmas-bingo-22`

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Google Apps Script backend (optional)

This project can optionally use a Google Apps Script + Google Sheets backend to store and share Bingo themes. The frontend calls two endpoints on the deployed web app:

- GET ?action=list  -> returns JSON { themes: [...] }
- POST (FormData) with action=delete and themeName -> deletes matching rows

If you want to enable server-backed deletes, follow these steps:

1. Open Google Apps Script (https://script.google.com/) and create a new project.
2. Replace the default Code.gs with the script provided in the repo (or use your own). Set the `SPREADSHEET_ID` constant in the script to the ID of your spreadsheet and ensure there's a sheet named `themes`.
3. Deploy the script as a Web App: Publish > Deploy as web app (or Deploy > New deployment). Important: set "Execute as" to your account (Me) and set "Who has access" to "Anyone, even anonymous" if you want anonymous clients to be able to call it from the browser.
4. Copy the Web App URL and paste it into `src/BingoArray.js` as the `SCRIPT_URL` constant.
5. (Optional) To protect deletes, set `DELETE_SECRET` in the Apps Script and paste the same value into `src/BingoArray.js` `DELETE_SECRET` export. When set, the client will include the secret in delete requests.

Notes:
- When deploying, Google tends to issue a new URL for each deployment. Make sure the URL in `src/BingoArray.js` matches the latest deployment you want to use.
- For development you can leave `DELETE_SECRET` empty; deletes will not require a secret in that case.
- If you see 302->405 when testing with curl, try testing from the browser first; Google deployment redirect behavior can differ for CLI requests.

