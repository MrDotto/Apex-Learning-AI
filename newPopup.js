let btn = document.getElementById("AiFill");

btn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (tab && tab.url.includes("course.apexlearning.com/public/activity")) {
            chrome.tabs.sendMessage(tab.id, { action: "Fill", fullyAutomatic: document.querySelector("#fullyAutomatic").checked }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Content script error:", chrome.runtime.lastError.message);
                    btn.innerHTML = "Error!";
                    btn.style.background = "#ff4444";
                    setTimeout(() => {
                        btn.innerHTML = "Ai Fill";
                        btn.style.background = "";
                    }, 2000);
                }
            });
            btn.innerHTML = "loading...";
        }
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "done") {
        btn.innerHTML = "Completed!";
        btn.style.background = "#4e8056";
        setTimeout(() => {
            btn.innerHTML = "Ai Fill";
            btn.style.background = "";
        }, 2000);
    } else if (message.action === "error") {
        btn.innerHTML = "Error try again!";
        btn.style.background = "#FF0000";
        setTimeout(() => {
            btn.innerHTML = "Ai Fill";
            btn.style.background = "";
        }, 2000);
    }
});