// import { apiCall } from "./api.js";
import { extractTextFromResume } from "./extractText.js";
import { parseResume } from "./parseResume.js";

let resumeText;

const userName = await chrome.storage.sync.get("name");
console.log(userName);
if (userName){
   
        location.replace("home.html")

    console.log("redirected");
}


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

