import pool from './index';

// Drop tables
const dropTables = process.env.NODE_ENV === 'test' ? 'DROP TABLE IF EXISTS users, accounts, transactions;' : '';

// Create Database Tables
const createTables = `
CREATE TABLE IF NOT EXISTS users
  (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    firstName VARCHAR(100)  NOT NULL,
    lastName VARCHAR(100)  NOT NULL,
    password VARCHAR(255)  NOT NULL,
    type  VARCHAR(10) NOT NULL,
    isAdmin boolean NOT NULL DEFAULT false,
    createdDate TIMESTAMPTZ DEFAULT now() NOT NULL,
    modifiedDate TIMESTAMPTZ DEFAULT now() NOT NULL
  );
  CREATE TABLE IF NOT EXISTS accounts
  (
    id SERIAL PRIMARY KEY,
    accountNumber INTEGER NOT NULL,
    createdDate  TIMESTAMPTZ DEFAULT now() NOT NULL,
    owner INTEGER NOT NULL,
    type VARCHAR(10) NOT NULL,
    status VARCHAR(10) DEFAULT 'active',
    balance FLOAT NOT NULL DEFAULT 1000,
    modifiedDate TIMESTAMPTZ DEFAULT now() NOT NULL
  );
  CREATE TABLE IF NOT EXISTS transactions
  (
    transactionId SERIAL PRIMARY KEY,
    createdDate  TIMESTAMPTZ DEFAULT now() NOT NULL,
    type VARCHAR(10) NOT NULL,
    accountNumber INTEGER NOT NULL,
    cashier INTEGER NOT NULL,
    amount FLOAT NOT NULL DEFAULT 1000,
    oldBalance FLOAT NOT NULL,
    newBalance FLOAT NOT NULL
  );
  `;

const dbTableSetup = async () => {
  try {
    await pool.query(`${dropTables} ${createTables}`);
    console.log('db Created');
  } catch (err) {
    console.log(err);
  }
};

dbTableSetup();
