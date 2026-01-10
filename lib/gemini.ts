
import { GoogleGenAI, Type } from "@google/genai";
import { Curriculum } from "./types";

// Note: Create a new GoogleGenAI instance right before making an API call 
// to ensure it uses the most up-to-date API key from the environment.

export async function generateCurriculum(answers: Record<string, string>): Promise<Curriculum> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Generate a highly opinionated learning curriculum for a student with the following context:
    GOAL: ${answers.goal}
    EXISTING EXPERIENCE: ${answers.level}
    CONSTRAINTS: ${answers.constraints}

    STRATEGIC REQUIREMENTS:
    - Skip fundamentals they already know based on their experience.
    - Order by dependency of their project, not traditional CS order.
    - Each node MUST have a reasoning field (min 100 chars) explaining WHY this step is critical for THEIR specific project.
    - Be realistic with hours.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          path_strategy: { type: Type.STRING },
          total_hours: { type: Type.NUMBER },
          completion_milestone: { type: Type.STRING },
          nodes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                reasoning: { type: Type.STRING },
                estimated_hours: { type: Type.NUMBER },
                prerequisites: { type: Type.ARRAY, items: { type: Type.STRING } },
                learning_outcomes: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "description", "reasoning", "estimated_hours"]
            }
          }
        },
        required: ["title", "nodes", "path_strategy"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function attachResources(curriculum: Curriculum): Promise<Curriculum> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Enhanced prompt to hunt for specific high-quality links
  const prompt = `
    For each of the following learning nodes, identify 2-3 specific high-quality resources from reputable sources like MDN, React.dev, YouTube (Fireship, Theo, WebDevSimplified), or personal blogs (Josh Comeau, Kent C. Dodds).
    Provide exact resource URLs and a reasoning for each selection.

    CURRICULUM NODES:
    ${curriculum.nodes.map(n => n.title).join(', ')}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            node_title: { type: Type.STRING },
            resources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING },
                  type: { type: Type.STRING },
                  source: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                  quality_score: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    }
  });

  const resourceMap = JSON.parse(response.text);
  
  const updatedNodes = curriculum.nodes.map(node => {
    const matched = resourceMap.find((m: any) => m.node_title === node.title);
    return {
      ...node,
      resources: matched ? matched.resources : []
    };
  });

  return { ...curriculum, nodes: updatedNodes };
}
