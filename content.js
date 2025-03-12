chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "extractJobDetails") {
        let companyElement = document.querySelector(".job-details-jobs-unified-top-card__company-name");
        let companyName = companyElement ? companyElement.innerText.trim() : "Company Not Found";

        let positionElement = document.querySelector(".job-details-jobs-unified-top-card__job-title h1 a");
        let position = positionElement ? positionElement.innerText.trim() : "Position Not Found"; 

        let jobDescriptionElement = document.getElementById("job-details");
        let jobDescription = jobDescriptionElement ? jobDescriptionElement.innerText.trim() : "Job Description not Found";

        sendResponse({ companyName, position, jobDescription});
    }
    return true; 
});