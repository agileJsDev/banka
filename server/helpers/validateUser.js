import Joi from 'joi';

const name = Joi.string()
  .min(5)
  .max(50)
  .required();
const email = Joi.string()
  .min(5)
  .max(255)
  .email()
  .required();
const password = Joi.string()
  .min(5)
  .max(20)
  .required()
  .strict();
const type = Joi.string()
  .max(5)
  .optional();
const confirmPassword = Joi.any()
  .valid(Joi.ref('password'))
  .required().options({ language: { any: { allowOnly: 'must match password' } } });

const signUpScheama = {
  firstName: name,
  lastName: name,
  email,
  password,
  type,
  confirmPassword
};

const logInSchema = {
  email,
  password
};

const accountRegSchema = {
  type: name
};

// const validateWithSchenma = (data, inputSchema) => {
//   const schema = inputSchema;
//   return Joi.validate(data, schema);
// };

/* const validateAccountReg = (req, res, next) => {
  const { error } = validateWithSchenma(req.body, accountRegSchema);
  if (error) {
    return res.status(400).json({
      status: res.statusCode,
      error: error.details[0].message
    });
  }
  return next();
};

const validateSignUp = (req, res, next) => {
  const { error } = validateWithSchenma(req.body, signUpScheama);
  if (error) {
    return res.status(400).json({
      status: res.statusCode,
      error: error.details[0].message
    });
  }
  return next();
};

const validateLogIn = (req, res, next) => {
  const { error } = validateWithSchenma(req.body, logInSchema);
  if (error) {
    return res.status(400).json({
      status: res.statusCode,
      error: error.details[0].message
    });
  }
  return next();
}; */

const validate = (schema) => {
  const validateInput = (req, res, next) => {
    const { error } = Joi.validate(req.body, schema);
    if (error) {
      return res.status(400).json({
        status: res.statusCode,
        error: error.details[0].message
      });
    }
    return next();
  };
  return validateInput;
};

export default {
  signUp: validate(signUpScheama),
  logIn: validate(logInSchema),
  accountReg: validate(accountRegSchema)
};
