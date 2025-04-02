// import { apiCall } from "./api.js";
import { extractTextFromResume } from "./extractText.js";
import { parseResume } from "./parseResume.js";

let resumeText;

const getName = () => {
    return new Promise((resolve) => {
        chrome.storage.sync.get("name", (data) => {
            let name = data.name;
            if (Array.isArray(name)) {
                name = name[0]; 
            }
            resolve(name || "Name not available");
        });
    });
};


const getResumeText = () => {
    return new Promise((resolve) => {
        chrome.storage.sync.get("resumeText", (data) => {
            resolve(data.resumeText || "Resume data not available");
        });
    });
};


const redirect = async () => {
    const name = await getName();
    const resumeText = await getResumeText();  
    if (name && resumeText && 
        name !== "Name not available" && 
        resumeText !== "Resume data not available") {
        location.replace("home.html");
    } 
}

redirect();

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
            let {name,email,education,skills,experience} = await parseResume(text);
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
            });

            chrome.storage.sync.set({name:name},()=>{
                redirect();
                console.log("redirected");
            });
            
        } catch (error) {
            console.error("Error extracting text from resume:", error);
            alert("Failed to extract text from resume: " + error.message);
        }
    };
    reader.readAsArrayBuffer(file);
});

