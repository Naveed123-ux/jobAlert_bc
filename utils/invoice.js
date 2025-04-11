import BillingHistory from "../models/billing.model.js";

export async function generateInvoiceNumber() {
  const date = new Date();
  const year = date.getFullYear();

  // Find the last invoice for this year
  const lastInvoice = await BillingHistory.findOne({
    invoiceNumber: { $regex: `^INV-${year}-` },
  })
    .sort({ invoiceNumber: -1 })
    .exec();

  let sequence = 1;
  if (lastInvoice) {
    const lastSequence = parseInt(lastInvoice.invoiceNumber.split("-")[2]);
    sequence = lastSequence + 1;
  }

  return `INV-${year}-${String(sequence).padStart(3, "0")}`;
}
