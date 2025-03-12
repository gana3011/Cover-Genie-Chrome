document.getElementById("extractDetails").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "extractJobDetails" }, (response) => {
            if (response) {
                document.getElementById("companyName").innerText = response.companyName;
                document.getElementById("jobTitle").innerText = response.position; 
                document.getElementById("jobDescription").innerText = response.jobDescription;
            } else {
                alert("Failed to extract job details. Please make sure you're on a job listing page.");
            }
        });
    });
});