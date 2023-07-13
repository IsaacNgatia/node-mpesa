const Payment = require("../models/payment");
const axios = require("axios");

const api = axios.create({
  baseURL: "https://payment.intasend.com/api/v1/payment/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.ISSecretKey}`,
  },
});

const stkpush = async (req, res) => {
  const { amount, phone_number } = req.body;
  const endpoint = "mpesa-stk-push/";

  try {
    const response = await api.post(endpoint, {
      amount,
      phone_number,
    });

    const {
      id,
      invoice,
      customer,
      payment_link,
      customer_comment,
      refundable,
      created_at,
      updated_at,
    } = response.data;

    const paymentData = {
      id,
      invoice,
      customer,
      payment_link,
      customer_comment,
      refundable,
      created_at,
      updated_at,
    };

    const payment = await Payment.create(paymentData);
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

// i'll teach you this
const webhookTrigger = async (req, res) => {
  try {
    const { invoice_id, state, failed_reason, failed_code, account, value } =
      req.body;

    console.log(req.body);

    if (
      failed_reason === "Request cancelled by user" ||
      failed_reason ===
        "Failed to initiate transaction. Ensure your phone is on and sim card updated. Dial *234*1*6# from your Safaricom sim card to update it and try again."
    ) {
      return (
        (console.log("failed"),
        await axios.post("https://sms.textsms.co.ke/api/services/sendsms/", {
          apikey: "",
          partnerID: "7848",
          message: `Apologies for the inconvenience faced during your attempt to purchase the ClassicsNetPro package. Kindly contact us @ 0740315545 for immediate assistance.`,
          shortcode: "TextSMS",
          mobile: account,
        })),
        res.send("done")
      );
    }

    if (state === "COMPLETE") {
      //  do something
    }

    const filter = { "invoice.invoice_id": invoice_id };
    const update = {
      $set: {
        "invoice.state": state,
        "invoice.failed_reason": failed_reason,
        "invoice.failed_code": failed_code,
      },
    };

    const updatedPayment = await Payment.findOneAndUpdate(filter, update, {
      new: true,
    });

    console.log("code completed");

    res.status(200).json({
      message: "Payload received successfully",
      payload: req.body,
      updatedPayment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating payment" });
  }
};

// check payment status
const paymentStatus = async (req, res) => {
  const options = {
    method: "POST",
    url: "https://payment.intasend.com/api/v1/payment/status/",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "X-IntaSend-Public-API-Key": process.env.ISPubKey,
    },
    data: { invoice_id: req.body.invoice_id },
  };

  try {
    const response = await axios.request(options);
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ error: "An error occurred", error });
  }
};

module.exports = { webhookTrigger, stkpush, paymentStatus };
