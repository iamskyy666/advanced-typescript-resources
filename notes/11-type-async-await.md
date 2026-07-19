# Working with Async/Await in TypeScript 🛜

Async/await in TypeScript is built on top of JavaScript's `Promise` API. TypeScript **does not change how async/await works at runtime**—it adds **static type checking** so we know what asynchronous functions return and what values `await` resolves to.

---

# What is an Asynchronous Function?

An asynchronous function is a function that **doesn't complete immediately**.

Examples:

* Fetching data from an API
* Reading a file
* Querying a database
* Waiting for a timer
* Calling another microservice

Instead of returning the final value immediately, it returns a **Promise**.

```
Request
   │
   ▼
Function Starts
   │
   ▼
Returns Promise Immediately
   │
   ▼
Work Happens
   │
   ▼
Promise Resolves
```

---

# What is a Promise?

A Promise represents a value that will be available later.

Imagine ordering food.

```
Order Pizza
      │
      ▼
Receive Token (Promise)
      │
      ▼
Wait
      │
      ▼
Pizza Arrives
```

The token is the Promise.

The pizza is the resolved value.

---

# Promise States

A Promise has three states.

```
Pending
    │
    ├────────► Fulfilled
    │
    └────────► Rejected
```

Example

```ts
const promise = fetch("/users")
```

Initially

```
Pending
```

Eventually

```
Fulfilled
```

or

```
Rejected
```

---

# Creating a Promise

```ts
const promise = new Promise<string>((resolve, reject) => {
    resolve("Hello")
})
```

Notice

```ts
Promise<string>
```

means

```
This Promise resolves to a string.
```

---

# Promise<number>

```ts
const promise = new Promise<number>((resolve) => {
    resolve(100)
})
```

Resolved value

```
100
```

Type

```
number
```

---

# Promise<User>

```ts
type User = {
    id: number
    name: string
}

const promise = new Promise<User>((resolve) => {
    resolve({
        id: 1,
        name: "John"
    })
})
```

---

# Promise<void>

Sometimes nothing is returned.

```ts
function delay(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}
```

---

# Async Functions

An async function automatically returns a Promise.

```ts
async function hello() {
    return "Hello"
}
```

Many beginners think

```
returns string
```

Wrong.

It returns

```ts
Promise<string>
```

Equivalent to

```ts
function hello(): Promise<string> {
    return Promise.resolve("Hello")
}
```

---

# Why?

Every async function is wrapped inside a Promise.

```
return 5

↓

Promise.resolve(5)
```

---

# Example

```ts
async function getAge() {
    return 25
}
```

Actual return type

```ts
Promise<number>
```

---

# Explicit Return Types

Recommended

```ts
async function getName(): Promise<string> {
    return "Alice"
}
```

---

# Returning Objects

```ts
type User = {
    id: number
    name: string
}

async function getUser(): Promise<User> {
    return {
        id: 1,
        name: "Bob"
    }
}
```

---

# Await

`await` pauses execution until the Promise resolves.

```ts
const user = await getUser()
```

Instead of

```
Promise<User>
```

we now get

```
User
```

Visual

```
Promise<User>

↓

await

↓

User
```

---

# Without await

```ts
const user = getUser()
```

Type

```ts
Promise<User>
```

---

# With await

```ts
const user = await getUser()
```

Type

```ts
User
```

---

# Example

```ts
async function getNumber() {
    return 10
}

async function main() {
    const num = await getNumber()

    console.log(num)
}
```

Type of

```
num
```

is

```
number
```

---

# Awaiting Normal Values

You can even write

```ts
const value = await 10
```

It becomes

```
10
```

because JavaScript wraps it.

Equivalent

```ts
await Promise.resolve(10)
```

---

# Error Handling

Use

```ts
try
catch
```

Example

```ts
async function main() {
    try {
        const user = await getUser()
    } catch (err) {
        console.log(err)
    }
}
```

---

# Typing catch

Since modern TypeScript (with `useUnknownInCatchVariables` enabled, which is included under `strict`), the catch variable is `unknown`.

```ts
catch (err) {
    // err is unknown
}
```

Correct

```ts
catch (err) {
    if (err instanceof Error) {
        console.log(err.message)
    }
}
```

Avoid

```ts
catch (err: any) {
}
```

---

# Throwing Errors

```ts
async function login() {
    throw new Error("Invalid credentials")
}
```

Return type

```
Promise<never>
```

Practically

```
Promise<never>
```

because the function never successfully resolves.

---

# Promise Rejection

```ts
async function getUser() {
    throw new Error("User not found")
}
```

Equivalent

```ts
return Promise.reject(
    new Error("User not found")
)
```

---

# Async Arrow Functions

```ts
const fetchUser = async (): Promise<User> => {
    return {
        id: 1,
        name: "Tom"
    }
}
```

---

# Async Methods

```ts
class UserService {

    async getUser(): Promise<User> {
        return {
            id: 1,
            name: "John"
        }
    }
}
```

---

# Promise.all()

Runs everything in parallel.

Without Promise.all

```
Task A

↓

Task B

↓

Task C
```

Total

```
A+B+C
```

---

With Promise.all

```
A

B

C

↓

Wait Together
```

Time

```
Longest Task
```

Example

```ts
const users = fetchUsers()
const posts = fetchPosts()
const comments = fetchComments()

const [
    u,
    p,
    c
] = await Promise.all([
    users,
    posts,
    comments
])
```

Type inference

```
User[]

Post[]

Comment[]
```

---

# Promise.all() Failure

If one Promise rejects

```
Promise.all

↓

Rejects Entire Operation
```

---

# Promise.allSettled()

Waits for everything.

Even if some fail.

```ts
const results =
    await Promise.allSettled([
        fetchUsers(),
        fetchPosts()
    ])
```

Each result

```
fulfilled

or

rejected
```

---

# Promise.race()

Returns whichever finishes first.

```
Fast Promise

↓

Returned
```

---

# Promise.any()

Returns the first fulfilled Promise.

Ignores rejected ones.

---

# Await in Loops

Bad

```ts
for (const id of ids) {
    await fetchUser(id)
}
```

Runs sequentially.

```
1

↓

2

↓

3
```

---

Better

```ts
await Promise.all(
    ids.map(fetchUser)
)
```

Runs in parallel.

---

# Generic Async Functions

```ts
async function identity<T>(
    value: T
): Promise<T> {
    return value
}
```

Usage

```ts
const num = await identity(10)
```

Type

```
number
```

---

# Fetch Example

```ts
type User = {
    id: number
    name: string
}

async function fetchUser(
    id: number
): Promise<User> {

    const response =
        await fetch(`/users/${id}`)

    const user: User =
        await response.json()

    return user
}
```

---

# Safer Fetch

Avoid

```ts
const data =
    await response.json()
```

because it is often typed as `any` (or `unknown` depending on the environment and typings).

Better

```ts
const data = await response.json() as User
```

Or even better, validate the response at runtime with a schema validation library (such as Zod) before treating it as a `User`. TypeScript checks types only at compile time—it cannot verify that an API actually returned the expected shape.

---

# Async Interface

```ts
interface UserService {

    getUser(
        id: number
    ): Promise<User>

    saveUser(
        user: User
    ): Promise<void>
}
```

---

# Async Type Alias

```ts
type Loader =
    () => Promise<User[]>
```

---

# Awaited<T>

Built-in utility.

```ts
type Result =
    Awaited<Promise<string>>
```

Result

```
string
```

Nested Promise

```ts
type Result =
    Awaited<
        Promise<
            Promise<number>
        >
    >
```

Result

```
number
```

---

# Common Mistakes

## 1. Forgetting await

Wrong

```ts
const user = getUser()

console.log(user.name)
```

Error

```
Property 'name'
does not exist
on Promise<User>
```

Correct

```ts
const user =
    await getUser()
```

---

## 2. Returning Wrong Type

Wrong

```ts
async function getAge(): Promise<number> {
    return "25"
}
```

TypeScript catches it immediately.

---

## 3. Mixing then() and await

Avoid

```ts
const user =
    await getUser()
        .then(...)
```

Prefer one style.

```ts
const user =
    await getUser()
```

---

## 4. Sequential Awaits That Could Be Parallel

Less efficient

```ts
const users = await fetchUsers()
const posts = await fetchPosts()
```

If the operations are independent, use

```ts
const [users, posts] = await Promise.all([
    fetchUsers(),
    fetchPosts()
])
```

---

## 5. Ignoring Errors

Avoid

```ts
const user = await getUser()
```

when the Promise may reject and no caller handles it. Catch the error where it makes sense, or let it propagate intentionally to a higher-level error handler.

---

# Async/Await in Node.js

A typical Express controller:

```ts
import { Request, Response } from "express";

export async function getUser(
    req: Request,
    res: Response
): Promise<void> {
    const user = await userService.findById(
        req.params.id
    );

    res.json(user);
}
```

If `findById()` throws, the Promise returned by the controller is rejected. In Express 5, rejected async handlers are automatically forwarded to the error-handling middleware. In Express 4, this required either wrapping the handler or using a package such as `express-async-errors`.

---

# Async Flow

```
Call Function
      │
      ▼
Returns Promise
      │
      ▼
await
      │
      ▼
Pause Current Function
      │
      ▼
Promise Resolves
      │
      ▼
Continue Execution
```

---

# Best Practices

* Always annotate the return type of exported async functions (`Promise<T>` or `Promise<void>`).
* Use `await` only when the resolved value is needed immediately.
* Run independent asynchronous tasks in parallel with `Promise.all()`.
* Use `Promise.allSettled()` when partial failures are acceptable.
* Treat caught errors as `unknown` and narrow them before use.
* Validate external data (API responses, files, databases) at runtime instead of relying only on type assertions.
* Avoid mixing `.then()` chains and `async`/`await` within the same code path unless there is a specific reason.

---

# Interview Tips

* Every `async` function **always** returns a `Promise`, even when it appears to return a plain value.
* `await` unwraps the resolved value of a `Promise` but does **not** block the entire JavaScript runtime—it only pauses the current async function while other work can continue on the event loop.
* Know when to use `Promise.all()`, `Promise.allSettled()`, `Promise.race()`, and `Promise.any()`.
* Be comfortable typing async functions with `Promise<T>`, generic async functions (`Promise<T>`), and the `Awaited<T>` utility type.
* Understand that TypeScript provides compile-time type safety for async code, but it cannot guarantee that data received from external sources matches the expected types without runtime validation.
