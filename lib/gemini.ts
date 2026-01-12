
import { GoogleGenAI, Type } from "@google/genai";
import { Curriculum } from "./types";

export async function generateCurriculum(answers: Record<string, string>): Promise<Curriculum> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Transform simplified options into descriptive context for the AI
  const prompt = `
    Generate a highly opinionated learning curriculum for a student.
    
    GOAL: ${answers.goal}
    EXPERIENCE LEVEL: ${answers.level}
    TIME COMMITMENT: ${answers.constraints}

    STRATEGIC INSTRUCTIONS:
    - The user might have given short answers. Infer their needs based on the "EXPERIENCE LEVEL".
    - If they say "Total Beginner", include absolute first steps.
    - If they say "A lot!" or "Pro", skip all basic setup and focus on advanced architecture.
    - Each learning node MUST have a reasoning field explaining why this specific step helps them reach: "${answers.goal}".
    - The "path_strategy" field should explain your architectural approach to their goal.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: "You are LRNRN, an elite AI Learning Strategist. You take simple user inputs and turn them into professional-grade project roadmaps. You are encouraging but technically rigorous.",
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
  const prompt = `
    Find specific high-quality tutorials or docs for these steps:
    ${curriculum.nodes.map(n => n.title).join(', ')}
    
    Return a JSON array where each object has "node_title" and an array of "resources".
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
