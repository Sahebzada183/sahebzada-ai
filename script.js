
async function generateImages() {
  const prompt = document.getElementById("prompt").value;
  const size = document.getElementById("size").value.split("x");
  const resultDiv = document.getElementById("result");
  const historyDiv = document.getElementById("history");
  const loading = document.getElementById("loading");
  resultDiv.innerHTML = "";
  loading.style.display = "block";

  const n = 4;
  for (let i = 0; i < n; i++) {
    const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width: parseInt(size[0]),
          height: parseInt(size[1])
        }
      })
    });

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    const img = document.createElement("img");
    img.src = imageUrl;

    const downloadLink = document.createElement("a");
    downloadLink.href = imageUrl;
    downloadLink.download = `sahebzada_image_${Date.now()}.png`;
    downloadLink.textContent = "⬇️ Download";
    downloadLink.className = "download-btn";

    const container = document.createElement("div");
    container.appendChild(img);
    container.appendChild(downloadLink);

    resultDiv.appendChild(container);
    historyDiv.appendChild(container.cloneNode(true)); // Add to history too
  }

  loading.style.display = "none";
}

function setLanguage() {
  const lang = document.getElementById("language").value;
  document.getElementById("prompt").placeholder = lang === "ur" ? "تصویر کا تفصیلی بیان لکھیں..." : "Describe your image...";
}
