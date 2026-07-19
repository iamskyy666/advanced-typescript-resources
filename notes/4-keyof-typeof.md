# `keyof` vs `typeof` in TypeScript

`keyof` and `typeof` are two of the most commonly used TypeScript operators.

Although they often appear together, **they serve completely different purposes**.

* **`typeof`** extracts the **type of a value (variable, object, function, etc.)**.
* **`keyof`** extracts the **property names (keys) of a type**.

They are frequently combined to create powerful, reusable, and type-safe code.

---

# Understanding the Difference

Think of an object:

```ts
const person = {
  name: "John",
  age: 30,
  isAdmin: true,
};
```

There are two different questions we can ask:

### Question 1

> "What is the type of `person`?"

Answer:

```ts
{
  name: string;
  age: number;
  isAdmin: boolean;
}
```

This is what **`typeof`** gives us.

---

### Question 2

> "What are the property names of `person`?"

Answer:

```text
"name"
"age"
"isAdmin"
```

This is what **`keyof`** gives us.

---

# 1. `typeof`

In JavaScript, `typeof` is an operator that returns the runtime type.

```ts
console.log(typeof "Hello");
```

Output:

```text
string
```

```ts
console.log(typeof 10);
```

Output:

```text
number
```

---

## TypeScript's `typeof`

TypeScript uses `typeof` differently.

Instead of returning a string, it extracts the **type** of a variable.

Suppose we have:

```ts
const person = {
  name: "John",
  age: 30,
};
```

We can create a type from this object.

```ts
type Person = typeof person;
```

Now `Person` becomes:

```ts
type Person = {
  name: string;
  age: number;
};
```

Notice that we did **not** rewrite the type manually.

---

## Without `typeof`

```ts
const person = {
  name: "John",
  age: 30,
};

type Person = {
  name: string;
  age: number;
};
```

The type is duplicated.

If we later change the object:

```ts
const person = {
  name: "John",
  age: 30,
  city: "London",
};
```

We must also remember to update the type.

---

## With `typeof`

```ts
const person = {
  name: "John",
  age: 30,
  city: "London",
};

type Person = typeof person;
```

The type automatically stays in sync.

---

# Another Example

```ts
const settings = {
  darkMode: true,
  language: "English",
};
```

```ts
type Settings = typeof settings;
```

Equivalent to:

```ts
type Settings = {
  darkMode: boolean;
  language: string;
};
```

---

# Using `typeof` with Functions

Suppose we have:

```ts
function add(a: number, b: number) {
  return a + b;
}
```

We can extract the function type.

```ts
type AddFunction = typeof add;
```

Equivalent to:

```ts
type AddFunction = (a: number, b: number) => number;
```

Very useful when passing functions around.

---

# Using `typeof` with Arrays

```ts
const colors = ["red", "green", "blue"];
```

```ts
type Colors = typeof colors;
```

Result:

```ts
type Colors = string[];
```

---

# Why Do We Use `typeof`?

Because it follows the **Don't Repeat Yourself (DRY)** principle.

Instead of writing types twice, we extract them directly from existing values.

---

# 2. `keyof`

`keyof` works on **types**, not values.

It produces a union of all property names.

Suppose we have:

```ts
type Person = {
  name: string;
  age: number;
  city: string;
};
```

Now:

```ts
type Keys = keyof Person;
```

Result:

```ts
type Keys = "name" | "age" | "city";
```

Notice that the values are string literal types.

---

# Example

```ts
interface User {
  id: number;
  username: string;
  email: string;
}
```

```ts
type UserKeys = keyof User;
```

Result:

```ts
"id" | "username" | "email"
```

---

# Why is `keyof` Useful?

Suppose we write:

```ts
function getProperty(obj: any, key: string) {
  return obj[key];
}
```

We can accidentally write:

```ts
getProperty(user, "password");
```

Even if `"password"` doesn't exist.

---

Instead:

```ts
function getProperty<T>(obj: T, key: keyof T) {
  return obj[key];
}
```

Now:

```ts
const user = {
  name: "John",
  age: 30,
};
```

Valid:

```ts
getProperty(user, "name");
```

Valid:

```ts
getProperty(user, "age");
```

Invalid:

```ts
getProperty(user, "salary");
```

Error:

```text
Argument of type '"salary"' is not assignable...
```

This is one of the most common real-world uses of `keyof`.

---

# `keyof` with Interfaces

```ts
interface Product {
  id: number;
  price: number;
  name: string;
}
```

```ts
type ProductKeys = keyof Product;
```

Result:

```ts
"id" | "price" | "name"
```

---

# `keyof` with Classes

```ts
class Car {
  brand = "BMW";
  year = 2024;
}
```

```ts
type CarKeys = keyof Car;
```

Result:

```ts
"brand" | "year"
```

---

# `keyof` with Arrays

```ts
type ArrayKeys = keyof string[];
```

Result includes:

```text
number
"length"
"push"
"pop"
"map"
...
```

Arrays are objects, so `keyof` includes their properties and methods.

---

# Combining `typeof` and `keyof`

This is where TypeScript becomes extremely powerful.

Suppose we have:

```ts
const person = {
  name: "John",
  age: 30,
  city: "London",
};
```

We cannot write:

```ts
type Keys = keyof person;
```

This produces an error because `person` is a **value**, while `keyof` expects a **type**.

Instead:

```ts
type Keys = keyof typeof person;
```

Let's break it down.

---

## Step 1

```ts
typeof person
```

Produces:

```ts
{
  name: string;
  age: number;
  city: string;
}
```

---

## Step 2

```ts
keyof typeof person
```

Produces:

```ts
"name" | "age" | "city"
```

This pattern appears in almost every advanced TypeScript project.

---

# Real-World Example

Suppose we have configuration settings.

```ts
const config = {
  host: "localhost",
  port: 3000,
  secure: false,
};
```

We want a function that accepts only valid configuration keys.

```ts
type ConfigKey = keyof typeof config;
```

Result:

```ts
"host" | "port" | "secure"
```

Now:

```ts
function getConfig(key: ConfigKey) {
  return config[key];
}
```

Valid:

```ts
getConfig("host");
```

Valid:

```ts
getConfig("port");
```

Invalid:

```ts
getConfig("password");
```

TypeScript reports an error.

---

# Another Example

```ts
const COLORS = {
  RED: "#ff0000",
  GREEN: "#00ff00",
  BLUE: "#0000ff",
};
```

Extract the keys:

```ts
type ColorName = keyof typeof COLORS;
```

Result:

```ts
"RED" | "GREEN" | "BLUE"
```

Now we can safely write:

```ts
let color: ColorName;

color = "RED";

color = "GREEN";

color = "BLACK"; // Error
```

---

# Common Mistakes

## Mistake 1

```ts
const person = {
  name: "John",
};

type Keys = keyof person;
```

Error.

`person` is a value.

Correct:

```ts
type Keys = keyof typeof person;
```

---

## Mistake 2

Using `typeof` when `keyof` is needed.

```ts
type Keys = typeof person;
```

This produces:

```ts
{
  name: string;
}
```

Not:

```ts
"name"
```

`typeof` returns the entire type, not just the property names.

---

# Visual Representation

Suppose we have:

```ts
const user = {
  name: "John",
  age: 30,
};
```

### `typeof`

```text
Value
 │
 ▼
{
  name: "John",
  age: 30
}
 │
 ▼
typeof
 │
 ▼
{
  name: string
  age: number
}
```

---

### `keyof`

```text
Type
 │
 ▼
{
  name: string
  age: number
}
 │
 ▼
keyof
 │
 ▼
"name" | "age"
```

---

### `keyof typeof`

```text
Value
 │
 ▼
{
  name: "John",
  age: 30
}
 │
 ▼
typeof
 │
 ▼
{
  name: string
  age: number
}
 │
 ▼
keyof
 │
 ▼
"name" | "age"
```

---

# Comparison

| Feature                       | `typeof`                                                                                  | `keyof`                                         |
| ----------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Works on                      | Values                                                                                    | Types                                           |
| Returns                       | The type of a value                                                                       | A union of property names                       |
| Output                        | Object/function/array type                                                                | String (or number/symbol) literal union of keys |
| Runtime JavaScript equivalent | Yes (`typeof` operator exists in JS, though TypeScript's type query is compile-time only) | No (TypeScript-only)                            |
| Common use                    | Reusing the type of an existing value                                                     | Restricting keys and building generic utilities |

---

# Best Practices

* Use **`typeof`** when we want to derive a type from an existing value instead of duplicating type definitions.
* Use **`keyof`** when we need the set of valid property names of a type.
* Use **`keyof typeof`** when we want the keys of an existing object value. This is one of the most common TypeScript patterns.
* Combine `keyof` with generics (`<T>`) to build reusable, type-safe helper functions such as `getProperty`, `pick`, and `omit`.

> **Rule of Thumb:**
>
> * **`typeof` answers:** *"What is the type of this value?"*
> * **`keyof` answers:** *"What are the valid property names of this type?"*
> * **`keyof typeof` answers:** *"What are the valid property names of this object?"*
