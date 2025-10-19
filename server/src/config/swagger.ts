import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "path";
import merge from "swagger-merge";
import YAML from "yamljs";

// This will merge all yaml files in to 1 file using for api docs
export async function setupSwagger(app: Express) {
  const main = YAML.load(path.join(__dirname, "../docs/main.yaml"));

  // App routes (inject to this when make new route)
  const auth = YAML.load(path.join(__dirname, "../docs/auth.yaml"));
  const user = YAML.load(path.join(__dirname, "../docs/user.yaml"));
  const product = YAML.load(path.join(__dirname, "../docs/product.yaml"));

  const finalSpec = merge.mergeSpecs([
    main, 
    auth, 
    user, 
    product
]);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(finalSpec));
}
