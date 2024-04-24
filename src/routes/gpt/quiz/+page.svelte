<script lang="ts">
  import { goto } from "$app/navigation";
  import { writable } from "svelte/store";

  interface FeedbackMessage {
    message: { content: string };
  }

  interface ApiResponse {
    choices: FeedbackMessage[];
  }

  // Using Svelte's store for reactive feedback message
  export const feedbackMessage = writable<string>("");

  // Function to update feedback message
  function updateFeedback(message: string) {
    feedbackMessage.set(message);
  }

  async function sendPostRequest(
    result: string
  ): Promise<ApiResponse | undefined> {
    const url = "http://localhost:5173/gpt/assess";
    const payload = {
      messages: [{ answer: result }],
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return (await response.json()) as ApiResponse;
    } catch (error) {
      console.error("Failed to send POST request:", error);
      updateFeedback("Failed to send request. Please try again.");
    }
  }

  async function handleSubmit(event: Event) {
    event.preventDefault(); // Prevent form from submitting
    const front = (document.getElementById("front") as HTMLInputElement).value;
    const back = (document.getElementById("back") as HTMLInputElement).value;
    const ans = (document.getElementById("answer") as HTMLInputElement).value;

    let detail = { card_front: front, card_back: back, answer: ans };
    let result = JSON.stringify(detail);

    const data = await sendPostRequest(result);
    if (data && data.choices.length > 0) {
      const content = data.choices[0].message.content;
      updateFeedback(content);
      console.log(content);
    } else {
      updateFeedback("No feedback received. Please try again.");
    }
  }

  function back(event: Event) {
    goto("/gpt");
  }
</script>

<button
  on:click={back}
  class="absolute left-80 top-20 btn bg-gray-400 text-white border-gray-200 shadow-xl hover:bg-gray-800"
  >Back</button
>
<div class="absolute left-80 top-60">
  <h1 class="text-3xl">Assessment</h1>
  <form>
    <div>
      <label for="front">front:</label>
      <textarea
        id="front"
        class="input-secondary w-full max-w-xs"
        style="height: 40px; resize: vertical;"
      ></textarea>
    </div>
    <div>
      <label for="back">back:</label>
      <textarea
        id="back"
        class="input-secondary w-full max-w-xs"
        style="height: 40px; resize: vertical;"
      ></textarea>
      <div>
        <label for="answer-check">Your Answer:</label>
        <textarea
          id="answer"
          class="input-secondary w-full max-w-xs"
          style="height: 40px; resize: vertical;"
        ></textarea>
      </div>
      <div>
        <button
          on:click={handleSubmit}
          class="btn bg-blue-400 text-white border-gray-200 shadow-xl hover:bg-blue-800"
          >assess</button
        >
      </div>
    </div>
  </form>
  <div>
    <p id="feedback">{$feedbackMessage}</p>
  </div>
</div>

<style>
  .input-secondary {
    border: 1px solid black;
    color: black;
  }
</style>
