# API Health Checker Dashboard

## Introduction
When we are working on a real project, it is vital to have a dashboard where we can find the availability of the backend services integrated with that project.
This solution can be used for that purpose.

> Demo App
![](https://user-images.githubusercontent.com/9147189/135744321-a4f58864-7331-4097-b83c-43edb2940d5a.png)

## Advantages
* Easy to find unavailable backend services
* Real-time updating the services' status in every “x” seconds (“x” can be configured. By default, “x” is 30 seconds)
* Easy to integrate services
* Can maintain multiple environments
* No need to worry about the [CORS issue](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
* Both Web and Mobile friendly UI
* Free and open-source

## Architecture
> Architecture
![](https://user-images.githubusercontent.com/9147189/135319309-3a8eda05-dc29-4df0-be03-5b921b17a822.PNG)

## API Health Checker Dashboard Vs Dynatrace Dashboard
| Criteria | API Health Checker Dashboard | Dynatrace Dashboard |
| ------------ | ------------ | ------------ |
| Real-time monitoring | Yes | Minimum interval is 5 minutes |
| Historical view | Not yet implemented | Yes |
| Integrating backend services | Only need to update in a single file | Need to create HTTP monitors per service and add it to the dashboard |
| Managing environments​ | Can maintain multiple environments via multiple json files | Need to create multiple HTTP monitors per each environment and service |
| Cost | Free and open-source | Paid tool |

## How to use?
**Pre-requisites:**
* [Node](https://nodejs.org/en/download/)
* [VSCode](https://code.visualstudio.com/download)

**Steps:**
1. Clone this project
2. Open the project in VSCode
3. Update the JSON files located in "***api-health-checker-dashboard/config***" with your Backend services' health routes
4. Save the changes
5. Open a terminal from VSCode
6. Execute ***`npm install`*** to install the node modules
7. Execute ***`npm run dev`*** to start the node application
8. Open the web application from http://localhost:5000

**Note: You won't be facing [CORS issue.](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) Because this application has a proxy layer to solve that issue. You can deploy this application as a node application.**

## Deployment
You can deploy this as a sample node application.

**Sample dashboard deployed: https://api-health-checker-dashboard.herokuapp.com**

## License
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/License_icon-mit-2.svg/2000px-License_icon-mit-2.svg.png" alt="MIT License" width="100" height="100"/> [API Health Checker Dashboard](https://medium.com/api-health-checker) is released under [MIT License](https://opensource.org/licenses/MIT)

## Copyright
Copyright 2021 [MaxSoft](https://maxsoftlk.github.io/).
