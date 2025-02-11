const promptInput = document.getElementById("prompt");
const generateButton = document.getElementById("generate");
const downloadButton = document.getElementById("download");
generateButton.classList.add("button_form");
downloadButton.classList.add("button_form");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const loader = document.querySelector(".tempo_loader_box");
const initialMessage = "This area displays the generated image.";

let generatedImageUrl = null; // To store the image URL for downloading
let image = new Image(); // Image object to hold the generated image
let zoomLevel = 1; // Default zoom level
let isPanning = false; // To track if the user is panning
let panStartX = 0; // Starting X position for panning
let panStartY = 0; // Starting Y position for panning
let offsetX = 0; // Image offset on X
let offsetY = 0; // Image offset on Y
let canvasActive = false; // To track if canvas is active (interactive)

// Array of API keys
const apiKeys = [
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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"
];

// Function to get a random API key
function getRandomApiKey() {
  const randomIndex = Math.floor(Math.random() * apiKeys.length);
  return apiKeys[randomIndex];
}

// Function to generate a random 29-character file name with hyphens every 5 characters
function generateRandomFileName() {
  const chars = 'abcde0123456789';
  let result = '';
  for (let i = 0; i < 29; i++) {
    if (i > 0 && i % 5 === 0) {
      result += '-'; // Add a hyphen every 5 characters
    }
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result + '.png';
}

// Function to display text on the canvas with word wrapping
function displayCanvasMessage(message) {
  context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  const maxWidth = canvas.width - 100; // Padding inside the canvas
  const lineHeight = 0; // Line height for text
  const x = canvas.width / 2;
  let y = canvas.height / 2 - lineHeight;

  // Set font and text properties
  context.font = "16px Arial";
  context.fillStyle = "#ffffff";
  context.textAlign = "center";

  // Split the message into lines that fit within the canvas width
  const words = message.split(" ");
  let line = "";

  words.forEach((word, index) => {
    const testLine = line + word + " ";
    const testWidth = context.measureText(testLine).width;

    if (testWidth > maxWidth && index > 0) {
      context.fillText(line.trim(), x, y);
      line = word + " ";
      y += lineHeight; // Move to the next line
    } else {
      line = testLine;
    }
  });

  // Draw the last line
  context.fillText(line.trim(), x, y);
}

// Initial message on the canvas
displayCanvasMessage(initialMessage);

// Enable/disable buttons based on input validation
function updateButtonState() {
  generateButton.disabled = !(promptInput.value.trim());
}

promptInput.addEventListener("input", updateButtonState);

// Function to query the Hugging Face API
async function query(data) {
  const apiKey = getRandomApiKey(); // Get a random API key
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      console.error("Error: " + response.statusText);
      throw new Error("API Error");
    }

    console.log("API Response received!");
    return await response.blob();
  } catch (error) {
    console.error("Error occurred during the API call:", error);
    throw error;
  }
}

// Disable canvas interactions and prompt input
function disableInteractions() {
  canvasActive = false;
  canvas.style.pointerEvents = "none"; // Disable pointer events
  promptInput.disabled = true; // Disable the prompt input
}

// Enable canvas interactions and prompt input
function enableInteractions() {
  canvasActive = true;
  canvas.style.pointerEvents = "auto"; // Enable pointer events
  promptInput.disabled = false; // Enable the prompt input
}

// Generate button click event
generateButton.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();

  if (!prompt) return; // Just a safeguard, button is disabled if inputs are invalid

  // Disable interactions while generating
  disableInteractions();

  // Show the loader and hide the initial message
  loader.style.visibility = "visible";
  displayCanvasMessage("");
  generateButton.disabled = true; // Disable the generate button during generation
  downloadButton.disabled = true; // Disable the download button during generation

  try {
    console.log("Starting image generation...");
    const imageBlob = await query({ inputs: prompt });

    // Clear the canvas and draw the generated image
    image.onload = () => {
      const scale = Math.min(canvas.width / image.width, canvas.height / image.height);
      const x = (canvas.width - image.width * scale) / 2;
      const y = (canvas.height - image.height * scale) / 2;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, x, y, image.width * scale, image.height * scale);

      console.log("Image generated and drawn to canvas.");
      enableInteractions(); // Re-enable interactions

      promptInput.value = ""; // Clear the input AFTER the image is loaded
      updateButtonState(); // Update button state AFTER clearing the input
    };

    generatedImageUrl = URL.createObjectURL(imageBlob);
    image.src = generatedImageUrl;
    downloadButton.disabled = false;

    // Clear the prompt input field only if image generation is successful
    if (generatedImageUrl) {
      promptInput.value = "";
    }
    updateButtonState(); // Re-check the button state
  } catch (error) {
    console.error("Error generating image:", error);
    displayCanvasMessage("An error occurred, try again.");
    enableInteractions(); // Re-enable interactions on error
  } finally {
    generateButton.disabled = false; // Re-enable the generate button
    loader.style.visibility = "hidden"; // Hide the loader after completion or error
  }
});

// Download button click event
downloadButton.addEventListener("click", () => {
  if (generatedImageUrl) {
    const link = document.createElement("a");
    link.href = generatedImageUrl;
    link.download = generateRandomFileName();
    link.click();
  }
});

// Zoom function (scroll to zoom)
canvas.addEventListener("wheel", (event) => {
  if (!canvasActive) return; // Prevent zooming if canvas is inactive
  event.preventDefault();
  if (event.deltaY < 0) {
    zoomLevel *= 1.1; // Zoom in
  } else {
    zoomLevel /= 1.1; // Zoom out
  }

  // Ensure the image is scaled based on the zoom level
  const scale = Math.min(canvas.width / image.width, canvas.height / image.height) * zoomLevel;
  const x = (canvas.width - image.width * scale) / 2 + offsetX;
  const y = (canvas.height - image.height * scale) / 2 + offsetY;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, x, y, image.width * scale, image.height * scale);
});

// Pan the image with mouse drag
canvas.addEventListener("mousedown", (event) => {
  if (!canvasActive || event.button !== 0) return; // Prevent panning if canvas is inactive
  isPanning = true;
  panStartX = event.clientX;
  panStartY = event.clientY;
  canvas.style.cursor = "grabbing"; // Change cursor to grabbing
});

canvas.addEventListener("mousemove", (event) => {
  if (!canvasActive || !isPanning) return; // Prevent panning if canvas is inactive
  const dx = event.clientX - panStartX;
  const dy = event.clientY - panStartY;
  offsetX += dx;
  offsetY += dy;
  panStartX = event.clientX;
  panStartY = event.clientY;

  // Re-draw the image with the updated offset
  const scale = Math.min(canvas.width / image.width, canvas.height / image.height) * zoomLevel;
  const x = (canvas.width - image.width * scale) / 2 + offsetX;
  const y = (canvas.height - image.height * scale) / 2 + offsetY;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, x, y, image.width * scale, image.height * scale);
});

canvas.addEventListener("mouseup", () => {
  isPanning = false;
  canvas.style.cursor = "grab"; // Reset cursor to grab
});

canvas.addEventListener("mouseleave", () => {
  isPanning = false;
  canvas.style.cursor = "grab"; // Reset cursor to grab
});
