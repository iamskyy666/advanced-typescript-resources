type ProductStatus = "available" | "outOfStock";

type StatusInfo = {
  label: string;
  canBuy: boolean;
};

const productStatusInfo = {
  available: {
    label: "label1",
    canBuy: true,
  },
  outOfStock: {
    label: "label2",
    canBuy: false,
  },
} satisfies Record<ProductStatus, StatusInfo>;
