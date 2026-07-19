// mapped type - create a new type by looping over the keys of another type

import { boolean, email } from "zod";

type User = {
  id: number;
  name: string;
  email: string;
};

type UserPermissions = {
  [key in keyof User]: boolean;
};

// UserPermissions
// {
//   id: boolean;
//   name: boolean;
//   email: boolean;
// }

const editFeature: UserPermissions = {
  id: false,
  name: true,
  email: true,
};
// conditional type - create type based on a certain condition
type ValueCategory<T> = T extends string ? "text" : "other";

type NameCategory = ValueCategory<string>;
type AgeCategory = ValueCategory<number>;

const nameCategory: NameCategory = "text"
const ageCategory: AgeCategory = "other"