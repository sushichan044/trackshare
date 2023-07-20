import type { AnyZodObject, z, ZodObject } from 'zod'

export type WithZodSchema<
  K extends string,
  O extends object,
  Schema extends AnyZodObject
> = {
  [key in K]: O
} & { schema: Schema }

export type MergedZodObjectInfer<
  T extends AnyZodObject,
  U extends AnyZodObject
> = z.infer<T & U>

export type AnyZodObjectOmitting<T extends AnyZodObject> = ZodObject<
  ZodObject<Omit<object, keyof T>>['shape']
>
