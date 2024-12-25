import { createServer } from "http";

createServer((req, res) => {
  if (req.url === "/submit" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const formData = JSON.parse(body);
      const name = formData.name;
      const email = formData.email;

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`Form submitted successfully. Name: ${name}, Email: ${email}`);
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("Page not found");
  }
}).listen(3001, () => {
  console.log("Server running on port 3001");
});
