# API Health Checker Dashboard

## Introduction
When we are working on a real project it is vital to have dashboard where we can find the availability of the backend services integrated with that project.
This project can be used for that purpose.

> A sample dashboard.

![](https://github.com/osandadeshan/api-health-checker-dashboard/blob/master/dashboard-screenshot.PNG)

## Advantages
* Easy to find unavailable backend services
* No need to worry about the CORS issue
* Real-time updating the services status in every 30 seconds
* Easy to integrate services to see the health
* Both Web and Mobile friendly UI
* Free and open-source

## How to use?
**Pre-requisites:**
* [Node](https://nodejs.org/en/download/)
* [VSCode](https://code.visualstudio.com/download)

**Steps:**
1. Clone this project
2. Open the project in VSCode
3. Open "***config.json***" located in "***api-health-checker-dashboard/config/config.json***"
4. Update the JSON file with your Backend services' health routes
5. Save the changes
6. Open the terminal in VSCode
7. Execute ***`npm install`*** to install the node modules
8. Execute ***`npm run dev`*** to start the node application
9. Open the web application from http://localhost:5000

**Note: You won't be facing [CORS issue.](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) Because this application has a proxy layer to solve that issue. You can deploy this application as a node application.**

**Sample dashboard deployed: https://api-health-checker-dashboard.herokuapp.com**

## License
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/License_icon-mit-2.svg/2000px-License_icon-mit-2.svg.png" alt="MIT License" width="100" height="100"/> [API Health Checker Dashboard](https://github.com/osandadeshan/api-health-checker-dashboard) is released under [MIT License](https://opensource.org/licenses/MIT)

## Copyright
Copyright 2020 [MaxSoft](https://maxsoftlk.github.io/).
