var data = {};

function AIFill() {
    let questionsLeft = document.querySelector("body > kp-app > kp-platform > kp-app-shell > mat-sidenav-container > mat-sidenav-content > kp-main > main > rt-activity-sia > kp-content-lane > div > form > div > h2").innerText.replace(/[^\d\s]/g, "").replace(/\s+/g, " ").trim().split(' ');

    if (window.location.href.includes("https://course.apexlearning.com/public/activity")) {
        let question = '',
            input = null,
            type = null,
            answers = [];

        try {
            question = document.querySelector("body > kp-app > kp-platform > kp-app-shell > mat-sidenav-container > mat-sidenav-content > kp-main > main > rt-activity-sia > kp-content-lane > div > form > kp-sia-question > kp-content > .ng-star-inserted").innerText.replace(/\n/g, " ").replace(/&[^;]+;/g, '').replace(/<\/?[^>]+>/g, '');
        } catch (e) {}

        answers = Array.from(document.querySelector("body > kp-app > kp-platform > kp-app-shell > mat-sidenav-container > mat-sidenav-content > kp-main > main > rt-activity-sia > kp-content-lane > div > form > kp-sia-question > div > kp-sia-question-multiple-choice > mat-radio-group").querySelectorAll('.sia-distractor')).map((option) => {
            return option.querySelector('label > div > kp-content').innerText;
        });

        input = Array.from(document.querySelector("body > kp-app > kp-platform > kp-app-shell > mat-sidenav-container > mat-sidenav-content > kp-main > main > rt-activity-sia > kp-content-lane > div > form > kp-sia-question > div > kp-sia-question-multiple-choice > mat-radio-group").querySelectorAll('.sia-distractor')).map((option) => {
            return option.querySelector('label > mat-radio-button');
        });
        
        if (question != '') {
            AIreq = `Given the question: "${question}", select the single best answer from the provided options array: ${answers}. Return only the INDEX, not answer. INDEX OF THE answer: (0, 1, 2, etc...) of the correct answer from the options array ${answers}. Respond with the index as a single integer only, with no additional text, explanations, or dialogue. Return the best answer. if invalid return [0]`;

            data = {
                type: type,
                question: question,
                answers: answers,
                input: input,
                result: undefined,
                questionsLeft: questionsLeft,
            };

            chrome.runtime.sendMessage({
                question,
                answers,
                AIreq
            });
        }
    }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "Fill") {
        AIFill();
        return false;
    }

    if (!message.result) {
        return false;
    }

    try {
        if (data) {
            await delay(100);
            data.input[~~message.result].click();

            await delay(1000);
            document.querySelector("button[type=submit]").click();
            
            while (true) {
                if (document.querySelector("button[type=submit]")) {
                    document.querySelector("button[type=submit]").addEventListener("click", async (e) => {
                        if (data.questionsLeft[0] == data.questionsLeft[1]) {
                            chrome.runtime.sendMessage({ action: "done" })
                        } else {
                            await delay(5000);
                            AIFill();
                        }
                    });
                    break;
                }
            }
        }
    } catch (a) {

    }
});

chrome.runtime.sendMessage({ action: "herf", data: window.location.href });

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
