# Enums and `const enum` in TypeScript 🔵

An **enum** (short for **enumeration**) is a special TypeScript feature that allows us to define a collection of related constants under a single name.

Instead of remembering magic numbers or strings throughout our application, we give them meaningful names.

For example, instead of writing:

```ts
let status = 0;
```

we can write:

```ts
enum Status {
  Pending,
  Processing,
  Completed,
}

let status = Status.Pending;
```

This makes the code much easier to read and maintain.

---

# Why Do We Need Enums?

Suppose we are building an E-Commerce application.

Without enums:

```ts
const orderStatus = 1;
```

What does `1` mean?

* Pending?
* Shipped?
* Delivered?
* Cancelled?

Someone reading the code has no idea.

---

We could use strings:

```ts
const orderStatus = "pending";
```

This is better, but we can accidentally make spelling mistakes.

```ts
const orderStatus = "pendng";
```

No compiler error.

---

Enums solve this problem.

```ts
enum OrderStatus {
  Pending,
  Processing,
  Shipped,
  Delivered,
  Cancelled,
}

const status = OrderStatus.Pending;
```

Now the code is self-explanatory.

---

# Creating an Enum

Basic syntax:

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
```

---

# What Values Are Assigned?

By default, TypeScript assigns numeric values starting from **0**.

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
```

Equivalent to:

```ts
enum Direction {
  Up = 0,
  Down = 1,
  Left = 2,
  Right = 3,
}
```

---

We can verify this.

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

console.log(Direction.Up);
console.log(Direction.Down);
console.log(Direction.Left);
console.log(Direction.Right);
```

Output:

```text
0
1
2
3
```

---

# Custom Numeric Values

We can assign values manually.

```ts
enum Status {
  Pending = 1,
  Processing = 2,
  Completed = 3,
}
```

Output:

```ts
console.log(Status.Pending);
```

```
1
```

---

We can also skip values.

```ts
enum Status {
  Pending = 100,
  Processing = 200,
  Completed = 500,
}
```

Output:

```text
100
200
500
```

---

# Auto Increment

If we assign one value, the remaining members continue incrementing automatically.

```ts
enum Status {
  Pending = 10,
  Processing,
  Completed,
  Cancelled,
}
```

Equivalent to:

```ts
enum Status {
  Pending = 10,
  Processing = 11,
  Completed = 12,
  Cancelled = 13,
}
```

---

# String Enums

Enums can also store strings.

```ts
enum Role {
  Admin = "ADMIN",
  User = "USER",
  Guest = "GUEST",
}
```

Usage:

```ts
const role = Role.Admin;

console.log(role);
```

Output:

```text
ADMIN
```

---

Unlike numeric enums, every member must have an explicit value.

Incorrect:

```ts
enum Role {
  Admin = "ADMIN",
  User,
}
```

Error:

```text
Enum member must have initializer.
```

---

Correct:

```ts
enum Role {
  Admin = "ADMIN",
  User = "USER",
}
```

---

# Why Are String Enums Popular?

Suppose we send data to an API.

Instead of:

```json
{
  "role": 1
}
```

we send:

```json
{
  "role": "ADMIN"
}
```

Strings are:

* Easier to debug
* Easier to read
* Better for logging
* Better for APIs

---

# Accessing Enum Members

```ts
enum Color {
  Red,
  Green,
  Blue,
}

console.log(Color.Red);
```

Output:

```text
0
```

---

# Reverse Mapping (Numeric Enums Only)

One interesting feature of numeric enums is reverse mapping.

```ts
enum Color {
  Red,
  Green,
  Blue,
}

console.log(Color[0]);
```

Output:

```text
Red
```

Both mappings exist.

```text
Red → 0

0 → Red
```

Internally, TypeScript creates something similar to:

```ts
{
  0: "Red",
  1: "Green",
  2: "Blue",

  Red: 0,
  Green: 1,
  Blue: 2
}
```

---

String enums do **not** support reverse mapping.

```ts
enum Role {
  Admin = "ADMIN",
}

console.log(Role["ADMIN"]);
```

Output:

```text
undefined
```

---

# Computed Members

Enum values can be computed.

```ts
enum Size {
  Small = 2,
  Medium = Small * 2,
  Large = Medium * 2,
}
```

Output:

```text
Small = 2
Medium = 4
Large = 8
```

---

# Heterogeneous Enums

TypeScript allows mixing numbers and strings.

```ts
enum Example {
  Yes = 1,
  No = "NO",
}
```

Although valid, this is **not recommended** because it makes the enum inconsistent and harder to reason about.

---

# Compiled JavaScript

Suppose we write:

```ts
enum Direction {
  Up,
  Down,
}
```

TypeScript compiles it into something similar to:

```js
var Direction;

(function (Direction) {
  Direction[(Direction["Up"] = 0)] = "Up";
  Direction[(Direction["Down"] = 1)] = "Down";
})(Direction || (Direction = {}));
```

This creates an object at runtime.

---

# What is `const enum`?

A **`const enum`** is a compile-time-only enum.

Instead of generating an object in JavaScript, TypeScript **replaces every enum member with its actual value** during compilation.

Syntax:

```ts
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}
```

---

Usage:

```ts
const move = Direction.Left;
```

During compilation, TypeScript changes it to:

```js
const move = 2;
```

No enum object is created.

---

# Normal Enum vs `const enum`

### Normal enum

TypeScript:

```ts
enum Direction {
  Up,
  Down,
}

const move = Direction.Down;
```

JavaScript:

```js
var Direction;

(function (Direction) {
  Direction[(Direction["Up"] = 0)] = "Up";
  Direction[(Direction["Down"] = 1)] = "Down";
})(Direction || (Direction = {}));

const move = Direction.Down;
```

Runtime object exists.

---

### `const enum`

TypeScript:

```ts
const enum Direction {
  Up,
  Down,
}

const move = Direction.Down;
```

JavaScript:

```js
const move = 1;
```

No runtime object.

---

# Benefits of `const enum`

## 1. Better Performance

No object lookup.

Instead of:

```ts
Direction.Up
```

JavaScript becomes:

```js
0
```

This is slightly faster because there is no object access.

---

## 2. Smaller Bundle Size

Normal enums generate extra JavaScript.

`const enum` generates nothing except the actual values.

Large applications with many enums can save bundle size by using `const enum`.

---

## 3. Zero Runtime Cost

No object exists in memory.

Everything is replaced during compilation.

---

# Limitations of `const enum`

Since no object exists:

```ts
const enum Color {
  Red,
  Green,
}
```

We cannot do:

```ts
console.log(Color);
```

There is no object at runtime.

---

Reverse mapping is also impossible.

```ts
Color[0];
```

Not allowed.

---

# When Should We Use Normal Enums?

Use normal enums when we need:

* Reverse mapping
* Runtime iteration
* Reflection
* Passing the enum object around
* Debugging with enum names

Example:

```ts
enum Status {
  Pending,
  Completed,
}

console.log(Status);
```

Output:

```text
{
  0: "Pending",
  1: "Completed",

  Pending: 0,
  Completed: 1
}
```

---

# When Should We Use `const enum`?

Use `const enum` when:

* We only need compile-time constants.
* We don't need runtime access.
* Performance matters.
* Bundle size matters.

Examples:

* HTTP status codes
* Directions
* Game controls
* Permission flags
* Configuration constants

---

# Real-World Examples

## Example 1: User Roles

```ts
enum Role {
  Admin = "ADMIN",
  User = "USER",
  Guest = "GUEST",
}

function login(role: Role) {
  console.log(role);
}

login(Role.Admin);
```

---

## Example 2: Traffic Lights

```ts
enum TrafficLight {
  Red,
  Yellow,
  Green,
}

let current = TrafficLight.Red;
```

---

## Example 3: HTTP Status Codes

```ts
const enum HttpStatus {
  OK = 200,
  Created = 201,
  NotFound = 404,
  InternalServerError = 500,
}

const status = HttpStatus.OK;
```

Compiled JavaScript:

```js
const status = 200;
```

---

# Enums vs Union Types

Many modern TypeScript codebases prefer **string literal union types** over enums because they produce no runtime JavaScript and integrate naturally with the type system.

Example:

```ts
type Role = "ADMIN" | "USER" | "GUEST";

let role: Role = "ADMIN";
```

Advantages:

* No generated JavaScript
* Excellent type inference
* Works seamlessly with object literals and APIs
* Often simpler for frontend applications

Enums still remain useful when we want a named set of related constants, especially numeric constants or when working with existing codebases.

---

# Summary

| Feature                     | `enum`                          | `const enum`                                |
| --------------------------- | ------------------------------- | ------------------------------------------- |
| Generates JavaScript object | ✅ Yes                           | ❌ No                                        |
| Exists at runtime           | ✅ Yes                           | ❌ No                                        |
| Reverse mapping             | ✅ Numeric enums only            | ❌ No                                        |
| Runtime iteration           | ✅ Yes                           | ❌ No                                        |
| Bundle size                 | Larger                          | Smaller                                     |
| Performance                 | Slightly slower (object lookup) | Slightly faster (value inlined)             |
| Memory usage                | Higher                          | Lower                                       |
| Best use case               | When runtime access is needed   | When only compile-time constants are needed |

---

# Best Practices

* Prefer **string enums** over numeric enums when representing values exchanged with APIs or displayed in logs.
* Avoid **heterogeneous enums** (mixing strings and numbers).
* Use **`const enum`** only when we are certain runtime access is never needed and our build tooling supports it.
* For many modern TypeScript applications, consider **string literal union types** (`type Status = "pending" | "completed"`) as an alternative to enums, especially for frontend code and API models.
* Choose the construct that best fits the use case rather than using enums everywhere.
