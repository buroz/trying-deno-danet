import { Module } from "danet/mod.ts";

import { TodoModule } from "./todo/mod.ts";

@Module({
  imports: [TodoModule],
})
export class AppModule {}
