import React, { useState } from "react";

interface FrontendProps {
  lastPrompt?: string;
}

const Frontend: React.FC<FrontendProps> = ({ lastPrompt }) => {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      const response = await fetch("http://localhost:8080/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      // Parse the response JSON
      const responseData = await response.json();

      // Extract image URLs from the response
      const urls = responseData.data.map((image: { url: string }) => image.url);

      // Update state with image URLs
      setImageUrls(urls);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>DALL-E 3 Image Generator</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          name="prompt"
          placeholder="Describe an image..."
          defaultValue={lastPrompt}
          style={{ width: "100%", display: "block", marginBottom: "10px" }}
          onChange={(event) => setPrompt(event.target.value)}
        />
        <button type="submit">Generate Image</button>
      </form>
      {error && <p>{error}</p>}
      {imageUrls && imageUrls.map((url, index) => (
        <img className="w-96 h-96 m-10" key={index} src={url} alt={`Generated Image ${index}`} />
      ))}
      {!imageUrls && <p>Enter a prompt to generate your first image!</p>}
    </div>
  );
};

export default Frontend;
