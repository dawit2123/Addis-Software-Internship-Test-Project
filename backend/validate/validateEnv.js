import Joi from "joi";
const validateEnv = (req, res, next) => {
  const environmnetalVaribleValidator = Joi.object({
    MONGO_URI: Joi.string().required().messages({
      "string.any": "Mongo URI must be string",
    }),
    NODE_ENV: Joi.string()
      .valid("development", "production", "test")
      .default("development")
      .messages({
        "any.only":
          "NODE_ENV must be one of 'development', 'production', 'test'",
      }),
    JWT_SECRET: Joi.string().min(32).required().messages({
      "string.min": "JWT secret must be at least 32 characters",
    }),
    JWT_COOKIE_EXPIRES_IN: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        "number.base": "JWT cookie expiration time must be a number",
        "number.integer": "JWT cookie expiration time must be an integer",
        "number.positive":
          "JWT cookie expiration time must be a positive number",
      }),
    JWT_EXPIRES_IN: Joi.string().required().messages({
      "string.base": "JWT expiration time must be a string",
    }),
    REDIS_URL: Joi.string().required().messages({
      "string.base": "JWT expiration time must be a string",
    }),
  }).unknown();
  const { error } = environmnetalVaribleValidator.validate(process.env);
  if (error) {
    next(new Error(`Config validation error: ${error.message}`));
  }
  next();
};
export default validateEnv;
