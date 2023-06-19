import { Inject } from "danet/mod.ts";

import { Todo } from "../models/mod.ts";

import {
  DATABASE,
  MongodbRepository,
  MongodbService,
} from "../../database/mod.ts";

export class TodoRepository extends MongodbRepository<Todo> {
  constructor(@Inject(DATABASE) protected dbService: MongodbService) {
    super(dbService, "todos");
  }
}
