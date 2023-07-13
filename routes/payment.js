const router = require("express").Router();
const {
  webhookTrigger,
  stkpush,
  paymentStatus,
} = require("../controller/payment");

router.post("/", stkpush);
router.post("/transaction-complete", webhookTrigger);
router.post("/status", paymentStatus);

module.exports = router;
