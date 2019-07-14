### Build Status

[![Build Status](https://travis-ci.com/ayodejiAA/banka.svg?branch=development)](https://travis-ci.com/ayodejiAA/banka)
[![Coverage Status](https://coveralls.io/repos/github/ayodejiAA/banka/badge.svg?branch=development)](https://coveralls.io/github/ayodejiAA/banka?branch=development) [![Maintainability](https://api.codeclimate.com/v1/badges/cc41be350a7b19176b94/maintainability)](https://codeclimate.com/github/ayodejiAA/banka/maintainability)

# Banka

Banka is a light-weight core banking application that powers banking operations like account creation, customer deposit and withdrawals.

#### **Heroku** - [Banka API](https://this-banka.herokuapp.com/)

#### **Documentation** - [Api Documentation](https://this-banka.herokuapp.com/api-doc)

### **UI** - [Banka UI](https://ayodejiAA.github.io/banka/ui/)

## Technology and Tools Stack

> - Uses `HTML` as the markup language for site structure and `CSS` for styling.
> - `ESlint` and `Babel` for code linting and transpiling respectively.
> - `Mocha` as a testing framework and `Chai` as an assertion library
> - The server side is built with `ExpressJS` which is a framework for building `Node.js` applications.
> - `Postgres` which is a object-relational database system.

## Features of banka

#### Users

> - Users can signup for an account and login.
> - Users can create bank account
> - Users can view transaction history

#### Admins/Staff

> - Staff (Cashier) can credit/debit users' accounts.
> - Admin/Staff can delete users' bank accounts.
> - Admin/Staff can view list of user's bank accounts.
> - Admin/Staff can view list of bank accounts.
> - Admin/Staff can view list of bank accounts based on status - Active and dormant.

## Installation Steps

> - Clone repository to your machine

```
git clone https://github.com/ayodejiAA/banka.git
```

> - Install application dependencies

```
npm install
```

> - Setup the environment variables

```
Go to Config Folder
```

> - Start development server

```
npm run dev
```

> - Start production server

```
npm run build
npm start
```

## Testing

```
npm test
```

## License

- MIT
