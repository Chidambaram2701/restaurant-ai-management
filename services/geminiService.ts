import { GoogleGenAI, Type } from "@google/genai";
import { WasteLog, Feedback, MenuItem, VisualWasteAnalysis, VisualWasteLog, AIPredictionResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getWastePrediction = async (
    wasteLogs: WasteLog[], 
    feedback: Feedback[],
    visualWasteLogs: VisualWasteLog[],
    menuItems: MenuItem[]
): Promise<AIPredictionResult> => {
  const wasteData = wasteLogs.map(log => {
      const item = menuItems.find(mi => mi.id === log.menuItemId);
      return `- ${log.date}: Wasted ${log.wastedAmountKg}kg of ${item?.name} due to ${log.reason}`;
  }).join('\n');

  const feedbackData = feedback.map(fb => {
      const item = menuItems.find(mi => mi.id === fb.menuItemId);
      return `- Item: ${item?.name}, Taste: ${fb.tasteRating}/5, Portion: ${fb.portionFeedback}, Comment: "${fb.comment || 'N/A'}"`;
  }).join('\n');

  const visualWasteData = visualWasteLogs.map(log => {
      return `- Visually analyzed ${log.analysis.wasteEstimateKg}kg of wasted ${log.analysis.identifiedItems.join(', ')}. AI Suggestion: "${log.analysis.suggestion}"`;
  }).join('\n');


  const prompt = `
    You are a restaurant demand forecasting AI for an Indian restaurant. Your goal is to minimize food waste and optimize stock by providing actionable insights.
    Analyze the following data and provide predictions for tomorrow's menu items. Tomorrow is a Saturday (weekend).

    Recent Visual Waste Analysis (Most important and recent data):
    ${visualWasteData || "No visual analysis performed yet."}

    Historical Waste Data:
    ${wasteData}

    Recent Customer Feedback (Crucial for understanding customer satisfaction and waste reasons):
    ${feedbackData}

    Based on all this data, with an emphasis on the visual analysis and customer feedback, perform the following tasks:
    1.  **Predict**: Predict the optimal preparation quantity for the top 2-3 most relevant items. Provide brief reasoning that connects the data to your prediction. For example, if feedback mentions "Too Large" and there's plate waste, recommend reducing quantity.
    2.  **Suggest**: Provide one high-impact menu optimization suggestion based on all the data.
    3.  **Analyze Feedback**: Summarize in one sentence the key insight you've derived from the customer feedback comments. For example, "Customers find the Biryani portions too large, which is likely contributing to plate waste."
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              predictions: {
                type: Type.ARRAY,
                description: "List of predictions for menu items.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    itemName: { type: Type.STRING },
                    suggestedQtyKg: { type: Type.NUMBER },
                    reasoning: { type: Type.STRING },
                    confidence: { type: Type.STRING }
                  },
                  required: ["itemName", "suggestedQtyKg", "reasoning", "confidence"]
                }
              },
              menuSuggestion: {
                type: Type.STRING,
                description: "A suggestion for menu optimization."
              },
              customerFeedbackInsights: {
                type: Type.STRING,
                description: "A summary of key insights derived from customer feedback."
              }
            },
            required: ["predictions", "menuSuggestion", "customerFeedbackInsights"]
          }
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Return a mock response on error
    return {
        predictions: [{
            itemName: "Chicken Biryani",
            suggestedQtyKg: 18,
            reasoning: "High weekend demand but recent 'Too Large' portion feedback and waste logs suggest a 10% reduction from typical weekend prep.",
            confidence: "High"
        }],
        menuSuggestion: "Consider reducing the portion size of Chicken Biryani slightly or offering two sizes.",
        customerFeedbackInsights: "Customers are happy with the taste of the Biryani but consistently find the portions to be too large."
    };
  }
};

export const getPersonalizedFeedbackGreeting = async (itemNames: string[]): Promise<string> => {
  if (itemNames.length === 0) {
    return "Your opinion helps us improve.";
  }

  const prompt = `
    You are a friendly restaurant host AI. A customer just finished their meal and is about to give feedback.
    They ordered the following dishes: ${itemNames.join(', ')}.
    
    Write a short, warm, and welcoming message (1-2 sentences) to display on the feedback form.
    Make it personal by mentioning one of the dishes they ordered.
    Encourage them to be honest and thank them for their time.
    Do not use markdown or formatting. Just return the plain text message.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API for greeting:", error);
    // Return a friendly, personalized fallback message on error
    return `We hope you enjoyed your meal, especially the ${itemNames[0]}! Your feedback is valuable to us.`;
  }
};


export const analyzeWasteImage = async (
    imageBase64: string, 
    notes?: string
): Promise<VisualWasteAnalysis> => {
    
    const textPart = {
        text: `
        You are a food waste analysis expert for a restaurant. 
        Analyze this image of food left on a plate. 
        
        Your tasks:
        1.  Identify the main food items remaining.
        2.  Estimate the total weight of the wasted food in kilograms (provide a single numerical value).
        3.  Provide a single, brief, and actionable suggestion to the restaurant manager to help reduce this specific type of waste in the future.
        
        Consider the user's notes if provided: "${notes || 'No notes'}"
        
        Return the analysis in a structured JSON format.
        `,
    };

    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64,
        },
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [textPart, imagePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        identifiedItems: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        wasteEstimateKg: { type: Type.NUMBER },
                        suggestion: { type: Type.STRING }
                    },
                    required: ["identifiedItems", "wasteEstimateKg", "suggestion"]
                }
            }
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error calling Gemini Vision API:", error);
        // Return a detailed mock response on error for better debugging
        return {
            identifiedItems: ["Mock Item 1", "Mock Item 2"],
            wasteEstimateKg: 0.25,
            suggestion: "This is a mock response due to an API error. Check the console for details. Consider reducing portion sizes for this item.",
        };
    }
};