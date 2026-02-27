import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.post("/send-ticket", async (req, res) => {
  const {
    phone,
    fromStation,
    toStation,
    trainName,
    trainNumber,
    classType,
    ticketType
  } = req.body;

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: {
          body:
`🎫 NEW TICKET ASSIGNED

From: ${fromStation}
To: ${toStation}
Train: ${trainName} (${trainNumber})
Class: ${classType}
Type: ${ticketType}`
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ success: true, response: response.data });

  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ error: "Message failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
