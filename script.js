document.getElementById("queryForm").addEventListener("submit", async function(event) {
  event.preventDefault();
  
  const email = document.getElementById("email").value;
  const button = this.querySelector('button');
  const statusMessage = document.getElementById("statusMessage");
  
  if (!email) {
    showMessage("請輸入電子郵件地址", "error");
    return;
  }

  button.classList.add('loading');
  statusMessage.textContent = "";
  statusMessage.classList.remove('show');

  try {
    const url = `https://script.google.com/macros/s/AKfycbwkdCnCyYt3HZexrPX_VfhvNmNvxPihafj2-NxVFZL1X9HgYU0kNgcElMF8YZ_ZIPpIkg/exec?action=checkStatus&email=${encodeURIComponent(email)}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    showMessage(data.message || "未找到邀請碼狀態", data.success ? "success" : "error");
  } catch (error) {
    console.error("錯誤:", error);
    showMessage("查詢時發生錯誤，請稍後再試。", "error");
  } finally {
    button.classList.remove('loading');
  }
});

function showMessage(message, type) {
  const statusMessage = document.getElementById("statusMessage");
  statusMessage.textContent = message;
  statusMessage.className = type;
  // Force a reflow
  void statusMessage.offsetWidth;
  statusMessage.classList.add('show');
}

// Add input animation
document.getElementById("email").addEventListener("focus", function() {
  this.closest("form").querySelector("label").style.color = "#4CAF50";
});

document.getElementById("email").addEventListener("blur", function() {
  this.closest("form").querySelector("label").style.color = "#34495e";
});