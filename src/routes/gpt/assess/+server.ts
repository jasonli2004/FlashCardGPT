import OpenAI from 'openai';
// import { OpenAIStream, StreamingTextResponse } from 'ai';
 
import { env } from '$env/dynamic/private';
// You may want to replace the above with a static private env variable
// for dead-code elimination and build-time type-checking:
// import { OPENAI_API_KEY } from '$env/static/private'
 
import type { RequestHandler } from '@sveltejs/kit';
 
// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY || '',
});
 
export const POST: RequestHandler = async ({ request }) => {
  // Extract the `prompt` from the body of the request
  const { messages } = await request.json();
  let answer = messages[0].answer;

  let flashcardFeedback = "Given the following information from a flashcard quiz, evaluate the user's answer " +
"by comparing it to the provided explanation or definition. The term or concept from the front of the " +
"flashcard, the explanation or definition on the back, and the user's answer are provided below. Your task " +
"is to assess the user's understanding and classify their response as \"correct,\" \"wrong,\" or \"partial correct.\" " +
"Additionally, provide constructive feedback aimed at improving the user's understanding of the concept. " +
"The evaluation and feedback should be formatted as a JSON response.";
  let assessmentCriteria = "Assessment Criteria:\n\n" + 
  "Accuracy: The user's answer accurately reflects the key aspects of the explanation or " + 
  "definition provided.\n" + 
  "Relevance: The answer is relevant to the term or concept and its significance within the " + 
  "specified subject or context.\n" + 
  "Completeness: The response covers the essential elements of the concept's explanation or " + 
  "definition.\n\n" + 
  "Instructions for ChatGPT:\n\n" + 
  "For evaluating user's answers on flashcard quizzes, provide direct and very concise " + 
  "feedback by classifying their understanding as \"correct,\" \"wrong,\" or \"partial correct.\" " + 
  "Also, offer specific guidance aimed at improving their grasp of the concept based on the " + 
  "accuracy, relevance, and completeness of their response. Use the following JSON " + 
  "structure for your evaluations:\n" + 
  "{\n" + 
  "  \"evaluation\": \"correct/wrong/partial correct\",\n" + 
  "  \"feedback\": \"Provide a brief explanation tailored to guiding the user towards a better " + 
  "understanding of the concept. Mention any significant aspects of the concept that the " + 
  "user's answer did or did not cover, and suggest ways to improve if necessary.\"\n" + 
  "}\n" + 
  "If an error is encountered in processing the evaluation, return \"error\" in the evaluation " + 
  "field and provide an appropriate error message in the feedback field.";


  // console.log(messages);
  try {
    // Send the request to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      // model: "gpt-4-0125-preview",
      messages: [
        {
          role: "user",
          content: flashcardFeedback+" " + answer+ " " + assessmentCriteria
        }
      ],
      stream: false,
      max_tokens: 300,
    });

    // Create a Response object with the API response as the body
    return new Response(JSON.stringify(response), { // Ensure to return the correct part of the response
      status: 200, // HTTP status code: OK
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    // Handle errors by returning a server error response
    return new Response(JSON.stringify({ error: 'An error occurred.' }), {
      status: 500, // HTTP status code: Server Error
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};