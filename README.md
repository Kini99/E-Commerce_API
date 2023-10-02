# E-Commerce API

This project provides a RESTful API for e-commerce operations such as product and category listing, cart management, and order processing.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Live Link](#live-link)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [API Documentation](#api-documentation)
- [Usage](#usage)

## Features

- Category Listing
- Product Listing by Category
- Product Details
- Cart Management (Add, Update, Remove Items)
- Order Placement
- Order History
- Order Details
- User Registration and Login
- Token-based Authentication
- Error Handling and Status Codes
- API Rate Limiting

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT) for Authentication
- Bcrypt for Password Hashing
- Express Rate Limiting
- Swagger for API Documentation

## Live Link

You may use the following server link to test the endpoints:

    https://e-commerce-api-5fdd.onrender.com

## Getting Started

### Prerequisites

- **Node.js and npm:** Ensure Node.js and npm are installed on your system.
- **MongoDB:** Set up a MongoDB database, either locally or on a cloud-based service.
- **API Testing Tool:** Use Postman or any other API testing tool for testing.

### Installation

1. **Clone the repository:**

    git clone https://github.com/Kini99/E-Commerce_API.git

2. **Install dependencies:**

    npm install

3. **Create a '.env file' in the root directory and add the following environment variables:**

    mongoURL=mongodb+srv://kinjal:Kinjal099@cluster0.pooiylr.mongodb.net/ecommerce-api?retryWrites=true&w=majority
    PORT=8080
    JWT_SECRET=secretkey

4. **Start the server:**

    npm run server

The server will start running at http://localhost:8080.

## API Documentation
Refer to the Swagger documentation for detailed information about each endpoint, including request parameters and responses. Swagger documentation for the API can be accessed at:

https://e-commerce-api-5fdd.onrender.com/docs/

or incase of running server on localhost:

http://localhost:8080/docs/

## Usage
Use Postman or any API testing tool to test the various API endpoints.
