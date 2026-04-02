import Groq from "groq-sdk";

export const analyzePolicy = async (policyText) => {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `Analyze the following insurance policy comprehensively and return ONLY a valid JSON object matching the exact structure below. Be concise but highly informative. Use scores from 0-100 where indicated.

JSON Structure:
{
  "coreInsights": {
    "summary": "Str (Brief 1-2 sentence summary)",
    "coverageOverview": "Str (What does it primarily cover)",
    "premiumDetails": "Str (Any deductions about premium costs)",
    "durationInfo": "Str (Term length or renewal info)",
    "eligibility": "Str (Who is eligible)"
  },
  "smartAnalysis": {
    "coverageScore": Num (0-100),
    "riskLevel": "Low | Medium | High",
    "complexityLevel": "Easy | Medium | Hard",
    "claimProbability": "Low | Medium | High",
    "strengthScore": Num (0-100)
  },
  "alertsGaps": {
    "missingCoverage": ["Str", "Str..."],
    "hiddenClauses": ["Str", "Str..."],
    "highRiskConditions": ["Str", "Str..."],
    "exclusionsSummary": ["Str", "Str..."],
    "claimRejectionRisk": "Low | Medium | High"
  },
  "valueAnalysis": {
    "premiumVsCoverage": "Str (Short analysis)",
    "valueForMoney": "Poor | Fair | Good | Excellent",
    "benefitBreakdown": ["Str", "Str..."],
    "costEfficiencyScore": Num (0-100)
  },
  "comparisonSupport": {
    "similarPolicies": ["Str (e.g., Standard Health Plans)", "Str..."],
    "betterAlternatives": ["Str", "Str..."],
    "similarityIndicator": Num (0-100)
  },
  "reasons": ["Str (List of exact risky clauses for highlighting)"]
}

Policy Text:
${policyText}`
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0,
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(chatCompletion.choices[0].message.content);
        // Add backward compatibility fields
        result.risk = result.smartAnalysis?.riskLevel || "Medium";
        result.complexity = result.smartAnalysis?.complexityLevel || "Medium";
        
        return result;
    } catch (error) {
        console.error("Groq Analysis Error:", error);
        throw new Error("Failed to analyze policy");
    }
};

export const generateDynamicForm = async (title, description) => {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert insurance underwriter interface generator. Your job is to return a JSON array containing the 4 to 6 most critical required form fields needed from a user to underwrite a specific policy. Output ONLY a valid JSON object with a single root key 'fields'. Each field object inside 'fields' MUST contain: 'name' (camelCase string), 'label' (User friendly title), 'type' (strictly 'text' or 'number'), 'required' (boolean true or false), and 'placeholder' (example value). Always include 'age' (number) and 'annualIncome' (number) fields."
                },
                {
                    role: "user",
                    content: `Generate form fields for this policy:\n\nTitle: ${title}\nDescription: ${description}`
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0,
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(chatCompletion.choices[0].message.content);
        return result.fields || [];
    } catch (error) {
        console.error("Groq Form Gen Error:", error);
        throw new Error("Failed to generate dynamic form fields");
    }
};
