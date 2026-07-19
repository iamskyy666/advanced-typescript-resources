// runtime validation

import { z } from "zod";

const rawUserInput: unknown = {
  name: "skyy",
  age: 69,
};

// zod schema makes sure what our runtime data actually looks like

const UserSchema = z.object({
  name: z.string(),
  age: z.number().min(18),
});

type User = z.infer<typeof UserSchema>;

const result = UserSchema.safeParse(rawUserInput);

if (!result.success) {
  console.log("====================================");
  console.log(result.error.issues);
  console.log("====================================");
} else {
  const user: User = result.data;
  console.log("====================================");
  console.log(user.age, user.name);
  console.log("====================================");
}
