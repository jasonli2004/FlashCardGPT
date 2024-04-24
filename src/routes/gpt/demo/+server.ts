import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
 
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
  let prompt = "I'm compiling a set of digital flashcards from my notes on [subject/topic], "
  + "concentrating on the most critical concepts, terms, and theories necessary for a thorough "
  + "understanding and examination preparation in this area. The intention is to distill the essence "
  + "of the subject matter into concise, significant points for an efficient study process. To ensure "
  + "the flashcards serve as a dynamic study tool, the content will not only cover essential material "
  + "but will be crafted to engage different learning styles and cognitive processes without explicitly "
  + "categorizing the flashcards into predefined types. The aim is to create a learning experience that "
  + "goes beyond memorization, encouraging understanding, application, and critical thinking about the "
  + "subject matter. This method aligns with how flashcards on platforms like Quizlet facilitate focused "
  + "learning but is tailored to ensure content relevance and depth.\n\n"
  + "The explanations on the back of each flashcard should be concise yet comprehensive, avoiding "
  + "unnecessary detail while still providing enough context to understand the significance of the term "
  + "or concept within the broader subject matter. This approach is not restricted to only definitions; "
  + "it can include examples, applications, or critical thinking questions related to the term or concept. "
  + "If a flashcard's content is too extensive for a single card, it should be divided into multiple cards "
  + "to ensure clarity and retain focus on key points.\n\n"
  + "Consider the following examples as a guide for what I’m aiming for:\n\n"
  + "Example Flashcard 1:\n\n"
  + "Front: Mitosis\n"
  + "Back: A cell division process resulting in two genetically identical daughter cells, essential for growth "
  + "and repair in organisms.\n"
  + "Example Flashcard 2:\n\n"
  + "Front: Magna Carta\n"
  + "Back: A charter of liberties signed in 1215 that limited the king's power in England, marking the beginning "
  + "of constitutional governance.\n"
  + "Example Flashcard 3:\n\n"
  + "Front: Number of Electrons in Hydrogen\n"
  + "Back: One\n"
  + "Example Flashcard 4:\n\n"
  + "Front: The Duration of World War II\n"
  + "Back: 1939 to 1945\n"
  + "Example Flashcard 5:\n\n"
  + "Front: The Boiling Point of Water at Sea Level\n"
  + "Back: 100 degrees Celsius\n"
  + "Example Flashcard 6:\n\n"
  + "Front: The Capital of France\n"
  + "Back: Paris\n"
  + "Example Flashcard 7:\n\n"
  + "Front: The Year the Internet Publicly Debuted\n"
  + "Back: 1991\n"
  + "Example Flashcard 8:\n\n"
  + "Front: Network\n"
  + "Back: A collection of interconnected devices such as computers, servers, and routers that allows them to "
  + "communicate and share information.\n"
  + "Example Flashcard 9:\n\n"
  + "Front: Market Economy\n"
  + "Back: An economic system where decisions of individual producers and consumers largely determine what, "
  + "how, and for whom to produce, with little government involvement.\n"
  + "Example Flashcard 10:\n\n"
  + "Front: Ecosystem\n"
  + "Back: A biological community of interacting organisms and their physical environment, essential for studying "
  + "ecological interactions and conservation biology.\n"
  + "Example Flashcard 11:\n\n"
  + "Front: Observational Studies\n"
  + "Back: Research methods that collect data without manipulating the study environment, often used to find "
  + "correlations, not causations.\n"
  + "Example Flashcard 12:\n\n"
  + "Front: Alkanes\n"
  + "Back: Organic compounds consisting solely of hydrogen and carbon atoms arranged in a tree-like structure "
  + "without any branches.\n\n"
  + "Please create a set of flashcards from the provided summarized notes, focusing on presenting a key term "
  + "or concept on the front and a comprehensive explanation or definition on the back, as well as including "
  + "simple fact-based cards. The first step is to look and comprehend the picture/file, and the second step "
  + "is to create the flashcards based on the notes. Finally, organize the flashcards in JSON format with a "
  + "'front and back' structure for each card, aiming for clarity and conciseness:\n\n"
  + "{\n"
  + "  \"flashcards\": [\n"
  + "    {\n"
  + "      \"front\": \"[Term/Concept]\",\n"
  + "      \"back\": \"[Explanation/Definition/Fact], emphasizing its significance in [Subject/Context].\"\n"
  + "    },\n"
  + "    // Additional flashcards based on essential content\n"
  + "  ]\n"
  + "}\n\n"
  + "The content should exclusively cover the most impactful and study-worthy material, avoiding trivial or "
  + "non-essential information, to facilitate targeted learning and retention. Please only return the json file "
  + "for flashcards without any other words or explanation or greeting. For json output, I want you to start "
  + "with '```json' and end with '```'. If there's an error in the process or you’re unable to complete the task "
  + "or the image doesn’t appear to be a lecture note or slides (or empty image), please return the text 'error'.";
  // Ask OpenAI for a streaming chat completion given the prompt
  // prompt = "hi";
  // console.log("hah")
  // console.log(messages[0]);
  // console.log("here")
  try {
    // Send the request to OpenAI

    const response = await openai.chat.completions.create({
      // model: "gpt-4-vision-preview",
      model: "gpt-4-turbo-2024-04-09",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: messages[0].image,// Assuming `m.image` is the URL of the image
                detail: "high"
              }
              
            }
          ]
        }
      ],
      stream: false,
      max_tokens: 800,
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