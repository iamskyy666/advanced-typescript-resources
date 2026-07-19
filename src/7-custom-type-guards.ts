type User = {
  id: number;
  name: string;
};

// common use-cases - JSON, req body, local storage or api-responses
const inputData: unknown = {
  id: 1,
  name: "skyy",
};

function isUser(val: unknown) {
  // once the check will pass
  if (typeof val !== "object" || val === null) {
    return false;
  }

  // assertion
  const possibleUser = val as Record<string, unknown>;

  return typeof possibleUser.id === "number" && typeof possibleUser.name;
}

// if(isUser(inputData)){
//     console.log(inputData.id, inputData.name)
// }