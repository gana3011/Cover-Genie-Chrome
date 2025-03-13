import { extractTextFromResume } from "./extractText.js";


document.getElementById("extractDetails").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "extractJobDetails" }, (response) => {
            if (response && response.companyName) {
                document.getElementById("companyName").innerText = response.companyName;
                document.getElementById("jobTitle").innerText = response.position;
                document.getElementById("jobDescription").innerText = response.jobDescription;
            } else {
                alert("Failed to extract job details. Please make sure you're on a job listing page.");
            }
        });
    });
});

document.getElementById("resumeUpload").addEventListener("change", async (event) => {
    let file = event.target.files[0];
    if (!file) return;
   
    let reader = new FileReader();
    reader.onload = async function (e) {
        let arrayBuffer = e.target.result;
        try {
            let text = await extractTextFromResume(arrayBuffer, file.type);
            document.getElementById("resumeText").innerText = text;
        } catch (error) {
            console.error("Error extracting text from resume:", error);
            alert("Failed to extract text from resume: " + error.message);
        }
    };
    reader.readAsArrayBuffer(file);
});