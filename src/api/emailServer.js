import nodemailer from "nodemailer";
import { createServer } from "http";
import dotenv from "dotenv";

dotenv.config();

//Để file .env ở ngoài root folder thì nên chạy trên bash ngoài root
// để truy cập vào file env

createServer((req, res) => {
  if (req.url === "/email" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const { to, subject, text } = JSON.parse(body);

        if (!to || !subject || !text) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Missing required fields" }));
          return;
        }

        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com", // Uncomment this line to use Gmail's SMTP server
          port: 587, // Uncomment this line to set the correct SMTP port
          secure: false, // Set to false for TLS
          auth: {
            user: process.env.EMAIL, // Gmail
            pass: process.env.PASSWORD, // App Password từ Gmail
          },
        });

        console.log(process.env.EMAIL, process.env.PASSWORD);

        const mailOptions = {
          from: process.env.EMAIL,
          to,
          subject,
          text,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                error: "Failed to send email",
                details: error.message,
              })
            );
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Email sent successfully",
                response: info.response,
              })
            );
          }
        });
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON format" }));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Endpoint not found" }));
  }
}).listen(3001, () => {
  console.log("Server running on port 3001");
});
