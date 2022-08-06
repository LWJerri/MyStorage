import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { resolve } from "path";
import { MainConfigModule } from "../config/config.module";
import { TestModule } from "../test/test.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: resolve(__dirname, "..", "..", "..", "..", "frontend", "dist") }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: resolve(process.cwd(), "..", "..", ".env") }),
    MainConfigModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
