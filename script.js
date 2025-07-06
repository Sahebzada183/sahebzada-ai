async function generateImage() {
  const prompt = document.getElementById("promptInput").value;
  const size = document.getElementById("sizeSelect").value;
  const imageGrid = document.getElementById("imageGrid");

  imageGrid.innerHTML = "<p>⏳ Generating images...</p>";

  const [width, height] = size.split("x");

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": "Token YOUR_REPLICATE_API_TOKEN_HERE",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      version: "a9758cb3c2c0512a82cd55df4b30524557c4a5455a2e1422433e6d8e5f38ca33",
      input: {
        prompt: prompt,
        width: parseInt(width),
        height: parseInt(height),
        num_outputs: 4
      }
    })
  });

  const result = await response.json();

  if (result && result.urls && result.urls.get) {
    const finalResponse = await fetch(result.urls.get);
    const finalResult = await finalResponse.json();

    imageGrid.innerHTML = "";
    finalResult.output.forEach(imgUrl => {
      const img = document.createElement("img");
      img.src = imgUrl;
      imageGrid.appendChild(img);
    });
  } else {
    imageGrid.innerHTML = "<p>❌ Failed to generate images.</p>";
  }
}
