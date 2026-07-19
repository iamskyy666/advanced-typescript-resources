// enum -> create a real js object{} at runtime
// const enum -> does not create any runtime obj{}

enum UploadStatus {
  draft = "draft",
  processing = "processing",
  final = "final",
}

function printUploadStatus(status: UploadStatus): void {
  console.log(status);
}

printUploadStatus(UploadStatus.draft);

// printUploadStatus("random-str") // ❌

console.log(UploadStatus);

// const enum
// it is removed from the final js output

// For example..
const enum HttpStatusCode {
  OK = 200,
  FAILED = 400,
  NOT_FOUND = 404,
}

function sendResp(statusCode: HttpStatusCode, message: string) {
  console.log(statusCode, message);
}

sendResp(HttpStatusCode.OK, "success");
// console.log(HttpStatusCode); // ❌
