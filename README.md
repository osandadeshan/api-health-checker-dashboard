# API Health Checker Dashboard

## Introduction
When we are working on a real project it is vital to have dashboard where we can find the availability of the backend services integrated with that project.
This project can be used for that purpose.

> A sample dashboard.

![](https://github.com/osandadeshan/api-health-checker-dashboard/blob/master/dashboard-screenshot.PNG)

## Advantages
* Easy to find unavailable backend services
* No need to worry about the CORS issue
* Real-time updating the services statues in 5 seconds interval
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
3. Open "***components.js***" located in "***api-health-checker-dashboard/public/js/components.js***"
4. Change the "***services***" object array in ***line number 5***, with your backend services' name, description and id
5. Open "***index.js***" located in "***api-health-checker-dashboard/index.js***"
6. Change the "***healthCheckEndpoints***" object in ***line number 9***, with your backend services' id and url
7. Save the changes
8. Open the terminal in VSCode
9. Execute ***`npm install`*** to install the node modules
10. Execute ***`npm run dev`*** to start the node application
11. Open the web application from http://localhost:5000

**Note: You won't be facing [CORS issue.](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) Because this application has a proxy layer to solve that issue. You can deploy this application as a node application.**

## License
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/License_icon-mit-2.svg/2000px-License_icon-mit-2.svg.png" alt="MIT License" width="100" height="100"/> [API Health Checker Dashboard](https://github.com/osandadeshan/api-health-checker-dashboard) is released under [MIT License](https://opensource.org/licenses/MIT)

## Copyright
Copyright 2020 MaxSoft.
