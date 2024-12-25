document.getElementById("emailForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Ngăn chặn hành vi gửi form mặc định

  const to = document.getElementById("to").value;
  const subject = document.getElementById("subject").value;
  const text = document.getElementById("text").value;

  const responseElement = document.getElementById("response");
  responseElement.textContent = "Sending email...";
  responseElement.className = "";

  try {
    const response = await fetch("http://localhost:3001/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "no-cors",
      body: JSON.stringify({ to, subject, text }),
    });

    // Log the raw response to debug the issue
    const textResponse = await response.text();
    console.log("Raw Response:", textResponse); // Log the response

    // Check if response is empty or invalid JSON
    if (!textResponse) {
      throw new Error("Empty response from server");
    }

    // Try parsing the response
    let responseData = {};
    try {
      responseData = JSON.parse(textResponse);
    } catch (error) {
      throw new Error("Failed to parse JSON response");
    }

    if (!response.ok) {
      responseElement.textContent = `Error: ${
        responseData.error || "Unknown error"
      }`;
      responseElement.className = "error";
    } else {
      responseElement.textContent = responseData.message || "Success";
      responseElement.className = "success";
    }
  } catch (error) {
    responseElement.textContent = `Request failed: ${error.message}`;
    responseElement.className = "error";
  }
});
