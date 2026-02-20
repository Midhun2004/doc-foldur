const ageCheck = document.getElementById("ageCheck");
const startBtn = document.getElementById("startBtn");

const welcomePage = document.getElementById("welcomePage");
const facePage = document.getElementById("facePage");
const voicePage = document.getElementById("voicePage");

const video = document.getElementById("video");
const faceStatus = document.getElementById("faceStatus") || document.getElementById("statusText");

const warningPopup = document.getElementById("warningPopup");
const retryBtn = document.getElementById("retryBtn");
const swapVoiceBtn = document.getElementById("swapVoiceBtn");
const closePopup = document.getElementById("closePopup");

const voiceBtn = document.getElementById("voiceBtn");
const voicePopup = document.getElementById("voicePopup");

/* Enable Start button */
ageCheck.addEventListener("change", () => {
  if (ageCheck.checked) {
    startBtn.disabled = false;
    startBtn.classList.add("active");
  } else {
    startBtn.disabled = true;
    startBtn.classList.remove("active");
  }
});

/* Start → Face Page */
startBtn.onclick = () => {
  welcomePage.classList.remove("active");
  facePage.classList.add("active");
  startCamera();
};

/* Start Camera */
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    simulateFaceScan();
  } catch {
    faceStatus.textContent = "Camera permission denied ❌";
  }
}

/* Stop Camera */
function stopCamera() {
  const stream = video.srcObject;
  if (stream) stream.getTracks().forEach(track => track.stop());
}

/* Simulated Face Scan (5 seconds) */
function simulateFaceScan() {
  let time = 0;
  faceStatus.textContent = "Scanning face...";

  const scanTimer = setInterval(() => {
    time++;
    faceStatus.textContent = `Scanning face (${time}/5)`;

    if (time === 5) {
      clearInterval(scanTimer);
      stopCamera();

      const match = Math.random() > 0.3; // 70% success

      if (match) {
        faceStatus.textContent = "Face verified ✅";

        setTimeout(() => {
          facePage.classList.remove("active");
          voicePage.classList.add("active");
        }, 1000);

      } else {
        showWarning();
      }
    }
  }, 1000);
}

/* Warning Popup */
function showWarning() {
  warningPopup.classList.add("active");
}

retryBtn.onclick = () => {
  warningPopup.classList.remove("active");
  startCamera();
};

swapVoiceBtn.onclick = () => {
  warningPopup.classList.remove("active");
  facePage.classList.remove("active");
  voicePage.classList.add("active");
};

closePopup.onclick = () => {
  warningPopup.classList.remove("active");
};

/* Voice Authentication */
voiceBtn.onclick = () => {
  voicePopup.classList.add("active");

  setTimeout(() => {
    voicePopup.classList.remove("active");
    alert("Voice authentication successful 🎉");
  }, 3000);
};

const voiceText = document.getElementById("voiceText");
const popupText = document.getElementById("popupText");

/* Voice Authentication */
voiceBtn.onclick = () => {
  voicePopup.classList.add("active");
  popupText.textContent = "Listening...";

  // Simulate voice processing (3 seconds)
  setTimeout(() => {
    voicePopup.classList.remove("active");

    const voiceMatch = Math.random() > 0.4; // 60% success

    if (voiceMatch) {
      voiceText.textContent = "Voice verified ✅";
      alert("Login successful 🎉");
    } else {
      voiceText.textContent = "Voice not recognized ❌";
      showVoiceWarning();
    }
  }, 3000);
};

function showVoiceWarning() {
  warningPopup.classList.add("active");

  // Change swap button text to go back to Face
  swapVoiceBtn.textContent = "Swap to Face";

  // Retry = try voice again
  retryBtn.onclick = () => {
    warningPopup.classList.remove("active");
    voiceBtn.click();
  };

  // Swap = go back to face scan
  swapVoiceBtn.onclick = () => {
    warningPopup.classList.remove("active");
    voicePage.classList.remove("active");
    facePage.classList.add("active");
    startCamera();
  };
}