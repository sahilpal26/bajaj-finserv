const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(cors()); // Handle cross-origin requests
app.use(bodyParser.json({ limit: "10mb" })); // Handle JSON input up to 10MB

// Utility function to process input data
const separateData = (data) => {
  let numbers = [],
    alphabets = [],
    highestLowercase = null;

  data.forEach((item) => {
    if (!isNaN(item)) numbers.push(item);
    else if (/^[a-zA-Z]$/.test(item)) {
      alphabets.push(item);
      if (
        item === item.toLowerCase() &&
        (!highestLowercase || item > highestLowercase)
      ) {
        highestLowercase = item;
      }
    }
  });

  return { numbers, alphabets, highestLowercase };
};

// POST /bfhl - Handle incoming data and file
app.post("/bfhl", (req, res) => {
  const { data, file_b64 } = req.body;
  if (!data || !Array.isArray(data))
    return res
      .status(400)
      .json({ is_success: false, message: "Invalid input" });

  const { numbers, alphabets, highestLowercase } = separateData(data);

  let fileDetails = {
    file_valid: false,
    file_mime_type: null,
    file_size_kb: null,
  };
  if (file_b64) {
    try {
      const buffer = Buffer.from(file_b64, "base64");
      fileDetails = {
        file_valid: true,
        file_mime_type:
          buffer[0] === 0x89 && buffer[1] === 0x50
            ? "image/png"
            : "application/octet-stream",
        file_size_kb: (buffer.length / 1024).toFixed(2),
      };
    } catch (error) {
      fileDetails.file_valid = false;
    }
  }

  res.json({
    is_success: true,
    user_id: "SUHAS_SRINIVAS_LINGAM",
    email: "sl7215@srmist.edu.in",
    roll_number: "RA2111003020111",
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
    ...fileDetails,
  });
});

// GET /bfhl - Return static operation code
app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
