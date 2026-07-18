
# 1. `strict` - The Master Switch

`strict` is the **master switch** that enables a collection of strict type-checking options.

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

Instead of enabling many options one by one, we can simply enable `strict`.

When `strict: true`, TypeScript automatically enables options like:

* `noImplicitAny`
* `strictNullChecks`
* `strictFunctionTypes`
* `strictPropertyInitialization`
* `strictBindCallApply`
* `noImplicitThis`
* `alwaysStrict`
* and several other strict checks.

Think of it as:

```text
strict = Turn on all major type safety checks
```

---

### Example

Without strict mode:

```ts
let age;

age = 25;
age = "twenty five";
age = true;
```

No errors occur because `age` is inferred as `any`.

With strict mode enabled, TypeScript encourages us to provide proper types and reports many unsafe situations during development.

---

### Another Example

```ts
function add(a, b) {
  return a + b;
}
```

Without strict mode:

No errors.

With strict mode:

```
Parameter 'a' implicitly has an 'any' type.
Parameter 'b' implicitly has an 'any' type.
```

---

### Why do we use it?

Imagine a project with:

* 50 files
* 100 functions
* 15 developers

Without strict mode, someone might accidentally write:

```ts
user.age = "Thirty";
```

The project still compiles, and the bug appears only at runtime.

With strict mode enabled, TypeScript catches these mistakes while we are writing the code.

---

# 2. `noImplicitAny`

This option prevents TypeScript from silently assigning the `any` type.

---

## First, understand `any`

`any` means:

> "TypeScript, don't perform type checking for this value."

Example:

```ts
let value: any;

value = 10;
value = "Hello";
value = false;
value = [];
value = {};
```

Everything is allowed because we lose type safety.

---

## Without `noImplicitAny`

```ts
function greet(name) {
  return "Hello " + name;
}
```

TypeScript silently assumes:

```ts
function greet(name: any)
```

No errors are reported.

We can now write:

```ts
greet(10);
greet(true);
greet([]);
greet({});
```

Everything compiles, even though the function was probably intended to accept only strings.

---

## With `noImplicitAny`

TypeScript reports:

```
Parameter 'name' implicitly has an 'any' type.
```

We must explicitly specify the type:

```ts
function greet(name: string) {
  return "Hello " + name;
}
```

Now:

```ts
greet("John"); // ✅

greet(10); // ❌ Error
```

---

### Another Example

Without `noImplicitAny`:

```ts
let data;

data = 10;
data = "hello";
data = true;
```

No errors occur.

With explicit typing:

```ts
let data: number;

data = 10;

data = "hello"; // ❌ Error
```

---

### Why is implicit `any` dangerous?

Suppose we write:

```ts
function calculate(price, tax) {
  return price * tax;
}
```

Later, someone calls:

```ts
calculate("100", []);
```

The code compiles, but the behavior may be unexpected.

With proper typing:

```ts
function calculate(price: number, tax: number) {
  return price * tax;
}
```

Now TypeScript immediately reports invalid arguments.

---

# 3. `strictNullChecks`

This option treats `null` and `undefined` as separate types that must be handled explicitly.

Without this option, TypeScript assumes that `null` and `undefined` can be assigned almost anywhere.

---

## Without `strictNullChecks`

```ts
let name: string = null;
```

No error.

Similarly:

```ts
let age: number = undefined;
```

No error.

This is dangerous because the application may crash later.

For example:

```ts
console.log(name.toUpperCase());
```

Runtime error:

```
Cannot read property 'toUpperCase' of null
```

---

## With `strictNullChecks`

Now:

```ts
let name: string = null;
```

TypeScript reports:

```
Type 'null' is not assignable to type 'string'.
```

Similarly:

```ts
let age: number = undefined;
```

TypeScript reports an error.

---

## Allowing `null` explicitly

If a variable is allowed to be `null`, we must specify it using a union type:

```ts
let username: string | null = null;
```

Now both assignments are valid:

```ts
username = "Alice";
username = null;
```

---

## Example

```ts
let username: string | null = null;

console.log(username.toUpperCase());
```

TypeScript reports an error because `username` might be `null`.

We must first check:

```ts
if (username !== null) {
  console.log(username.toUpperCase());
}
```

Now the code is safe.

---

## Another Example

Suppose an API returns:

```ts
{
  name: "John"
}
```

or

```ts
{
  name: null
}
```

We define:

```ts
interface User {
  name: string | null;
}
```

Now:

```ts
const user: User = getUser();

console.log(user.name.toUpperCase());
```

TypeScript reports an error because `name` might be `null`.

We should write:

```ts
if (user.name) {
  console.log(user.name.toUpperCase());
}
```

---

## Optional Properties

```ts
interface User {
  name?: string;
}
```

This is equivalent to:

```ts
name: string | undefined
```

Therefore:

```ts
const user: User = {};

console.log(user.name.toUpperCase());
```

TypeScript reports an error because `name` may be `undefined`.

We can safely access it using:

```ts
if (user.name) {
  console.log(user.name.toUpperCase());
}
```

or

```ts
console.log(user.name?.toUpperCase());
```

---

# How These Three Options Work Together

Consider this function:

```ts
function printName(name) {
  console.log(name.toUpperCase());
}
```

With:

```json
{
  "strict": true
}
```

TypeScript reports two issues:

1. `name` implicitly has the `any` type (`noImplicitAny`).
2. If `name` could be `null` or `undefined`, calling `toUpperCase()` without checking is unsafe (`strictNullChecks`).

A safe implementation is:

```ts
function printName(name: string | null) {
  if (name !== null) {
    console.log(name.toUpperCase());
  }
}
```

---

# Summary

| Option                 | Purpose                                                                          | Prevents                                                                           |
| ---------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **`strict`**           | Enables all major strict type-checking rules.                                    | A wide range of type-related bugs.                                                 |
| **`noImplicitAny`**    | Requires us to explicitly specify types instead of silently using `any`.         | Loss of type safety caused by implicit `any`.                                      |
| **`strictNullChecks`** | Treats `null` and `undefined` as separate types that must be handled explicitly. | Runtime errors caused by accessing properties or methods on `null` or `undefined`. |

> **Recommended Practice:** For almost all modern TypeScript projects, we should keep `"strict": true`. If we need to relax a specific rule while migrating a legacy project, it is better to disable only that individual option instead of turning off `strict` entirely.
