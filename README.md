# SplitEase

[![SplitEase logo](https://github.com/limitching/SplitEase/blob/documents/docs/images/SplitEase_logo.jpeg)](https://splitease.cc/)

> "Make bill splitting easy" - (SplitEase,2023)

Tired of struggling to keep track of shared expenses with your friends during outings?
Look no further, because SplitEase is here to make splitting bills easily!

Website URL: [https://splitease.cc/](https://splitease.cc/)

## Description

SplitEase is a splitting service designed to simplify the process of dividing expenses among multiple parties. It leverages the Dinic flow algorithm to optimize debt repayment paths, resulting in the most efficient repayment plans.

## Table of Contents

- [SplitEase](#splitease)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
    - [Diversified splitting methods](#diversified-splitting-methods)
    - [Debt simplification](#debt-simplification)
    - [Notification and debt management](#notification-and-debt-management)
    - [Real-Time Expense Updates](#real-time-expense-updates)
  - [Getting Started](#getting-started)
    - [Demo accounts](#demo-accounts)
    - [Binding LINE account](#binding-line-account)
  - [Algorithm](#algorithm)
    - [Dinic Maxflow Algorithm](#dinic-maxflow-algorithm)
  - [Architecture](#architecture)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [Table Schema](#table-schema)
  - [API Documentation](#api-documentation)
  - [Repo Structure](#repo-structure)
  - [Installation](#installation)
  - [Roadmap](#roadmap)
  - [Version History](#version-history)
  - [License](#license)
  - [Contact me](#contact-me)

## Features

### Diversified splitting methods

SplitEase supports a variety of splitting methods to accommodate different scenarios.

- Equal Split
- Exact Amounts
- Percentage Split
- Shares Split
- Adjustment Split

![Splitting Methods](https://github.com/limitching/SplitEase/blob/documents/docs/images/SplitEase_Split_Method.gif)

### Debt simplification

SplitEase utilizes the Dinic Maxflow algorithm to simplify debt relationships between multiple users.

![Debts Simplification Process](https://github.com/limitching/SplitEase/blob/documents/docs/images/SplitEase_Simplify_Debts.gif)

### Notification and debt management

- Easily notify group members or individuals to settle debts.
- Streamlines debt management and eliminates the need for manual follow-ups.
- Try SplitEase for a faster, more accurate, and cost-effective way to manage and repay debts.

![LINE Notification](https://github.com/limitching/SplitEase/blob/documents/docs/images/SplitEase_Notification.gif)

### Real-Time Expense Updates

SplitEase leverages Socket.IO to enable real-time expense information updates for users.

- When a user updates an expense record, other users in the same group will receive an "Expense changed" event through Socket.IO, updating their state.
- The frontend React application listens for this event and sends a request to the backend API to keep the user's expenses information up to date.

![Websocket Architecture](https://github.com/limitching/SplitEase/blob/documents/docs/images/SplitEase_websocket_Architechture.jpeg)

Additionally, SplitEase utilizes a Redis adapter to ensure synchronized updates when scaling horizontally.

![Redis Adapter](https://github.com/limitching/SplitEase/blob/documents/docs/images/SplitEase_Adapter.jpeg)

## Getting Started

### Demo accounts

You can use the following test accounts to try out the SplitEase service:

```
Email: example1@example.com
Password: Example123!
```

### Binding LINE account

You can bind your LINE account to SplitEase to receive notifications through the LINE chatbot.

**If you're login with LINE account, you can skip this step.**

**If you're login with native email, you can follow the steps below to bind your LINE account.**

1. Login to SplitEase with your email and password.
2. Click the **Profile** icon in the top right corner.
3. Click the **Copy LINE Binding Code** button.
4. Open the LINE app on your mobile device and add our chatbot as a friend: [@757qejcl](https://line.me/R/ti/p/@757qejcl)
5. Send the copied binding code to the chatbot.

![Binding LINE](https://github.com/limitching/SplitEase/blob/documents/docs/images/SplitEase_Binding_LINE.gif)

## Algorithm

Just imagine that the debt relationship between multiple people can be represented by a directed graph. The vertex of this graph is the user, the directed edge is the debt on behalf of the debt, and the direction of the arrow is from the creditor to the debtor.

I organize the debts between all users into a residual graph, traverse through the Dinic Maxflow algorithm and find the maximum money flow between any two users, and simplify the residual graphs.
Finally, the optimal repayment path can be calculated.

### Dinic Maxflow Algorithm

The Dinic Maxflow algorithm is used to find the maximum flow in a flow network. It is based on the concept of residual graphs and augmenting paths.

#### Definition

Let $G$ be a directed graph with vertices $V$ and edges $E$. Each edge $(u, v)$ in $E$ has a non-negative capacity $c(u, v)$. The flow network $G$ is defined as a tuple $(G, s, t, c)$, where $s$ is the source node and $t$ is the sink node.

The **residual capacity** defined as,

1. if $(u, v) \in E$, then $c_f(u, v) = c(u, v) - f(u, v)$
2. if $(v, u) \in E$, then $c_f(u, v) = f(v, u)$
3. otherwise, $c_f(u, v) = 0$.

Here, $f(u, v)$ represents the flow on edge $(u, v)$.

The **residual graph** $G_f$ of $G$ is defined as a tuple $(V, E_f)$, where $E_f$ is the set of residual edges in $G$.

An **augmenting path** is a simple path from $s$ to $t$ in the residual graph $G_f$.

$dist(v)$ represents the shortest distance from $s$ to $v$ in the residual graph $G_f$.

The **level graph** $G_L$ is a subgraph of $G_f$ that contains all edges $(u, v)$ in $G_f$ such that $dist(v) = dist(u) + 1$.

A **blocking flow** is a flow $f$ in $G$ such that there is no augmenting path in the residual graph $G_f$.

#### Algorithm

1. **Input**: A directed graph $G$ (`user debts`) with capacities （`debt`） assigned to its edges, a source node $s$ (user $i$), and a sink node $t$ (user $j$).
   $$G = ((V, E),c,s,t)$$

2. **Initialize** the flow network with zero flow on each edge and residual capacities equal to the original capacities.

$$f(e) = 0\quad \text {for each}  \quad e\in E$$

3. **While** there exists an augmenting path in the residual graph from $s$ to $t$, do the following steps:

   1. **Apply Breadth-First Search (BFS)** to build level graph $G_L$ from $s$ to $t$ in the residual graph. The BFS traversal ensures that only the shortest paths are considered.

   $$\text {Construct}\quad G_L\quad \text {from}\quad G_f\quad \text{of}\quad G.$$
   $$\text{If}\quad dist(t) = \infty\text{, then terminate the algorithm and output the maximum flow value}\quad f.$$

   2. **Determine the blocking flow** in $G_L$ by finding the minimum residual capacity $C_{min}$ along the augmenting path.

   3. **Update the flow** along the augmenting path by adding $C_{min}$ to the flow $f$ of each edge and subtracting $C_{min}$ from the residual capacity of each edge in the augmenting path. **Then go back to step i.**

4. **Output**: The maximum flow value $f$ obtained is the sum of flows from the source node $s$ to the sink node $t$ in the final flow network.

The time complexity of the Dinic Maxflow algorithm is $O$($V^2E$), where $V$ is the number of vertices and $E$ is the number of edges in the flow network.

For a more detailed explanation and mathematical formulas, please refer to the relevant textbooks or research papers.

![MaxFlow example](https://github.com/limitching/SplitEase/blob/documents/docs/images/SplitEase_Maxflow.gif)

## Architechture

### Backend

- **Optimization:** Deployed static files with **AWS S3** and **CloudFront**, enhancing user browsing experience through improved speed and accessibility.
- **Scalable:** Strengthened server scalability under high-traffic load by leveraging **AWS Application Load Balancer**, **EC2 Auto Scaling Group**, and **Redis adapter for Socket.IO**.
- **LINE Message Integration:** Integrated LINE message API to notify users, leveraging its popularity among 90% of Taiwan users.

![Backend Architecture](https://github.com/limitching/SplitEase/blob/documents/docs/images/SplitEase_Backend_Architechture.jpeg)

### Frontend

- **React:** The frontend is built using the React library.
- **Context Provider:** Shared state across multiple pages is extracted and managed using Context Provider.
- **Components:** Commonly used components are componentized for reusability.
- \***\*React Router DOM:** Route management is handled using React Router DOM.

![Frontend Architecture](https://github.com/limitching/SplitEase/blob/documents/docs/images/SplitEase_frontend_Architechture.jpeg)

## Table Schema

The table schema of our application follows a **multi-database architecture**. The majority of the data is stored in RDS, while the `Expense` data is separated and stored in MongoDB Atlas.

### Why use both RDS and MongoDB Atlas?

Let's take a closer look at the content stored in the Expense data. The Expense table stores the IDs of the involved users along with their respective shares or split percentages. In the case of using the "split by adjustments" method, additional adjustments for each involved user need to be stored. **This kind of data is not well-structured and can be complex**.

In my personal opinion, NoSQL databases like MongoDB are more suitable for storing such complex, unstructured, and continuously growing behavioral data.

However, this decision does come with some drawbacks, such as the increased maintenance cost of managing two different database systems, including setup, management, and monitoring. Additionally, extra programming logic is required to handle data synchronization and consistency between the two databases (e.g., transactions).

![Table Schema](https://github.com/limitching/SplitEase/blob/documents/docs/images/SplitEase_Table_Schema.jpeg)

## API Documentation

For detailed information about the SplitEase API and its endpoints, please refer to the Swagger API documentation:

[Swagger API Documentation](https://api.splitease.cc/api-docs/)

The Swagger API documentation provides an overview of all the available endpoints, their request/response formats, and any necessary authentication requirements. It serves as a comprehensive reference for integrating with the SplitEase API.

## Repo Structure

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

## Installation

1. Clone the repository from GitHub:

   `$ git clone git@github.com:limitching/SplitEase.git `

2. Navigate to the SplitEase directory:

   `$ cd SplitEase`

3. Environment setup:

   1. Server Deploment

      1. Navigate to the backend directory `cd backend`
      2. Install dependencies `npm install`
      3. Start **MySQL server**
      4. Import database: `mysql -u <user_name> -p <SplitEase_db_name> < splitease_backup.sql`
      5. Create config: `.env` for back-end server (You can copy the schema from template: [.env-template](https://github.com/limitching/SplitEase/blob/main/backend/.env.example))
      6. Start **Redis server** in `localhost` at port `6379`
      7. Start the server `npm start`

   2. Client Deployment:
      1. Navigate to the frontend directory `cd frontend`
      2. Install dependencies `npm install`
      3. Configure **API_HOST** to your server endpoint in `/src/global/constant.js`
      4. Start the server `npm run start`

## Roadmap

Here are the planned features and improvements for future releases of SplitEase:

- Enhance **unit testing** and **integration testing** coverage
- Add functionality to **browse archived group history** information
- Implement the ability to insert **expense receipt photos**
- Add a "**Forgot Password**" feature
- Expand the **capabilities of the LINE chatbot**

Please note that this roadmap is subject to change and may be updated based on project priorities and user feedback. Stay tuned for future updates!

## Version History

- 1.5
  - Various bug fixes and optimizations
  - **API Documentation**
  - **README**
- 1.4
  - Various bug fixes and optimizations
  - **Unit Test**
- 1.3
  - Various bug fixes and optimizations
  - **Refacroting**
  - Refine **Error Handling**
- 1.2
  - Various bug fixes and optimizations
  - Add **Dashboard feature** for group expense management
  - Add **Bot feature** for notification and debt management
  - Add **SettleUp feature** for debt management
  - Add **Log feature** for group history management
  - Add **Edit Profile feature** for group history management
  - Add **Eexpense synchronization** for expense management
  - Make Frontend **stateless**
- 1.1
  - Various bug fixes and optimizations
  - Add **Group feature** for basic group management
- 1.0
  - Initial Release

## License

This project is licensed under the [NAME HERE] License - see the LICENSE.md file for details

## Contact me

If you have any questions, suggestions, or would like to collaborate on the SplitEase project, feel free to reach out to me:

- Name: Hung Wei-Ching
- Email: hwc0320@gmail.com
- Telegram: [@limitching](https://t.me/limitching)
- LinkedIn: [limitching](https://www.linkedin.com/in/limitching/)

I'm excited to connect with you and discuss anything related to SplitEase. Don't hesitate to contact me!
