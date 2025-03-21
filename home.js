import { apiCall } from "./api.js";
let jobDetails,coverLetter;


const userName = await chrome.storage.sync.get("name");
console.log(userName);

document.getElementById("name").innerText = userName.name;

document.getElementById("extractDetails").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "extractJobDetails" }, async (response) => {
            if (response && response.companyName) {
                // document.getElementById("companyName").innerText = response.companyName;
                // document.getElementById("jobTitle").innerText = response.position;
                // document.getElementById("jobDescription").innerText = response.jobDescription;
                jobDetails = `
                Company Name: ${response.companyName}
                Job Title: ${response.position}
                Job Description: ${response.jobDescription}
                `;
                chrome.storage.sync.get("resumeText", async (data) => {
                    resumeText = data.resumeText || "Resume data not available";
                    coverLetter = await apiCall(resumeText, jobDetails);
                    document.getElementById("coverLetter").innerText = coverLetter;
                });                
                // jobDetails = `Companyname:${response.companyName}\n JobTitle:${response.position}\n JobDesciption:${response.jobDescription}`;
                // coverLetter = await apiCall(resumeText,jobDetails);
                // document.getElementById("coverLetter").innerText = coverLetter;
            } else {
                alert("Failed to extract job details. Please make sure you're on a job listing page.");
            }
        });
    });
});