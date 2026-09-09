# BORROWING POWER CALCULATOR

**Author:** Priscella Maenar

## Setup

Make sure you have Node.js installed.

Clone or download the project.

Install dependencies:
```
npm install
```

The project uses `dotenv` to load the API URL and Bearer token from environment variables.

If `dotenv` is not already installed, install `dotenv`:
```
npm install dotenv
```
Create a `.env` file in the project root containing:
```
URL=http://localhost:3000/
BEARER_TOKEN=pat_abcdefghijklmnopqrstuvwxyz0123456789
```

## Running the Development API

### Server

The development API must be running before using the calculator or running tests that require communication with the API.
(The server will be available at http://localhost:3000/).
To start the server run the following command:
```
npm run api
```
Keep this terminal running while using the calculator or running the tests.

Note: Press **Ctrl+C** to stop the server.


## Running the Calculator

With the development API running, open another terminal and run the calculator with:
```
npm start
```

## Testing

With the development API running, open another terminal and run tests with:
```
npm test
```
The test suite covers:

- API URL and Bearer token configuration.
- Retrieving income tax from the API.
- Retrieving HEM from the API.
- Handling an API error response.
- Calculating borrowing power using standard values.
- Returning zero borrowing power when the calculated repayment capacity is not positive.

## Assumptions:

- The provided API (`server.js`) is assumed to be the source of truth for tax and HEM calculations.
- The default loan term is 30 years (360 months).

## Design Decision

- Class-Based Design
  - The borrowing power calculator was moved into the `BorrowingCalculator` class.
  - Keeps the calculation logic separate from the console interface.
  - Keeps related calculator functionality together in one place.
  - Makes the code easier to organize as more calculator functionality is added.
  - Allows configuration such as the API URL, Bearer token, and loan term to be stored as properties of the calculator.
  - Makes the calculator easier to reuse and test independently from the console interface.


- API Communication
  - Api communication is handled through a reusable `fetchJSON()` method.
  - The `getTax()` and `getHEM()` methods use this method to communicate with the appropriate API endpoints.
  - Avoids duplication of the authentication and error-handling logic for each endpoint.


- Environment Variables
  - The API URL and bearer token are loaded using `.env` instead of hardcoding them directly in the calculator class.
  - Makes the configuration easier to change between environments without changing the application code.
  - The `.env` file is added to `.gitignore` to ensure secrets are not accidentally pushed to version control.
  - Using `.env` keeps secret safe.


- API Errors
  - Try/catch blocks are used to catch errors for API responses that are unsuccessful and handle them gracefully.
  - Meaningful error messages is displayed to the user.

## Tradeoffs

### Class-Based Structure vs. Standalone Functions

- The borrowing power calculation was moved into a `BorrowingPowerCalculator` class instead of keeping the calculations as functions. 
- A class introduces more structure and code than a collection of standalone functions. 
- For a simpler calculator, standalone functions could be enough and easier to understand. 
- However, if the calculator is going to be expanded with more functionality in the future, it will be more manageable with the class structure.

## Project Structure

```
project/
├── BorrowingPowerCalculator.js     # Main calculator class and API communication
├── borrowingCalculator.js          # Console interface and user input
├── test_calculator.js              # Test suite
├── server.js                       # Provided development API
├── server.md                       # Provided API documentation
├── REQUIREMENTS.md                 # Original code challenge requirements
├── package.json                    # Project configuration and dependencies
├── package-lock.json               # Locked dependency versions
├── .gitignore                      # Files excluded from version control
└── README.md                       # Project documentation
```

The console interface collects user input and passes it to the
`BorrowingPowerCalculator` class. The calculator class handles API
communication and performs the borrowing power calculation using the
values returned by the provided development API.