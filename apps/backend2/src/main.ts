import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { RedocModule } from "@nicholas.braun/nestjs-redoc";
import { AppModule } from "./modules/app/app.module";
import { AppConfig } from "./modules/config/models/app.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const { port } = app.get(AppConfig);

  const SwaggerConfig = new DocumentBuilder()
    .setTitle("MyStorage API")
    .setDescription("The MyStorage API documentation.")
    .build();

  const SwaggerDocument = SwaggerModule.createDocument(app, SwaggerConfig);

  await RedocModule.setup("/docs", app, SwaggerDocument, {});
  await app.listen(port);

  console.log(`🚀 MyStorage started! Application port is ${port}.`);
}

bootstrap();
