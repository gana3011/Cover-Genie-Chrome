import { apiCall } from "./api.js";

let jobDetails;

// Get user's name from storage
const { name: userName } = await chrome.storage.sync.get("name");
document.getElementById("greeting").innerHTML =  `Welcome to CoverGenie
${userName}`;

// Extract job details
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "extractJobDetails" }, async (response) => {
        if (response && response.companyName) {
            document.getElementById("companyName").innerText = response.companyName;
            document.getElementById("jobTitle").innerText = response.position;
            jobDetails = `
            Company Name: ${response.companyName}
            Job Title: ${response.position}
            Job Description: ${response.jobDescription}
            `;
        } else {
            alert("Failed to extract job details. Please make sure you're on a job listing page.");
        }
    });
});

// Function to get resume text from Chrome storage
const getResumeText = () => {
    return new Promise((resolve) => {
        chrome.storage.sync.get("resumeText", (data) => {
            resolve(data.resumeText || "Resume data not available");
        });
    });
};

// Add event listeners to both buttons
document.querySelectorAll("#generateCoverLetter, #generateDm").forEach((button) => {
    button.addEventListener("click", async () => {
        if (!jobDetails) {
            alert("Job details are not available yet. Please wait.");
            return;
        }
        button.disabled = true;

        const resumeText = await getResumeText();
        let prompt = "";

        if (button.id === "generateCoverLetter") {
            prompt = `Generate a personalized and compelling cover letter based on the following resume details:

Resume:
${resumeText}

Job Description:
${jobDetails}

Ensure the cover letter is tailored to the job role, highlighting relevant skills, experience, and enthusiasm for the position. Maintain a professional yet engaging tone, keeping the length between 250-300 words.`;
        } else if (button.id === "generateDm") {
            prompt = `Generate a concise and engaging LinkedIn DM to reach out to a recruiter or hiring manager based on the following details:

Resume:
${resumeText}

Job Description:
${jobDetails}

Ensure the message is polite, professional, and clearly conveys interest in the role. Keep it short (2-3 sentences) and include a call to action, such as asking for a quick chat or more details about the job.`;
        }

        // Call the API and update the textarea
        const responseText = await apiCall(resumeText, jobDetails, prompt);
        const coverLetterTextarea = document.getElementById("coverLetter");
        coverLetterTextarea.value = responseText;

        button.disabled = false;
    });
});

// Copy to clipboard
document.getElementById("copy").addEventListener("click", () => {
    const coverLetterTextarea = document.getElementById("coverLetter");
    coverLetterTextarea.select();
    navigator.clipboard.writeText(coverLetterTextarea.value)
        .then(() => alert("Copied to clipboard"))
        .catch((err) => console.error("Failed to copy:", err));
});

document.getElementById("download").addEventListener("click",async()=>{
    const doc = new window.jspdf.jsPDF();
    const coverLetterText = document.getElementById("coverLetter").value;
    doc.setFontSize(12);
    doc.text(coverLetterText,10,10,{maxWidth:180});
    doc.save("CoverGenie.pdf");
})

document.getElementById("home").addEventListener("click",()=>{
    chrome.storage.sync.clear(() => {
        window.location.href = "popup.html";
    });
})
