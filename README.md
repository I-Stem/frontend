# Devops Metrics

- [![Maintainability](https://api.codeclimate.com/v1/badges/3865951ea0349d17fc2e/maintainability)](https://codeclimate.com/github/I-Stem/frontend/maintainability)
- [![Test Coverage](https://api.codeclimate.com/v1/badges/3865951ea0349d17fc2e/test_coverage)](https://codeclimate.com/github/I-Stem/frontend/test_coverage)

# Introduction

   For an intro about who we are and what we aim to develop, go [here](https://i-stem.github.io).

## Accommodation automation services frontend

   This is frontend repo for the AI-powered I-Stem assistive technology solutions. Currently the functionalities for registered users include:

   * Ability to submit request  for screen-reader accessible textual content from images and pdf files powered by advance solution for math, table and column layout detection techniques.
   * Ability to get captions for audio and video content both for standard AI captioning models or custom domain specific language models.
   * Overview of credit transaction history as per different services used by user.



# Contents

* [Tech Stack](#tech-stack)
* [What this repo does?](#what-this-repo-does?)
* [Global Packages](#global-packages)
* [Project Setup](#project-setup)
* [Getting Started](#getting-started)
* [API documentation](#api-documentation)

# Tech stack

-   **Next.js** - Minimalistic framework for server-rendered React applications.
-   **Typescript** - Superset of JavaScript which primarily provides optional static typing, classes and interfaces.
-   **Redux** - A predictable state container for JavaScript apps.
-   **Express.js**- A minimal and flexible Node.js web application framework that handles server-side rendering and integrates with Next.js.
-   **Sass/Scss** - CSS preprocessor, which adds special features such as variables, nested rules and mixins (sometimes referred to as syntactic sugar) into regular CSS.
-   **Babel** - The compiler for next generation JavaScript.
-   **ESLint** - The pluggable linting utility.
-   **Bundler Analyzer** - Visualize the size of webpack output files with an interactive zoomable treemap.
-   **Jest** - Javascript testing framework , created by developers who created React.
-   **React Testing Library** - Simple and complete React DOM testing utilities that encourage good testing practices.
-   **next-runtime-dotenv** - Expose environment variables to the runtime config of Next.js
-   **Material UI** - React components for faster and easier web development. Currently, the project have some ant components, but some of the current ant library components have accessibility issues with screen reader, therefore material UI is being tried out as an alternative. Other accessible UI components are included from libraries like, reach-ui, reakt.io and chakra as per need.
-   **Nodemon** - nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.   

# What this repo does?

* Contains only frontend components for all user interactions.
* collects data on how user is interacting with website using google analytics using react-ga.
* There are no direct databases or external API calls from this repo to 3rd-party services. It calls "lip-api" repo for all database, queuing and workflow related decisions.
* Uses next.js for server-side and static rendering of web pages for faster loads.
* Caches user preferences in user local storage for faster loads and distributed processing using redux-persist library.

# Global Packages

|  Package |  URL |  
|---|---|
|  Node.js ^12.x|  https://nodejs.org/en/download/  |   
| Yarn  | https://classic.yarnpkg.com/en/docs/install/  |   

# Project Setup

```sh
# Install git for Linux
sudo apt install git

# Clone the repo: https://github.com/I-Stem/lip-web
git clone https://github.com/I-Stem/lip-web
cd lip-web
```

# Getting Started

> _Note: Copy the ".env.example"  file from root project folder and change its name to ".env" file and paste in the project root folder alongside ".env.example"_

### Installing the dependencies:

**Using npm**

```sh
npm install
```

**Using yarn**

```sh
yarn install
```

### Starting the development server:

**Using npm**

```sh
npm run start:dev
```

**Using yarn**

```sh
yarn start:dev
```

### Launch the UI on http://localhost:3000

### Peer repos

   The following repos must also be setup to use full functionality of this repo:

* [Backend repo](https://github.com/I-Stem/backend)
* [Repo containing all AI models and services](https://github.com/I-Stem/science)

# API documentation

   Please have a look [here](https://i-stem.github.io/frontend).