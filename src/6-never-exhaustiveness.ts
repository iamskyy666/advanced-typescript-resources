// checks every case

type PaymentStatus = "pending" | "paid" | "failed";

function getPaymentMessage(status: PaymentStatus) {
  switch (status) {
    case "pending":
      return "pending";
    case "paid":
      return "paid";
    case "failed":
      return "failed";
    // case "refunded":
    //     return "refund"  
    default:
      {
        const unreachableStatus: never = status;
        return unreachableStatus;
      }
      break;
  }
}
