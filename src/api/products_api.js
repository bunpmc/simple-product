import { readFile, writeFile } from "fs";
import { createServer } from "http";

let product = [];

//Lay danh sach san pham
function getProduct() {
  return new Promise((resolve, reject) => {
    readFile("product.json", "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        product = JSON.parse(data);
        resolve(product);
      }
    });
  });
}

//Luu san pham vao file
function saveProduct() {
  return new Promise((resolve, reject) => {
    writeFile("product.json", JSON.stringify(product), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

//Xu ly request tu nguoi dung
createServer(async (req, res) => {
  if (req.url === "/products" && req.method === "GET") {
    try {
      products = await getProduct();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(products));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end("Failed tp read products");
    }
  } else if (req.url === "/products" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    try {
      await saveProduct();
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end("Product created successfully");
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end("Failed to save product");
    }
  } else if (req.url.startsWith === "/products/" && req.method === "DELETE") {
    const productId = req.url.split("/")[2];
    product = product.filter((product) => product.id !== productId); //=> Nếu product.id không bằng productId, sản phẩm này sẽ được giữ lại trong mảng mới.
    try {
      await saveProduct();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end("Product deleted successfully");
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end("Failed to delete product");
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end("Not Found");
  }
}).listen(3000, () => {
  console.log("Server running on port 3000");
});
