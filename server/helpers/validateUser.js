import Joi from 'joi';

const name = Joi.string()
  .trim()
  .strict()
  .min(5)
  .max(50)
  .required()
  .regex(/^[a-zA-Z]+$/)
  .options({ language: { string: { regex: { base: 'must only contain letters' } } } });


const email = Joi.string()
  .trim()
  .strict()
  .min(5)
  .max(255)
  .email()
  .required();
const password = Joi.string()
  .min(5)
  .max(20)
  .required()
  .strict()
  .regex(/^(?=.*[0-9]+.*)(?=.*[A-Z]+.*)[0-9a-zA-Z]+/)
  .options({ language: { string: { regex: { base: 'must only contain lowercase and uppercase characters with numbers' } } } });

const role = Joi.string()
  .valid('0', '1')
  .trim()
  .required();

const accountType = Joi.string()
  .valid('savings', 'current')
  .trim()
  .required();

const confirmPassword = Joi.any()
  .valid(Joi.ref('password'))
  .required()
  .strict()
  .options({ language: { any: { allowOnly: 'must match password' } } });

const status = Joi.string()
  .valid('active', 'dormant')
  .trim()
  .required();

const amount = Joi.number()
  .min(100)
  .positive()
  .precision(2)
  .required();

const newPassword = Joi.string()
  .min(5)
  .max(20)
  .required()
  .strict();

const confirmNewPassword = Joi.any()
  .valid(Joi.ref('newPassword'))
  .required()
  .options({ language: { any: { allowOnly: 'must match new password' } } });

// Schema for Sign Up
const signUpScheama = {
  firstName: name,
  lastName: name,
  email,
  password,
  confirmPassword
};

// Schema for Login
const logInSchema = {
  email,
  password
};

// Admin/Staff Create Account Schema
const AdminStaffSchema = {
  firstName: name,
  lastName: name,
  email,
  role
};

// Schema for Bank Account Registration [TYPE = Account Type]
const accountRegSchema = {
  type: accountType
};

// Schema for Account Status Update
const updateStatusSchema = {
  status
};

// Schema to debit/credit account
const debitCreditSchema = {
  amount
};

// Update password Schema
const updatePasswordSchema = {
  password,
  newPassword,
  confirmNewPassword
};

// Input Validation Function
const validate = (schema) => {
  const validateInput = (req, res, next) => {
    const { error } = Joi.validate(req.body, schema);
    if (error) {
      return res.status(400).json({
        status: res.statusCode,
        error: error.details[0].message.replace(/[\\"]+/g, "'")
      });
    }
    return next();
  };
  return validateInput;
};

export default {
  signUp: validate(signUpScheama),
  logIn: validate(logInSchema),
  accountReg: validate(accountRegSchema),
  updateStatus: validate(updateStatusSchema),
  updateAccount: validate(debitCreditSchema),
  updatePassword: validate(updatePasswordSchema),
  createAdminStaff: validate(AdminStaffSchema)
};
