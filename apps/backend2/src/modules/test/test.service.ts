import { Injectable } from "@nestjs/common";
import { AppConfig } from "../config/models/app.config";

@Injectable()
export class TestService {
  constructor(private readonly configService: AppConfig) {}

  get() {
    const test = this.configService.port;

    return { test };
  }
}
