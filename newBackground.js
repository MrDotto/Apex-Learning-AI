chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    if (details.url.includes("course.apexlearning.com/public/activity")) {
        chrome.tabs.sendMessage(details.tabId, { action: "ping" }, (response) => {
            if (chrome.runtime.lastError || !response) {
                chrome.scripting.executeScript({
                    target: { tabId: details.tabId },
                    files: ['newContent_script.js'],
                }, () => {
                    console.log("Content script injected");
                });
            } else {
                console.log("Content script already injected");
            }
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Return true to indicate we'll respond asynchronously
    (async () => {
        try {
            const apiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                headers: {
                    "accept": "application/json",
                    "content-type": "application/json",
                    "authorization": "Bearer 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",
                    "mode": "cors"
                },
                method: "POST",
                body: JSON.stringify({
                    model: "deepseek-r1-distill-qwen-32b",
                    messages: [
                        { role: "system", content: "Follow instructions perfectly." },
                        { role: "user", content: request.AIreq }
                    ],
                    temperature: 0.1,
                    max_tokens: 2048,
                    top_p: 1
                })
            });

            const result = await apiResponse.json();

            if (result.choices && result.choices[0].message && result.choices[0].message.content) {
                const responseContent = result.choices[0].message.content.toString()
                    .replace(/<think>.*?<\/think>/gs, '')
                    .replace(/[^0-9]/g, '');
                // Use sendResponse here
                sendResponse({ request, result: responseContent });
            } else {
                console.error({ error: "Unexpected API response structure", result });
                sendResponse({ error: "Unexpected API response" });
            }
        } catch (e) {
            console.error({ error: JSON.stringify(e) });
            sendResponse({ error: e.message });
        }
    })();
    // Return true to keep the message channel open
    return true;
});