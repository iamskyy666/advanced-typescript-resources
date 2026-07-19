# Function Overloads in TypeScript

Function overloads allow us to define **multiple valid ways** to call the **same function**.

Although we write **only one implementation**, TypeScript lets us define multiple **function signatures** for different parameter types and return types.

Think of function overloads as:

> **One function, multiple "contracts" for callers.**

---

# Why Do We Need Function Overloads?

Suppose we want a function that behaves differently depending on the input.

Example:

* Pass a `string` → return a `string`
* Pass a `number` → return a `number`

Without overloads:

```ts
function double(value: string | number) {
  if (typeof value === "string") {
    return value + value;
  }

  return value * 2;
}
```

This works.

However, what type does TypeScript infer?

```ts
const result = double("Hello");
```

Type:

```ts
string | number
```

Even though we passed a string!

TypeScript cannot know which return type corresponds to which input type.

---

# The Problem

```ts
const message = double("Hello");
```

Type:

```ts
string | number
```

But we know:

```text
Input → string

Output → string
```

TypeScript loses this relationship.

---

# Function Overloads Solve This

Instead, we define multiple signatures.

```ts
function double(value: string): string;

function double(value: number): number;

function double(value: string | number) {
  if (typeof value === "string") {
    return value + value;
  }

  return value * 2;
}
```

Now:

```ts
const a = double("Hello");
```

Type:

```ts
string
```

---

```ts
const b = double(10);
```

Type:

```ts
number
```

TypeScript now understands the relationship between the input and output.

---

# Function Overload Syntax

Every overloaded function has **three parts**.

---

## 1. Overload Signature

```ts
function double(value: string): string;
```

No body.

Just describes one valid way to call the function.

---

Another overload:

```ts
function double(value: number): number;
```

Again, no body.

---

## 2. Implementation Signature

Finally:

```ts
function double(value: string | number) {
    ...
}
```

This contains the actual implementation.

There is only **one implementation**.

---

Visual representation:

```text
Caller

↓

Overload Signatures

↓

Implementation

↓

Result
```

---

# How TypeScript Resolves Overloads

Suppose we write:

```ts
double("Hello");
```

TypeScript checks the overloads **from top to bottom**.

```text
double(value: string): string

↓

Matches?

↓

Yes

↓

Use this signature
```

It never reaches the second overload.

---

Suppose:

```ts
double(100);
```

Check first overload:

```text
string?

↓

No
```

Second overload:

```text
number?

↓

Yes
```

Done.

---

# Complete Example

```ts
function format(value: number): string;

function format(value: Date): string;

function format(value: number | Date) {
  if (value instanceof Date) {
    return value.toDateString();
  }

  return `$${value.toFixed(2)}`;
}
```

Usage:

```ts
format(100);
```

Returns:

```ts
string
```

---

```ts
format(new Date());
```

Returns:

```ts
string
```

---

# Why Does the Implementation Use a Union?

Notice:

```ts
function format(value: number | Date)
```

Why not:

```ts
function format(value: number)
```

Because the implementation must be able to handle **every overload**.

The implementation signature is usually broader.

---

Visual representation

```text
Overload 1

number

↓

Implementation

number | Date

↑

Overload 2

Date
```

The implementation must accept everything that any overload accepts.

---

# Another Example

Suppose:

```ts
function greet(name: string): string;

function greet(names: string[]): string[];
```

Implementation:

```ts
function greet(name: string | string[]) {
  if (Array.isArray(name)) {
    return name.map(n => `Hello ${n}`);
  }

  return `Hello ${name}`;
}
```

Usage:

```ts
const one = greet("John");
```

Type:

```ts
string
```

---

```ts
const many = greet([
  "John",
  "Jane",
]);
```

Type:

```ts
string[]
```

---

# Without Overloads

Without overloads:

```ts
function greet(name: string | string[]) {
    ...
}
```

Return type becomes:

```ts
string | string[]
```

Even though each input has a predictable output.

---

# Function Overloads vs Union Parameters

Many beginners ask:

> "Why not just use union types?"

Sometimes unions are enough.

Example:

```ts
function print(value: string | number) {
  console.log(value);
}
```

The return type is always:

```ts
void
```

No overload needed.

---

Suppose instead:

```ts
function parse(value: string | number) {
  if (typeof value === "string") {
    return value.length;
  }

  return value.toString();
}
```

Return type:

```ts
string | number
```

But we know:

```text
string input

↓

number output
```

and

```text
number input

↓

string output
```

This relationship is lost.

Overloads preserve it.

---

# Real-World Example

Suppose we have:

```ts
search(id: number)
```

Returns:

```ts
User
```

---

Another call:

```ts
search(email: string)
```

Returns:

```ts
User
```

Implementation:

```ts
function search(id: number): User;

function search(email: string): User;

function search(value: number | string) {
    ...
}
```

The caller gets proper autocomplete.

---

# Overloads with Different Return Types

Suppose:

```ts
function parse(value: string): number;

function parse(value: number): string;
```

Implementation:

```ts
function parse(value: string | number) {
  if (typeof value === "string") {
    return Number(value);
  }

  return value.toString();
}
```

Usage:

```ts
const a = parse("42");
```

Type:

```ts
number
```

---

```ts
const b = parse(42);
```

Type:

```ts
string
```

Very powerful.

---

# Overloads with Multiple Parameters

```ts
function createUser(name: string): User;

function createUser(
  name: string,
  age: number
): User;
```

Implementation:

```ts
function createUser(
  name: string,
  age?: number
) {
  return {
    name,
    age: age ?? 18,
  };
}
```

Valid:

```ts
createUser("John");
```

---

```ts
createUser("John", 25);
```

---

Invalid:

```ts
createUser();
```

---

# Generic Overloads

Overloads can also use generics.

Example:

```ts
function first<T>(items: T[]): T;

function first<T>(
  items: Set<T>
): T;
```

Implementation:

```ts
function first<T>(
  items: T[] | Set<T>
) {
  if (Array.isArray(items)) {
    return items[0];
  }

  return [...items][0];
}
```

---

# Overloads vs Generics

Sometimes overloads are unnecessary.

Suppose:

```ts
function identity<T>(value: T): T {
  return value;
}
```

This works for everything.

No overloads needed.

Bad:

```ts
function identity(value: string): string;

function identity(value: number): number;

function identity(value: boolean): boolean;
```

This quickly becomes repetitive.

Generics are a better choice.

---

# How TypeScript Chooses an Overload

Suppose:

```ts
function fn(value: string): string;

function fn(value: number): number;

function fn(value: any) {
    return value;
}
```

Calling:

```ts
fn(100);
```

TypeScript checks:

```text
Overload 1

string?

↓

No

↓

Overload 2

number?

↓

Yes

↓

Done
```

The implementation signature is **not** considered during overload resolution.

Only the overload signatures are used by callers.

---

# Common Mistakes

## Mistake 1

Providing multiple implementations.

Incorrect:

```ts
function test(a: string) {}

function test(a: number) {}
```

Only one implementation is allowed.

---

## Mistake 2

Implementation Too Narrow

Incorrect:

```ts
function fn(a: string): string;

function fn(a: number): number;

function fn(a: string) {
    ...
}
```

The implementation cannot handle numbers.

Correct:

```ts
function fn(
  a: string | number
) {
    ...
}
```

---

## Mistake 3

Expecting the Implementation Signature to Be Callable

```ts
function fn(a: string): void;

function fn(a: number): void;

function fn(a: string | number) {}
```

Calling:

```ts
fn(true);
```

Error.

Even though the implementation accepts a union, callers only see the overload signatures.

---

# Function Overloads vs Union Types

| Feature                             | Union Parameters                  | Function Overloads                 |
| ----------------------------------- | --------------------------------- | ---------------------------------- |
| Multiple parameter types            | ✅                                 | ✅                                  |
| Different return types              | ❌ Poor inference                  | ✅ Excellent inference              |
| Preserves input-output relationship | ❌                                 | ✅                                  |
| Simpler syntax                      | ✅                                 | ❌                                  |
| Best for                            | Same behavior regardless of input | Different behavior or return types |

---

# When Should We Use Function Overloads?

Use overloads when:

* Different parameter types produce different return types.
* The relationship between inputs and outputs matters.
* We want better IntelliSense and autocomplete.
* We are designing reusable APIs or libraries.

Avoid overloads when:

* The implementation is identical for all types.
* A generic function can express the relationship more simply.
* A union type is sufficient because the return type does not vary.

---

# Best Practices

* Write the **most specific overloads first**, followed by more general ones if needed.
* Keep exactly **one implementation** that can handle every overload.
* Use runtime checks (`typeof`, `instanceof`, `Array.isArray`, custom type guards, etc.) inside the implementation to distinguish between cases.
* Prefer **generics** over overloads when the input and output types are the same shape (for example, `identity<T>(value: T): T`).
* Use **union types** instead of overloads when only the parameter type changes and the return type remains the same.

> **Rule of Thumb:**
>
> * Use **union types** when different inputs are handled the same way and produce the same kind of output.
> * Use **generics** when the output type should match the input type.
> * Use **function overloads** when different inputs require different function signatures or produce different return types while sharing a single implementation.
