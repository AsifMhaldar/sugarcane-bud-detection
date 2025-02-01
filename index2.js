const form = document.getElementById("upload-form");
const fileInput = document.getElementById("file-input");
const detectedImage = document.getElementById("detected-image");
const inputImage = document.getElementById("input-image"); // Input image container
const info = document.getElementById("info");

// Get Started Button - Scroll to Detection Section and show container2
document.getElementById("get-started-btn").addEventListener("click", function() {
    // Show the second page
    document.querySelector(".container2").classList.add("show");
    
    // Scroll to detection section
    document.getElementById("detection-section").scrollIntoView({ behavior: "smooth" });
});

// Form Submission - Sugarcane Bud Detection
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!fileInput.files[0]) {
    alert("Please select an image file.");
    return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);

  try {
    // RoboFlow API details
    const apiUrl = "https://detect.roboflow.com/sugarcane-eye-detection/2";
    const apiKey = "CgQtn8x36b47vf51Cp9v";

    // Fetch response as JSON to extract bounding boxes
    const response = await fetch(`${apiUrl}?api_key=${apiKey}&format=json`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to process the image.");
    }

    const data = await response.json();
    console.log("Detection Data:", data); // Debugging output

    // Load the uploaded image into the input container
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      // Display the uploaded image in the input-image container
      inputImage.src = img.src;

      // Create a canvas to draw the detected results
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas dimensions same as image
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw bounding boxes for detected buds
      if (data.predictions.length > 0) {
        data.predictions.forEach((pred) => {
          const { x, y, width, height } = pred;

          // Draw a blue bounding box around detected buds
          ctx.strokeStyle = "blue"; // Change to blue box
          ctx.lineWidth = 3;
          ctx.strokeRect(x - width / 2, y - height / 2, width, height);
        });

        info.textContent = "Detection completed. Bud spots are marked.";
      } else {
        info.textContent = "No sugarcane buds detected.";
      }

      // Display the processed image with bounding boxes
      detectedImage.src = canvas.toDataURL();
    };

  } catch (error) {
    console.error("Error:", error);
    info.textContent = "Error detecting buds. Please try again.";
  }
});
