var data = {};

async function AIFill() {
    try {
        let x = document.querySelector("button[type=submit]");
        if (x.innerText == 'NEXT QUESTION') {
            x.click();
            await delay(1000);
        }
    } catch(e) {}
    
    let questionsLeft = document.querySelector("body > kp-app > kp-platform > kp-app-shell > mat-sidenav-container > mat-sidenav-content > kp-main > main > rt-activity-sia > kp-content-lane > div > form > div > h2").innerText.replace(/[^\d\s]/g, "").replace(/\s+/g, " ").trim().split(' ');

    if (window.location.href.includes("https://course.apexlearning.com/public/activity")) {
        let question = '',
            input = null,
            answers = [];

        try {
            question = document.querySelector("body > kp-app > kp-platform > kp-app-shell > mat-sidenav-container > mat-sidenav-content > kp-main > main > rt-activity-sia > kp-content-lane > div > form > kp-sia-question > kp-content > .ng-star-inserted").innerText.replace(/\n/g, " ").replace(/&[^;]+;/g, '').replace(/<\/?[^>]+>/g, '');
        } catch (e) {
            console.log(e);
        }

        answers = Array.from(document.querySelector("body > kp-app > kp-platform > kp-app-shell > mat-sidenav-container > mat-sidenav-content > kp-main > main > rt-activity-sia > kp-content-lane > div > form > kp-sia-question > div > kp-sia-question-multiple-choice > mat-radio-group").querySelectorAll('.sia-distractor')).map((option) => {
            return option.querySelector('label > div > kp-content').innerText;
        });

        input = Array.from(document.querySelector("body > kp-app > kp-platform > kp-app-shell > mat-sidenav-container > mat-sidenav-content > kp-main > main > rt-activity-sia > kp-content-lane > div > form > kp-sia-question > div > kp-sia-question-multiple-choice > mat-radio-group").querySelectorAll('.sia-distractor')).map((option) => {
            return option.querySelector('label > mat-radio-button');
        });
        
        if (question !== '') {
            const AIreq = `!!!Return ONE number in the response!!! Return only the INDEX as a single number (e.g., [0], [1], [2], etc.). Do not include any additional text, explanations, or dialogue. If the input is invalid, return [0]. Given the question: "${question}", select the single best answer from the provided options array: [${answers}].`;

            data = {
                question: question,
                answers: answers,
                input: input,
                questionsLeft: questionsLeft,
            };

            console.log("Sending request to background");
            chrome.runtime.sendMessage({
                question,
                answers,
                AIreq
            }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Runtime error:", chrome.runtime.lastError);
                    return;
                }
                handleAIResponse(response);
            });
        }
    }
}

function handleAIResponse(message) {
    (async () => {
        try {
            if (message.error) {
                console.error("Error from background:", message.error);
                return;
            }

            if (message.result !== undefined) {
                console.log("Received result:", message.result);
                
                await delay(100);
                data.input[~~message.result].click();

                await delay(1000);
                const submitButton = document.querySelector("button[type=submit]");
                if (submitButton) {
                    submitButton.click();
                }

                chrome.runtime.sendMessage({ action: "done" });
            }
        } catch (e) {
            console.error("Error in content script:", e);
            chrome.runtime.sendMessage({ action: "error" });
        }
    })();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "ping") {
        sendResponse({ status: "alive" });
        return false;
    } else if (message.action === "Fill") {
        AIFill();
        sendResponse({ status: "started" });
        return false;
    }
    return true;
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}