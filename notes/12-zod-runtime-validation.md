# Working with Zod Runtime Validation and TypeScript 💤

One of the biggest misconceptions about TypeScript is:

> **"TypeScript validates data."**

It doesn't.

TypeScript only checks **our code during compilation**.

Once our application is running, **all type information is erased**.

This is where **Zod** comes in.

Zod provides **runtime validation**, while TypeScript provides **compile-time type checking**.

Together they provide both **developer safety** and **runtime safety**.

---

# The Problem TypeScript Cannot Solve

Suppose we have

```ts
type User = {
    id: number
    name: string
}
```

Now imagine data comes from an API.

```ts
const response = await fetch("/users/1")

const user: User = await response.json()
```

Looks safe.

It isn't.

What if the API returns

```json
{
    "id": "abc",
    "name": 123
}
```

TypeScript happily compiles because it trusts us.

At runtime

```ts
user.id.toFixed()
```

Boom.

```
TypeError
```

because

```
id

↓

string

not

number
```

---

# Why?

Because TypeScript disappears after compilation.

```text
TypeScript Source

↓

Type Checking

↓

JavaScript Output

↓

Run
```

Notice

```
Types

↓

Removed
```

This process is called **type erasure**.

---

# Runtime Validation

Instead of trusting incoming data, we verify it.

```text
Incoming JSON

↓

Validate

↓

Valid?

↓

YES → Use

NO → Throw Error
```

---

# What is Zod?

Zod is a **TypeScript-first runtime validation library**.

It allows us to

* Validate data
* Parse data
* Infer TypeScript types
* Transform data
* Create reusable schemas

One schema gives us both

* Runtime validation
* Compile-time types

---

# Installation

```bash
npm install zod
```

---

# First Schema

```ts
import { z } from "zod"

const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
})
```

Notice

This is **not** a TypeScript type.

It is an object describing validation rules.

---

# Parsing Data

```ts
const result = UserSchema.parse({
    id: 1,
    name: "John",
})
```

Result

```ts
{
    id: 1,
    name: "John"
}
```

---

# Invalid Data

```ts
UserSchema.parse({
    id: "1",
    name: 123
})
```

Throws

```
ZodError
```

---

# Visual

```text
Unknown Data

↓

UserSchema.parse()

↓

Valid?

↓

YES

↓

Typed User

OR

↓

Throw Error
```

---

# parse()

`parse()` either

Returns valid data

or

Throws an error.

```ts
const user = UserSchema.parse(data)
```

---

# safeParse()

Sometimes throwing isn't desirable.

```ts
const result =
    UserSchema.safeParse(data)
```

Result

```ts
{
    success: true,
    data: ...
}
```

or

```ts
{
    success: false,
    error: ...
}
```

---

# Example

```ts
const result =
    UserSchema.safeParse(input)

if (result.success) {
    console.log(result.data)
} else {
    console.log(result.error)
}
```

This avoids using `try/catch`.

---

# Type Inference

The biggest feature.

Instead of writing

```ts
type User = {
    id: number
    name: string
}
```

and

```ts
const UserSchema =
```

separately,

we write only

```ts
const UserSchema =
    z.object({
        id: z.number(),
        name: z.string(),
    })
```

Then

```ts
type User =
    z.infer<typeof UserSchema>
```

Result

```ts
type User = {
    id: number
    name: string
}
```

One source of truth.

---

# Why This Matters

Without inference

```text
Type

↓

Schema

↓

Update Both
```

Eventually

```
Mismatch
```

With inference

```text
Schema

↓

Type Automatically Generated
```

---

# Primitive Validators

## String

```ts
z.string()
```

---

## Number

```ts
z.number()
```

---

## Boolean

```ts
z.boolean()
```

---

## Date

```ts
z.date()
```

---

## BigInt

```ts
z.bigint()
```

---

## Literal

```ts
z.literal("admin")
```

Only accepts

```
admin
```

---

# String Validation

```ts
z.string().min(3)
```

```ts
z.string().max(20)
```

```ts
z.string().length(5)
```

```ts
z.string().email()
```

```ts
z.string().url()
```

```ts
z.string().uuid()
```

```ts
z.string().regex(...)
```

---

Example

```ts
const EmailSchema =
    z.string().email()
```

---

# Number Validation

```ts
z.number().min(0)
```

```ts
z.number().max(100)
```

```ts
z.number().int()
```

```ts
z.number().positive()
```

```ts
z.number().negative()
```

```ts
z.number().finite()
```

---

# Optional Values

```ts
z.string().optional()
```

Equivalent Type

```ts
string | undefined
```

---

# Nullable

```ts
z.string().nullable()
```

Type

```ts
string | null
```

---

# Nullish

```ts
z.string().nullish()
```

Type

```ts
string | null | undefined
```

---

# Arrays

```ts
const Tags =
    z.array(z.string())
```

Type

```ts
string[]
```

---

# Objects

```ts
const User =
    z.object({
        id: z.number(),
        name: z.string(),
    })
```

---

# Nested Objects

```ts
const User =
    z.object({
        id: z.number(),

        address:
            z.object({
                city: z.string(),
                zip: z.string(),
            }),
    })
```

---

# Enums

```ts
const Role =
    z.enum([
        "admin",
        "user"
    ])
```

Type

```ts
"admin" | "user"
```

---

# Unions

```ts
const Value =
    z.union([
        z.string(),
        z.number()
    ])
```

---

# Discriminated Union

```ts
const Shape =
    z.discriminatedUnion("type", [

        z.object({
            type: z.literal("circle"),
            radius: z.number()
        }),

        z.object({
            type: z.literal("square"),
            side: z.number()
        })
    ])
```

---

# Records

```ts
z.record(
    z.string(),
    z.number()
)
```

Result

```ts
Record<string, number>
```

---

# Tuples

```ts
z.tuple([
    z.string(),
    z.number()
])
```

---

# Defaults

```ts
const User =
    z.object({
        active:
            z.boolean()
                .default(true)
    })
```

Input

```ts
{}
```

Output

```ts
{
    active: true
}
```

---

# Transform

Transform changes validated values.

```ts
const Name =
    z.string()
        .transform(
            s => s.toUpperCase()
        )
```

Input

```
john
```

Output

```
JOHN
```

Validation occurs before the transform.

---

# Preprocess

Sometimes incoming data has the wrong type.

Example

```ts
{
    age: "42"
}
```

We want

```
42
```

```ts
const Age =
    z.preprocess(
        value => Number(value),
        z.number()
    )
```

Input

```
"42"
```

Output

```
42
```

---

# refine()

Custom validation.

```ts
const Password =
    z.string().refine(
        value => value.length >= 8,
        {
            message:
                "Password too short"
        }
    )
```

---

# superRefine()

Useful when validation depends on multiple fields.

```ts
const Register =
    z.object({
        password: z.string(),
        confirm: z.string(),
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.confirm) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["confirm"],
                message: "Passwords do not match",
            })
        }
    })
```

---

# strict()

By default, unknown object keys are stripped.

Example

```ts
const UserSchema = z.object({
    name: z.string(),
})

UserSchema.parse({
    name: "John",
    age: 25,
})
```

Result

```ts
{
    name: "John"
}
```

The `age` property is removed.

If we want unknown keys to cause an error:

```ts
const StrictUser =
    z.object({
        name: z.string(),
    }).strict()
```

Now

```ts
{
    name: "John",
    age: 25
}
```

throws a validation error.

---

# Partial

```ts
const User =
    z.object({
        name: z.string(),
        age: z.number(),
    })

const Update =
    User.partial()
```

Every field becomes optional.

---

# Pick

```ts
const Public =
    User.pick({
        name: true
    })
```

---

# Omit

```ts
const Public =
    User.omit({
        password: true
    })
```

---

# Extend

```ts
const Admin =
    User.extend({
        role: z.literal("admin")
    })
```

---

# Merge

```ts
const A =
    z.object({
        name: z.string()
    })

const B =
    z.object({
        age: z.number()
    })

const Combined =
    A.merge(B)
```

---

# Recursive Schemas

For recursive data (such as nested comments or folders), Zod supports recursive schemas using lazy evaluation.

```ts
const Category = z.lazy(() =>
    z.object({
        name: z.string(),
        children: z.array(Category),
    })
)
```

---

# Async Validation

Some validation requires asynchronous work (for example, checking whether an email already exists in a database).

```ts
const EmailSchema = z.string().refine(
    async (email) => {
        return !(await emailExists(email))
    },
    {
        message: "Email already exists",
    }
)
```

Because the refinement is asynchronous, we must use:

```ts
await EmailSchema.parseAsync(email)
```

or

```ts
await EmailSchema.safeParseAsync(email)
```

Using `parse()` with async refinements will not work correctly.

---

# Express Example

```ts
const CreateUserSchema =
    z.object({
        name: z.string(),
        email: z.string().email(),
        age: z.number().min(18),
    })

app.post("/users", (req, res) => {
    const result =
        CreateUserSchema.safeParse(req.body)

    if (!result.success) {
        return res.status(400).json({
            errors:
                result.error.issues
        })
    }

    // Fully validated and strongly typed
    const user = result.data

    res.json(user)
})
```

Notice

After

```ts
result.success
```

TypeScript knows

```ts
result.data
```

matches the inferred type from the schema.

---

# Zod + TypeScript Workflow

```text
Incoming JSON
        │
        ▼
      unknown
        │
        ▼
Zod Schema Validation
        │
        ├──────── Invalid
        │           │
        │           ▼
        │      Return Errors
        │
        ▼
 Valid Data
        │
        ▼
z.infer Produces Type
        │
        ▼
TypeScript Provides Autocomplete
and Static Type Checking
```

---

# Best Practices

* Treat all external input (`req.body`, `req.query`, API responses, environment variables, files) as `unknown` until validated.
* Define the Zod schema first, then derive the TypeScript type with `z.infer<typeof Schema>`. Avoid maintaining separate interfaces unless there's a compelling reason.
* Prefer `safeParse()` (or `safeParseAsync()`) in request handlers to avoid relying on exceptions for normal validation failures.
* Use `parse()` (or `parseAsync()`) when invalid data is truly exceptional and should throw.
* Validate data at application boundaries (HTTP requests, message queues, external APIs, configuration), not deep inside business logic.
* Use `strict()` when unknown object properties should be rejected rather than silently ignored.
* Keep transformations (`transform()`) and validations (`refine()`) focused and predictable. Complex business rules are often better handled after validation.

---

# Interview Tips

* **TypeScript checks code at compile time. Zod validates data at runtime.** They solve different problems and complement each other.
* `z.infer<typeof Schema>` creates TypeScript types directly from schemas, eliminating duplicate definitions.
* Know the difference between `parse()` (throws) and `safeParse()` (returns a success/error result).
* Be comfortable with `refine()`, `superRefine()`, `transform()`, and `preprocess()`, as these are common in production code.
* Understand that Zod does not replace TypeScript, and TypeScript does not replace Zod. In production applications, they are typically used together to achieve both runtime safety and compile-time type safety.
