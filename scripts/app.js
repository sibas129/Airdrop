async function sendTokens() {
    const recipient = document.getElementById("recipient").value;
    const amount = document.getElementById("amount").value;
    const response = await fetch("../contacts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            recipient: recipient,
            amount: amount
        })
    });
    const data = await response.json();
    const message = document.getElementById("message");
    if (data.success) {
        message.innerHTML = "Tokens sent successfully!";
    } else {
        message.innerHTML = "Error sending tokens: " + data.error;
    }
}