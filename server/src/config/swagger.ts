import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "path";
import YAML from "yamljs";

export async function setupSwagger(app: Express) {
  const main = YAML.load(path.join(__dirname, "../docs/main.yaml"));
  const auth = YAML.load(path.join(__dirname, "../docs/auth.yaml"));
  const user = YAML.load(path.join(__dirname, "../docs/user.yaml"));
  const product = YAML.load(path.join(__dirname, "../docs/product.yaml"));

  const finalSpec = {
    ...main,
    paths: {
      ...main.paths,
      ...auth.paths,
      ...user.paths,
      ...product.paths
    },
    components: {
      ...main.components,
      schemas: {
        ...main.components?.schemas,
        ...auth.components?.schemas,
        ...user.components?.schemas,
        ...product.components?.schemas
      }
    }
  };

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(finalSpec));
}
