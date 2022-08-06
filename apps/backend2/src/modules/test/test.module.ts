import { Module } from "@nestjs/common";
import { TestService } from "./test.service";
import { TestController } from "./test.controller";
import { MainConfigService } from "../config/config.service";
import { AppConfig } from "../config/models/app.config";

@Module({
  controllers: [TestController],
  providers: [TestService, MainConfigService, AppConfig],
})
export class TestModule {}
