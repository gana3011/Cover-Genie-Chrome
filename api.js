import { API_KEY } from "./config.js";

export const apiCall = async(resumeText,jobDetails)=>{
    if (!resumeText || !jobDetails) {
        alert("Please upload a resume and extract job details first.");
        return;
    }    
    console.log(resumeText);
    console.log(jobDetails);
    const api_endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`
    let prompt = `Generate a personalized and compelling cover letter based on the following resume details:

Resume:
${resumeText}

Job Description:
${jobDetails}

Ensure the cover letter is tailored to the job role, highlighting relevant skills, experience, and enthusiasm for the position. Maintain a professional yet engaging tone, keeping the length between 250-300 words.`;
    const requestBody = {
        contents: [{ parts: [{ text: prompt }] }]
    };
    try {
        const response = await fetch(api_endpoint,{
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        })
        const data = await response.json()
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return "Error generating response.";
    }
}