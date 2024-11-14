let btn = document.getElementById("AiFill"),
    herf = '';

btn.addEventListener("click", (()=> {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].id) {
            chrome.tabs.sendMessage(
            tabs[0].id,
            { action: "Fill"},
            (response) => {
            }
            );
        }
    });
    btn.innerHTML = "loading...";
}));

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action == "done") {
        btn.innerHTML = "Completed!";
        btn.style.background = "#4e8056";
    }
});
