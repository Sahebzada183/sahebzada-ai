const API_TOKEN = "YOUR_REPLICATE_API_TOKEN"; // Replace with your real token

async function generateImages() {
  const prompt = document.getElementById("prompt").value;
  const size = document.getElementById("size").value;
  const loader = document.getElementById("loader");
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";
  loader.style.display = "block";

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "db21e45a3f27b83b34f8fd0c5f10cb2c68c30ab93942eea8994c602edb9f99c3", // Stable Diffusion
        input: {
          prompt: prompt,
          num_outputs: 4,
          width: parseInt(size.split("x")[0]),
          height: parseInt(size.split("x")[1])
        }
      })
    });

    const prediction = await response.json();

    let getResult;
    do {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const poll = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { "Authorization": `Token ${API_TOKEN}` }
      });
      getResult = await poll.json();
    } while (getResult.status !== "succeeded");

    loader.style.display = "none";
    getResult.output.forEach(url => {
      const img = document.createElement("img");
      img.src = url;
      gallery.appendChild(img);
    });

  } catch (err) {
    loader.innerText = "Error generating image. Check your API key.";
    console.error(err);
  }
}
