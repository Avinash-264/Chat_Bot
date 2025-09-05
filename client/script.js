  const chatWindow = document.getElementById("chat-window");
  const messageInput = document.getElementById("message-input");
  const sendBtn = document.getElementById("send-btn");

function appendMessage(role, text, isMarkdown = false) {
  const div = document.createElement("div");
  div.className = `message ${role}`;
  if (isMarkdown) { 
    div.innerHTML = text
  } else {
    div.textContent = text;
  }
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return div; 
}

function streamMessage(div, fullText, chunkSize = 25, delay = 80) {
  // split once
  const words = fullText.split(" "); 
  let i = 0;

  const interval = setInterval(() => {
    // slice and join each time
    const chunk = words.slice(0, i + chunkSize).join(" "); 
    div.innerHTML = chunk.replace(/^\s*[-*]\s/gm, "• ").replace(/\n/g, "<br>");
    chatWindow.scrollTop = chatWindow.scrollHeight;

    i += chunkSize;
    if (i >= words.length) clearInterval(interval);
  }, delay);
}


async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  appendMessage("user", text);
  messageInput.value = "";
  sendBtn.disabled = true;

  try {
    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text })
    });

    const data = await res.json();

    const assistantDiv = appendMessage("assistant", "", true);

    streamMessage(assistantDiv, data.text, 20, 100); 

  } catch (error) {
    console.error(error);
    appendMessage("assistant", "Error: Could not get response.");
  } finally {
    sendBtn.disabled = false;
  }
}

sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
