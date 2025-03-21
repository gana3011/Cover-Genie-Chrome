// import { apiCall } from "./api.js";
import { extractTextFromResume } from "./extractText.js";
import { parseResume } from "./parseResume.js";

let resumeText,jobDetails,coverLetter;

const userName = await chrome.storage.sync.get("name");
console.log(userName);
if (userName){
   
        location.replace("home.html")

    console.log("redirected");
}


// document.getElementById("extractDetails").addEventListener("click", () => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.tabs.sendMessage(tabs[0].id, { action: "extractJobDetails" }, async (response) => {
//             if (response && response.companyName) {
//                 // document.getElementById("companyName").innerText = response.companyName;
//                 // document.getElementById("jobTitle").innerText = response.position;
//                 // document.getElementById("jobDescription").innerText = response.jobDescription;
//                 jobDetails = `
//                 Company Name: ${response.companyName}
//                 Job Title: ${response.position}
//                 Job Description: ${response.jobDescription}
//                 `;
//                 chrome.storage.sync.get("resumeText", async (data) => {
//                     resumeText = data.resumeText || "Resume data not available";
//                     coverLetter = await apiCall(resumeText, jobDetails);
//                     document.getElementById("coverLetter").innerText = coverLetter;
//                 });                
//                 // jobDetails = `Companyname:${response.companyName}\n JobTitle:${response.position}\n JobDesciption:${response.jobDescription}`;
//                 // coverLetter = await apiCall(resumeText,jobDetails);
//                 // document.getElementById("coverLetter").innerText = coverLetter;
//             } else {
//                 alert("Failed to extract job details. Please make sure you're on a job listing page.");
//             }
//         });
//     });
// });

document.getElementById("resumeForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    let fileInput = document.getElementById("resumeUpload");
    let file = fileInput.files[0];
    if (!file) return;
   
    let reader = new FileReader();
    reader.onload = async function (e) {
        let arrayBuffer = e.target.result;
        try {
            let text = await extractTextFromResume(arrayBuffer, file.type);
            let {name,email,phone,education,skills,experience} = await parseResume(text);
            resumeText = `
            Name: ${name}
            Email: ${email}
            Education: ${education}
            Skills: ${skills}
            Experience: ${experience}
            `;
            
            // chrome.storage.sync.set({userName:name,userEmail:email,userPhone:phone,userEducation:education,userSkills:skills,userExperience:experience},()=>{
            //     console.log("User data saved");
            // });
            chrome.storage.sync.set({resumeText:resumeText},()=>{
                console.log("resume text saved")
            });

            chrome.storage.sync.set({name:name},()=>{
                console.log("name saved")
                redirect();
            });
            
        } catch (error) {
            console.error("Error extracting text from resume:", error);
            alert("Failed to extract text from resume: " + error.message);
        }
    };
    reader.readAsArrayBuffer(file);
});

