### Build Status

[![Build Status](https://travis-ci.com/Xwebyna/banka.svg?branch=development)](https://travis-ci.com/Xwebyna/banka) [![Coverage Status](https://coveralls.io/repos/github/Xwebyna/banka/badge.svg?branch=development)](https://coveralls.io/github/Xwebyna/banka?branch=development) [![Maintainability](https://api.codeclimate.com/v1/badges/cc41be350a7b19176b94/maintainability)](https://codeclimate.com/github/Xwebyna/banka/maintainability)

### banka
Banka is a light-weight core banking application that powers banking operations like account creation, customer deposit and withdrawals. 

#### **Homepage** - [Banka](https://this-banka.herokuapp.com/)
#### **Documentation** - [Api Documentation](https://this.banka.herokuapp.com/api-docs)

## Technology and Tools Stack
> - Uses `HTML` as the markup language for site structure and `CSS` for styling.
> - `ESlint` and `Babel` for code linting and transpiling respectively.
> - `Mocha` as a testing framework and `Chai` as an assertion library
> - The server side is built with `ExpressJS` which is a framework for building `Node.js` applications.
> - `Postgres` which is a object-relational database system.

## Features of banka

##Users
> - Users can signup for an account and login.
> - Users can create bank account
> - Users can view transaction history

##Admins/Staff
>- Admin/Staff can credit/debit users' accounts.
>- Admin/Staff can deactivate/delete users' bank accounts.
>- Admin/Staff can view list of bank accounts.
>- Admin/Staff can view list of bank accounts based on status and dormmant.

## Installation Steps

>- Clone repo to your machine

```
git clone https://github.com/Xwebyna/banka.git
```

>- Install application dependencies

```
npm install
```

>- Start development server
```
npm run dev


>- Start production server

```
npm run build
npm run start
```

## Testing

```
npm run test
```

## License

- MIT
