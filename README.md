# SplitEase

"Make bill splitting easy" - (SplitEase,2023)

## Description

SplitEase is a splitting service designed to simplify the process of dividing expenses among multiple parties. It leverages the Dinic flow algorithm to optimize debt repayment paths, resulting in the most efficient repayment plans.

## Features

1. Diversified splitting methods:

- Equal Split
- Exact Amounts
- Percentage Split
- Shares Split
- Adjustment Split
- Simplify Debts:

2. Utilizes advanced algorithms for debt simplification.

- Dynamic programming optimizes repayment plans.
- Max flow optimization minimizes transaction costs.

3. Notification:

- Easily notify group members or individuals to settle debts.
- Streamlines debt management and eliminates the need for manual follow-ups.
- Try SplitEase for a faster, more accurate, and cost-effective way to manage and repay debts.

## Getting Started

### Repo Structure

This repository follows a structured layout with a `backend` directory and a `frontend` directory.

The **backend** directory contains the source code (**src**) and testing (**test**) folders. The source code is organized into various modules including **controllers**, **middlewares**, **models**, **routes**, **services**, **utils**, and **views**. The testing folder includes unit tests for **controllers**, **models**, **routes**, and **utils**.

The **frontend** directory includes a public folder for public assets, such as css, fonts, images, and js. The src folder contains different parts of the frontend, including components, contexts, global, pages, and utils. The components folder stores reusable components such as Footer, Header, and Preloader. The pages folder contains specific pages of the application. Other folders like **contexts**, **global**, and **utils** are used for organizing related code and utilities.

```
.
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── middlewares
│   │   │   └── validators
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   └── views
│   └── test
│       └── unit
│           ├── controllers
│           ├── models
│           ├── routes
│           └── utils
└── frontend
    ├── public
    │   └── assets
    │       ├── css
    │       ├── fonts
    │       ├── images
    │       └── js
    └── src
        ├── components
        │   ├── Footer
        │   ├── Header
        │   └── Preloader
        ├── contexts
        ├── global
        ├── pages
        │   ├── Group
        │   ├── Home
        │   ├── Index
        │   ├── Liff
        │   └── Login
        └── utils
```

### Installing

1. Clone the repository from GitHub:

   `$ git clone git@github.com:limitching/SplitEase.git `

2. Navigate to the SplitEase directory:

   `$ cd SplitEase`

3. Environment setup:

   1. Server Deploment

      1. Navigate to the backend directory `cd backend`
      2. Install dependencies `npm install`
      3. Start MySQL server
      4. Import database: `mysql -u <user_name> -p <SplitEase_db_name> < splitease_backup.sql`
      5. Create config: `.env` for back-end server (You can copy the schema from template: [.env-template](https://github.com/limitching/SplitEase/blob/main/backend/.env.example))
      6. Start a redis server in `localhost` at port `6379`
      7. Start the server `npm start`

   2. Client Deployment:
      1. Navigate to the frontend directory `cd frontend`
      2. Install dependencies `npm install`
      3. Configure **API_HOST** to your server endpoint in `/src/global/constant.js`
      4. Start the server `npm run start`

## Authors

ex. Dominique Pizzie  
ex. [@DomPizzie](https://twitter.com/dompizzie)

## Version History

- 0.2
  - Various bug fixes and optimizations
  - See [commit change]() or See [release history]()
- 0.1
  - Initial Release

## Roadmap

Here are the planned features and improvements for future releases of SplitEase:

- Enhance unit testing and integration testing coverage
- Add functionality to browse archived group history information
- Implement the ability to insert expense receipt photos
- Add a "Forgot Password" feature
- Expand the capabilities of the LINE chatbot

Please note that this roadmap is subject to change and may be updated based on project priorities and user feedback. Stay tuned for future updates!

## License

This project is licensed under the [NAME HERE] License - see the LICENSE.md file for details

## Acknowledgments

Inspiration, code snippets, etc.
