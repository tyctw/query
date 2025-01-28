document.getElementById("queryForm").addEventListener("submit", async function(event) {
  event.preventDefault();
  
  const email = document.getElementById("email").value;
  const button = this.querySelector('.submit-btn');
  const response = document.getElementById("response");
  const statusMessage = document.getElementById("statusMessage");
  
  if (!email) {
    showError("請輸入電子郵件地址");
    return;
  }

  button.classList.add('loading');
  statusMessage.textContent = "正在查詢...";
  response.className = "response";

  try {
    const url = `https://script.google.com/macros/s/AKfycbwkdCnCyYt3HZexrPX_VfhvNmNvxPihafj2-NxVFZL1X9HgYU0kNgcElMF8YZ_ZIPpIkg/exec?action=checkStatus&email=${encodeURIComponent(email)}`;
    
    const result = await fetch(url);
    const data = await result.json();
    
    if (data.success) {
      response.classList.add('success');
    } else {
      response.classList.add('error');
    }
    
    statusMessage.textContent = data.message || "未找到邀請碼狀態";
  } catch (error) {
    console.error("錯誤:", error);
    showError("查詢時發生錯誤，請稍後再試。");
  } finally {
    button.classList.remove('loading');
  }
});

function showError(message) {
  const response = document.getElementById("response");
  const statusMessage = document.getElementById("statusMessage");
  
  statusMessage.textContent = message;
  response.className = "response error";
}