const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENVIRONMENT: Joi.string()
      .valid("production", "development", "test")
      .required(),
    BACKEND_PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENVIRONMENT,
  port: envVars.BACKEND_PORT,
  // Set mongoose configuration
  mongoose: {
    url:
      envVars.MONGODB_URL +
      (envVars.NODE_ENVIRONMENT === "test" ? "-test" : ""),
    options: {
      // useCreateIndex: true,
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    },
  },
  jwt_secret_token: envVars.JWT_SECRET_KEY,
};
