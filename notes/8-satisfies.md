# The `satisfies` Keyword in TypeScript

The `satisfies` keyword was introduced in **TypeScript 4.9**.

It allows us to verify that a value **matches a specific type** **without changing the inferred type of that value**.

This is the biggest difference between `satisfies` and a normal type annotation.

Think of it as:

> **"Check that this value satisfies the required type, but keep the original, more specific inferred type."**

---

# Why Was `satisfies` Introduced?

Before `satisfies`, we mainly had two options.

## Option 1: Type Annotation

```ts
type User = {
  name: string;
  age: number;
};

const user: User = {
  name: "John",
  age: 30,
};
```

This works.

However, TypeScript changes the variable's type to exactly `User`.

Sometimes we lose useful information that TypeScript originally inferred.

---

## Option 2: Type Assertion

```ts
const user = {
  name: "John",
  age: 30,
} as User;
```

This also works.

But this is dangerous because it tells TypeScript:

> "Trust us."

TypeScript performs fewer safety checks.

---

The `satisfies` keyword gives us the best of both worlds.

* Type safety
* Accurate inference

---

# Basic Syntax

```ts
const variable = value satisfies SomeType;
```

Example:

```ts
type User = {
  name: string;
  age: number;
};

const user = {
  name: "John",
  age: 30,
} satisfies User;
```

TypeScript verifies:

* Does this object satisfy `User`?

If yes:

* No error
* The original inferred type is preserved.

---

# Understanding What Happens

Suppose we write:

```ts
const user = {
  name: "John",
  age: 30,
};
```

TypeScript infers:

```ts
{
  name: string;
  age: number;
}
```

Now we add:

```ts
satisfies User
```

TypeScript performs one additional step.

```text
Object
   │
   ▼
Infer Type
   │
   ▼
Check against User
   │
   ▼
Keep Original Type
```

Notice:

It **checks** the type.

It does **not replace** the inferred type.

---

# Example 1

```ts
type User = {
  name: string;
  age: number;
};

const user = {
  name: "John",
  age: 30,
} satisfies User;
```

Everything is valid.

---

# Example 2

Missing property.

```ts
type User = {
  name: string;
  age: number;
};

const user = {
  name: "John",
} satisfies User;
```

Error:

```text
Property 'age' is missing.
```

TypeScript catches the mistake immediately.

---

# Example 3

Extra property.

```ts
type User = {
  name: string;
  age: number;
};

const user = {
  name: "John",
  age: 30,
  city: "London",
} satisfies User;
```

Error:

```text
Object literal may only specify known properties.
```

Again, TypeScript performs full checking.

---

# `satisfies` vs Type Annotation

Suppose we have:

```ts
type Role =
  | "ADMIN"
  | "USER";
```

---

## Using Type Annotation

```ts
const role: Role = "ADMIN";
```

Variable type:

```ts
Role
```

We lose the knowledge that this specific variable is `"ADMIN"`.

TypeScript only knows:

```text
"ADMIN" | "USER"
```

---

## Using `satisfies`

```ts
const role = "ADMIN" satisfies Role;
```

TypeScript checks:

```text
"ADMIN"

↓

Does it satisfy Role?

↓

Yes
```

Variable type remains:

```ts
"ADMIN"
```

This more specific type is often useful.

---

# Another Example

Suppose we have:

```ts
type Point = {
  x: number;
  y: number;
};
```

---

Annotation:

```ts
const point: Point = {
  x: 10,
  y: 20,
};
```

Type:

```ts
Point
```

---

Using `satisfies`

```ts
const point = {
  x: 10,
  y: 20,
} satisfies Point;
```

Type remains the inferred object type.

---

# Why Does This Matter?

Suppose we later use:

```ts
typeof point
```

With annotation:

```ts
Point
```

With `satisfies`:

```ts
{
  x: number;
  y: number;
}
```

We keep the precise inferred structure instead of replacing it with the declared type.

---

# `satisfies` with `Record`

One of the most common uses is with `Record`.

Suppose we define:

```ts
type Colors =
  | "red"
  | "green"
  | "blue";
```

Now:

```ts
const colors = {
  red: "#ff0000",
  green: "#00ff00",
  blue: "#0000ff",
} satisfies Record<Colors, string>;
```

TypeScript checks:

* Are all keys present?
* Are all values strings?

Everything is valid.

---

Missing key:

```ts
const colors = {
  red: "#ff0000",
  green: "#00ff00",
} satisfies Record<Colors, string>;
```

Error:

```text
Property 'blue' is missing.
```

---

Wrong key:

```ts
const colors = {
  red: "#ff0000",
  green: "#00ff00",
  yellow: "#ffff00",
} satisfies Record<Colors, string>;
```

Error:

```text
Property 'yellow' does not exist.
```

This makes `satisfies` excellent for configuration objects.

---

# Real-World Example: Configuration

```ts
type Config = {
  host: string;
  port: number;
  secure: boolean;
};
```

```ts
const config = {
  host: "localhost",
  port: 3000,
  secure: false,
} satisfies Config;
```

Now we know:

* Configuration is valid.
* Original inference is preserved.

---

# `satisfies` with Arrays

```ts
type Role =
  | "ADMIN"
  | "USER";
```

```ts
const roles = [
  "ADMIN",
  "USER",
] satisfies Role[];
```

Every element is checked.

Invalid:

```ts
const roles = [
  "ADMIN",
  "MANAGER",
] satisfies Role[];
```

Compiler error.

---

# `satisfies` with `as const`

This is one of the most powerful combinations.

Suppose:

```ts
const routes = {
  home: "/",
  login: "/login",
  profile: "/profile",
} as const satisfies Record<
  string,
  string
>;
```

`as const`

↓

Makes everything readonly and preserves literal values.

```ts
{
  readonly home: "/";
  readonly login: "/login";
  readonly profile: "/profile";
}
```

`satisfies`

↓

Verifies that every value is a string.

This gives us:

* Immutable object
* Literal inference
* Type checking

All together.

---

# `satisfies` vs `as`

Suppose we write:

```ts
const user = {
  name: "John",
} as User;
```

TypeScript largely trusts us.

Even if:

```ts
type User = {
  name: string;
  age: number;
};
```

we can force the assertion in ways that bypass proper checking.

---

Using:

```ts
satisfies User
```

TypeScript refuses invalid objects.

It checks everything before allowing the assignment.

---

# `satisfies` vs `as const`

These serve different purposes.

## `as const`

Makes values:

* readonly
* literal types

Example:

```ts
const role = "ADMIN" as const;
```

Type:

```ts
"ADMIN"
```

---

## `satisfies`

Checks compatibility with another type.

Example:

```ts
const role =
  "ADMIN"
  satisfies Role;
```

Checks:

```text
Is "ADMIN" allowed?
```

---

Often we combine both.

```ts
const config = {
  theme: "dark",
} as const satisfies Config;
```

---

# Visual Representation

Without `satisfies`

```text
Object

↓

Inference

↓

Done
```

---

With `satisfies`

```text
Object

↓

Inference

↓

Check Against Type

↓

Keep Original Type
```

---

# Common Mistakes

## Mistake 1

Thinking `satisfies` changes the type.

It doesn't.

It only verifies compatibility.

---

## Mistake 2

Thinking it is the same as `as`.

It isn't.

`as`

↓

Assertion

```text
"Trust us."
```

`satisfies`

↓

Validation

```text
"Prove it."
```

---

## Mistake 3

Using `satisfies` when we actually want to change the type.

Example:

```ts
const value = "ADMIN" satisfies Role;
```

Variable type remains:

```ts
"ADMIN"
```

Not:

```ts
Role
```

This is intentional.

---

# Comparison

| Feature                     | Type Annotation (`:`)       | Type Assertion (`as`)                         | `satisfies`                                |
| --------------------------- | --------------------------- | --------------------------------------------- | ------------------------------------------ |
| Checks compatibility        | ✅                           | ⚠️ Limited / Can be bypassed                  | ✅                                          |
| Changes inferred type       | ✅ Yes                       | ✅ Yes                                         | ❌ No                                       |
| Preserves literal inference | ❌ Usually not               | ⚠️ Not necessarily                            | ✅ Yes                                      |
| Safe                        | ✅                           | ❌ Can hide mistakes                           | ✅                                          |
| Best use                    | Declaring a variable's type | Overriding the compiler (only when necessary) | Validating while keeping precise inference |

---

# When Should We Use `satisfies`?

Use `satisfies` when we want to:

* Validate configuration objects.
* Validate `Record` objects.
* Validate constant lookup tables.
* Preserve literal types.
* Keep TypeScript's powerful inference.
* Avoid unsafe type assertions.

---

# Real-World Use Cases

* Configuration objects
* Route definitions
* Translation dictionaries (i18n)
* Theme objects
* Feature flags
* Permission maps
* API endpoint definitions
* Lookup tables
* Constant mappings

---

# Best Practices

* Prefer **`satisfies`** over `as` whenever we want validation instead of simply overriding the compiler.
* Combine **`satisfies`** with **`as const`** for immutable configuration objects and lookup tables.
* Use `satisfies` with `Record` to ensure all required keys are present and no unexpected keys are added.
* Remember that `satisfies` **checks** compatibility but **does not change** the inferred type.

> **Rule of Thumb:**
>
> * Use `:` when we want to **declare** a variable's type.
> * Use `as` when we need to **assert** a type (only when we genuinely know more than the compiler).
> * Use **`satisfies`** when we want to **verify** that a value matches a type while preserving TypeScript's most precise inferred type.
