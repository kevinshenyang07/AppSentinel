# App Sentinel

[Take a look at App Sentinel](https://kevinshenyang07.github.io/AppSentinel/)

### Background

All the mobile companies understand the performance of their apps are critical to their success. The growth hackers care a lot about user activities, the marketeers care a lot about cost/downloads efficiency, and the engineers care a lot about high availability and low latency.

App Sentinel is a dashboard that is designed to visualize the most important metrics for one of those domains. In this case, I choose growth hacking - the topic I'm more familiar with.

App Sentinel is a front-end project, but it's designed to be able to be plugged into a live data feed from back-end easily. All visualzations ingest JSON data and have no dependencies on the back-end. To emulate that process it uses randomly generated data.

First four visualizations: 

![desktop1](docs/desktop1.png)

Fifth and sixth visualizations:

![desktop2](docs/desktop2.png)

The view on mobile:

![mobile](docs/mobile.png)

### Features and Implementation

Every visualzation is designed to present different levels of details interactively.

In this dashboard, it should has features below:

- [ ] all charts are displayed correctly and easy to read
- [ ] a user can click on the charts to view details
- [ ] a user can update some of the charts with dropdown menu

In addition, this project will include:

- [ ] A production Readme

### Architecture and Technologies

This project will be implemented with the following technologies:

- Vanilla JavaScript combined with `jQuery` for basic DOM manipulation and event handling.
- `D3.js` for constructing each visualization component.
- `Bootstrap` for making this app responsive.

File structure:

-- docs

-- lib (including main.js and other components)

-- application.css

-- index.html


### Bonus features

There are many directions this dashboard app could eventually go. Some of the useful features would be:

- [ ] Offer an "add" button to let users create a chart themselves.
- [ ] Charts are draggable.
