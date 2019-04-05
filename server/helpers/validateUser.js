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
  .required();
const type = Joi.string()
  .max(5)
  .optional();

const signUpScheama = {
  firstName: name,
  lastName: name,
  email,
  password,
  type
};

const logInSchema = {
  email,
  password
};

const validateWithSchenma = (data, inputSchema) => {
  const schema = inputSchema;
  return Joi.validate(data, schema);
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
};

export default { signUp: validateSignUp, logIn: validateLogIn };
