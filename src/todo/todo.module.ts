import { Module, TokenInjector } from "danet/mod.ts";

import { TodoController } from "./controllers/mod.ts";
import { TodoService } from "./services/mod.ts";

import { DatabaseModule } from "../database/mod.ts";

import { USER_REPOSITORY } from "./todo.constants.ts";
import { TodoRepository } from "./repositories/mod.ts";

@Module({
  imports: [DatabaseModule],
  controllers: [TodoController],
  injectables: [
    new TokenInjector(TodoRepository, USER_REPOSITORY),
    TodoService,
  ],
})
export class TodoModule {}
