let btn = document.getElementById("AiFill");

// listen for user input
btn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];

        // make sure were on right page
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

// check for AI status
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