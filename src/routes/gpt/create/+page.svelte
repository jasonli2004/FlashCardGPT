<script lang="ts">
  import { goto } from "$app/navigation";

  function showNoFileSelectedAlert() {
    // Check and remove the old alert if it exists
    const oldAlert = document.getElementById("no_file");
    if (oldAlert) {
      document.body.removeChild(oldAlert);
    }

    // Proceed to create the new alert container
    const alertContainer = document.createElement("div");
    alertContainer.id = "no_file";
    alertContainer.classList.add(
      "alert",
      "alert-warning",
      "shadow-lg",
      "top-0",
      "absolute",
      "items-center",
      "p-4",
      "mb-4"
    );

    // Create the icon container
    const iconContainer = document.createElement("div");
    iconContainer.classList.add("flex-shrink-0", "w-5", "h-5", "mr-3");
    iconContainer.innerHTML = `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>`;

    // Create the message span
    const messageSpan = document.createElement("span");
    messageSpan.textContent =
      "No file selected. Please select a file to upload.";

    // Append the icon and message to the alert container
    alertContainer.appendChild(iconContainer);
    alertContainer.appendChild(messageSpan);

    // Append the new alert container to the body or a specific element
    document.body.appendChild(alertContainer); // This ensures the new alert is always added

    // Optional: Remove the alert after a certain time
    setTimeout(() => {
      if (document.body.contains(alertContainer)) {
        document.body.removeChild(alertContainer);
      }
    }, 5000); // Adjust time as needed
  }

  function showMessage(s: string, id: string) {
    const status_message = document.getElementById(id);
    if (status_message) {
      status_message.innerText = s;
    }
  }

  async function getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  async function sendPostRequest(base64: string) {
    const url = "http://localhost:5173/gpt/demo"; // Adjust the URL as needed
    const payload = {
      messages: [{ image: base64, role: "user" }],
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

      const data = await response.json();
      console.log(data.choices[0].message.content);
      return data;
    } catch (error) {
      console.error("Failed to send POST request:", error);
    }
  }
  async function back(event: Event) {
    goto("/gpt");
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    const input = document.getElementById("note-image") as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      showMessage("generating base64", "status");
      try {
        const base64Image = await getBase64(file);
        const data = await sendPostRequest(base64Image);
        showMessage("generated base64", "status");
        if (
          data.choices &&
          data.choices.length > 0 &&
          data.choices[0].message &&
          typeof data.choices[0].message.content === "string"
        ) {
          // Find the JSON string within the message content
          const content = data.choices[0].message.content;
          const jsonStartIndex = content.indexOf("```json") + 7; // Locate the start of the JSON string
          const jsonEndIndex = content.lastIndexOf("```"); // Locate the end of the JSON string
          // Ensure we're not including the markdown syntax in our JSON string
          const jsonString = content
            .substring(jsonStartIndex, jsonEndIndex)
            .trim();
          console.log(data);
          showMessage(jsonString, "result");
        }
      } catch (error) {
        showMessage("failed to generate flashcards", "status");
        console.error("Failed to convert file");
      }
    } else {
      console.log("No file selected");
      showNoFileSelectedAlert();
    }
  }
</script>

<button
  on:click={back}
  class="absolute left-80 top-20 btn bg-gray-400 text-white border-gray-200 shadow-xl hover:bg-gray-800"
  >Back</button
>
<div class="absolute left-80 top-60">
  <div class="form">
    <form id="note-upload-form" on:submit={handleSubmit}>
      <label for="file-upload">Select a file:</label>
      <input type="file" id="note-image" accept="image/*" />
      <p id="status" class="text-blue-400"></p>
      <p id="result"></p>
      <button
        type="submit"
        class="btn bg-green-400 text-white border-gray-200 shadow-xl hover:bg-green-800"
        >Upload</button
      >
    </form>
  </div>
</div>
