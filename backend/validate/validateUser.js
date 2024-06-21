import Joi from "joi";

const userSignupValidation = Joi.object(
  {
    firstName: Joi.string().min(3).trim().max(50).required().messages({
      "string.base": "First Name should be a type of text",
      "string.empty": "First Name cannot be an empty field",
      "string.min": "First Name should have a minimum length of {#limit}",
      "string.max": "First Name should have a maximum length of {#limit}",
      "any.required": "First Name is a required field",
    }),
    lastName: Joi.string().min(3).trim().max(50).required().messages({
      "string.base": "Last Name should be a type of text",
      "string.empty": "Last Name cannot be an empty field",
      "string.min": "Last Name should have a minimum length of {#limit}",
      "string.max": "Last Name should have a maximum length of {#limit}",
      "any.required": "Last Name is a required field",
    }),
    email: Joi.string().min(3).trim().max(30).required().email().messages({
      "string.base": "Email should be a type of text",
      "string.empty": "Email cannot be an empty field",
      "string.min": "Email should have a minimum length of {#limit}",
      "string.max": "Email should have a maximum length of {#limit}",
      "any.required": "Email is a required field",
      "string.email": "Email must be a valid email",
    }),
    password: Joi.string().trim().min(8).required().messages({
      "string.base": "Password should be a type of text",
      "string.empty": "Password cannot be an empty field",
      "string.min": "Password should have a minimum length of {#limit}",
      "any.required": "Password is a required field",
    }),
    confirmPassword: Joi.string()
      .trim()
      .min(8)
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "string.base": "Cofirm password should be a type of text",
        "string.empty": "Cofirm password cannot be an empty field",
        "string.min":
          "Cofirm password should have a minimum length of {#limit}",
        "any.required": "Cofirm password is a required field",
        "any.only": "Confirm password does not match with the password",
      }),
    role: Joi.string().trim().valid("user", "admin").default("user").messages({
      "string.base": "Role should be a type of text",
      "any.only": "Role should be either user or admin",
    }),
  },
  "File Size Validation"
);

const userLoginValidation = Joi.object(
  {
    email: Joi.string().min(3).trim().max(40).required().email().messages({
      "string.base": "Email should be a type of text",
      "string.empty": "Email cannot be an empty field",
      "string.min": "Email should have a minimum length of {#limit}",
      "string.max": "Email should have a maximum length of {#limit}",
      "string.email": "Email must be a valid email",
      "any.required": "Email is a required field",
    }),
    password: Joi.string().trim().min(8).required().messages({
      "string.base": "Password should be a type of text",
      "string.empty": "Password cannot be an empty field",
      "string.min": "Password should have a minimum length of {#limit}",
      "any.required": "Password is a required field",
    }),
  },
  "File Size Validation"
);

export const validateSignup = (req, res, next) => {
  const object = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };
  const { error } = userSignupValidation.validate(object);
  if (error) {
    console.log(error);
    next(error.details[0]);
  } else {
    next();
  }
};

export const validateLogin = (req, res, next) => {
  const object = {
    email: req.body.email,
    password: req.body.password,
  };
  const { error } = userLoginValidation.validate(object);
  if (error) {
    console.log(error);
    next(error.details[0]);
  } else {
    next();
  }
};
