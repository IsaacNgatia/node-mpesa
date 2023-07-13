const axios = require("axios");

// send sms with mobitechtechnologies
const sendsms = async (req, res) => {
  // const { data needed to send tongether with sms } = req.body;

  const message = `custom message`;
  const { mobile } = req.body;

  let data = JSON.stringify({
    mobile: mobile,
    sender_name: "23107",
    service_id: 0,
    message: message,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.mobitechtechnologies.com/sms/sendsms",
    headers: {
      h_api_key:
        "6d7f23724b92fc1ab5ce718c1aa8f54f6ca87511bee5c7e401e60d9fd8d367d1",
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return res.status(200).json({
        messsage: "success",
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// send sms with advantasms

const sendsms2 = async (req, res) => {
  try {
    const { mobile } = req.body;

    const message = `custom message`;

    const response = axios.post(
      "https://quicksms.advantasms.com/api/services/sendsms/",
      {
        apikey: "5f1cd6755197a6f484dd1b4bfb0f2292",
        partnerID: "7975",
        message: message,
        shortcode: "AdvantaSMS",
        mobile: mobile,
      }
    );
    console.log(response, "success");

    res.status(200).json({ message: "Success" });
  } catch (e) {
    console.log(e.message);
  }
};

// send sms with textsms

const sendsms3 = async (req, res) => {
  try {
    const { mobile } = req.body;

    const message = `custom message`;

    axios.post("https://sms.textsms.co.ke/api/services/sendsms/", {
      apikey: "",
      partnerID: "",
      message: message,
      shortcode: "TextSMS",
      mobile: mobile,
    });

    res.status(200).json({ message: "Success" });
  } catch (e) {
    console.log(e.message);
  }
};
module.exports = { sendsms, sendsms2, sendsms3 };
