import { Collection, InsertDocument, ObjectId } from "mongo/mod.ts";

import { MongodbService } from "./mongodb.service.ts";

export interface Repository<T extends unknown> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | undefined>;
  create(
    dto: unknown
    // deno-lint-ignore no-explicit-any
  ): Promise<ObjectId | Required<InsertDocument<any>>["_id"]>;
  updateOne(
    id: string,
    dto: T
  ): Promise<{
    upsertedId: ObjectId | undefined;
    upsertedCount: number;
    matchedCount: number;
    modifiedCount: number;
  }>;
  deleteOne(id: string): Promise<number>;
  deleteAll(): Promise<number>;
}

export abstract class MongodbRepository<T> implements Repository<T> {
  constructor(
    protected readonly dbService: MongodbService,
    protected readonly collectionName: string
  ) {}

  async getAll(): Promise<T[]> {
    return this.dbService
      .getCollection<T>(this.collectionName)
      .find({})
      .toArray();
  }

  async getById(id: string) {
    return this.dbService.getCollection<T>(this.collectionName).findOne({
      _id: new ObjectId(id),
    });
  }

  async create(dto: Omit<T, "_id">) {
    const insertedId = await this.dbService
      .getCollection<T>(this.collectionName)
      .insertOne(dto);

    return {
      _id: insertedId,
      ...dto,
    };
  }

  async updateOne(dtoId: string, dto: T) {
    const objectId = new ObjectId(dtoId);

    const updated = await this.dbService
      .getCollection<T>(this.collectionName)
      .updateOne(
        { _id: objectId },
        // deno-lint-ignore ban-ts-comment
        // @ts-ignore
        { $set: { ...dto } }
      );

    return updated;
  }

  async deleteOne(dtoId: string) {
    return this.dbService.getCollection<T>(this.collectionName).deleteOne({
      _id: new ObjectId(dtoId),
    });
  }

  async deleteAll() {
    return this.dbService.getCollection<T>(this.collectionName).deleteMany({});
  }
}
