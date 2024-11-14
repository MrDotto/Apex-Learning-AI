chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    try {
        const apiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "authorization": "Bearer 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"
            },
            method: "POST",
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
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
            const responseContent = result.choices[0].message.content;

            chrome.tabs.sendMessage(sender.tab.id, { request, result: responseContent });
        } else {
            console.error("Unexpected API response structure:", result);
        }

    } catch (error) {
        console.error("Error fetching the API:", error);
    }
});
