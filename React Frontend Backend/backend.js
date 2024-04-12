require('dotenv').config();
const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");

const app = express();

// Directly specify the API key
const OPEN_AI_API_KEY = "your secret key";

const client = new OpenAI({
  apiKey: OPEN_AI_API_KEY,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS middleware
app.use(cors());

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const imagesResponse = await client.images.generate({
      model: "dall-e-2",
      prompt: prompt,
      n: 3,
      size: "1024x1024",
    });

    imagesResponse.data.forEach((image, index) => {
        console.log(`URL ${index + 1}: ${image.url}`);
      });
    console.log(imagesResponse)
    // console.log(imagesResponse.data[0].url)
    res.json(imagesResponse);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error during image creation: " + e.message);
  }
});

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
module.exports = server;

