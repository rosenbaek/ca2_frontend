# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

1. Change backend URL in constants.js
2. run `npm install`

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

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

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Deploy to Nginx

### Assumptions:

1.  Your React App is based on create-react-app package (you are using react-router-dom).
2.  You are using Nginx and the root path is being used by another service (or even another React/Gatsby App which is my case).
3.  You want to deploy the React App on a subdirectory and be able to serve all statics of your React App from that subdirectory.

### React App Changes:

Based on official documentation.

1.  Update your BrowserRouter by adding a basename. Example: `<BrowserRouter basename="/webapp">`.
```react
ReactDOM.render(
	<React.StrictMode>
		<Router basename="/webapp">
			<App />
		</Router>
	</React.StrictMode>,
	rootElement
);
```
3.  Specify a homepage on first line of your package.json. Example: `"homepage": "/webapp”`.
4.  If you are referencing a static file by its relative path, you should add the subdirectory to that reference.
5.  Example: `src="/static/logo/logo.png"` becomes `src="/webapp/static/logo/logo.png”`.  
    

  

1.  Add the following to package.json “scripts”  
    `"deploy": "bash ./script.sh”`
2.  Create a script file named "script.sh” with the following (Change ip to yours):  
    `scp -r ./build root@<ip address>:/var/www/metro`
3.  When all is set up run `npm run build`​ then `​npm run deploy`

### Nginx Changes:

1.  `nano /etc/nginx/sites-enabled/default`

2. Add below and change the name from "myapp" to the basename you set on the browser router
```
location ^~ /myapp {  
 alias /var/www/myapp/build;  
 try_files $uri $uri/ /myapp/index.html;  
}
```
3. docker container restart tomcat_3sem       

### Full example of nginx config file

`/etc/nginx/sites-enabled/default`:

```
upstream tomcat {
    server 127.0.0.1:8081 fail_timeout=0;
}

server {
        root /var/www;
        index index.html index.htm index.nginx-debian.html;

        server_name example.com;

        location ^~ /webapp {
            alias /var/www/webapp/build;
            try_files $uri $uri/ /webapp/index.html;
        }

        location /test {
            root /var/www/;
        }
        location / {
            # First attempt to serve request as file, then
            # as directory, then fall back to displaying a 404.
            # try_files $uri $uri/ =404;
            include proxy_params;
            proxy_pass http://tomcat/;

        }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/edu.bugelhartmann.dk/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/edu.bugelhartmann.dk/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = example.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

        server_name example.com;
    listen 80;
    return 404; # managed by Certbot
}
```
