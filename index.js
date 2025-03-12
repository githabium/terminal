const socket = new WebSocket("wss://your-server.com"); // Укажи свой сервер

socket.onopen = () => {
    console.log("Entered Hall);
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.type === "users") {
        document.getElementById("users-count").innerText = `${data.count} Magician${data.count > 1 ? "s" : ""} entered Hall`;
    }

    if (data.type === "message") {
        document.getElementById("messages").innerHTML += `<p>${data.text}</p>`;
    }
};

function sendMessage() {
    const message = document.getElementById("messageInput").value;
    socket.send(message);
    document.getElementById("messageInput").value = "";
}
