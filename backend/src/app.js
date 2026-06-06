const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/auth.routes");
const listingRoutes = require("./routes/listing.routes");
const inquiryRoutes = require("./routes/inquiry.routes");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/inquiries", inquiryRoutes);

app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is running"
    });
});

module.exports = app;