export async function generatePhishingEmail(metadata) {
    const weaknesses = metadata.weaknesses.join(", ") || "General cybersecurity";
  
    const prompt = `
      You are creating a phishing email training exercise for an employee.
      Employee details:
      - Name: ${metadata.name}
      - Weaknesses: ${weaknesses}
      - Training Level: ${metadata.progressLevel}
  
      Please generate the following:
      1. A realistic phishing email based on the weaknesses above.
      2. A section titled "Phishing Indicator:" containing a multiple-choice question and three answer options.
      3. Include the correct answer explicitly labeled as "Correct Answer:".
  
      The response must follow this format:
      Email Subject: [Phishing email subject]
  
      [Phishing email content]
  
      Phishing Indicator:
      [Multiple-choice question]
      A) [Option 1]
      B) [Option 2]
      C) [Option 3]
  
      Correct Answer: [Correct answer, e.g., A) [Option 1]]
    `;
  
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer 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`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [{ role: "system", content: prompt }],
        }),
      });
  
      const data = await response.json();
      console.log("OpenAI API Full Response:", data);
  
      if (!data || !data.choices || !data.choices[0]?.message?.content) {
        throw new Error("Invalid API response structure");
      }
  
      const responseContent = data.choices[0].message.content;
      console.log("Generated Response Content:", responseContent);
  
      // Parse the response content for email, options, and the correct answer
      const emailMatch = responseContent.match(/Email Subject:([\s\S]*?)Phishing Indicator:/);
      const indicatorMatch = responseContent.match(/Phishing Indicator:([\s\S]*?)Correct Answer:/);
      const correctAnswerMatch = responseContent.match(/Correct Answer:\s*(.*)/);
  
      if (!emailMatch || !indicatorMatch || !correctAnswerMatch) {
        throw new Error("Response content does not match expected format");
      }
  
      const emailContent = emailMatch[1].trim();
      const optionsString = indicatorMatch[1].trim();
      const correctAnswer = correctAnswerMatch[1].trim();
  
      // Parse options into an array
      const options = optionsString.split("\n").map((line) => line.trim());
  
      if (options.length < 3) {
        throw new Error("Not enough options provided in the response");
      }
  
      return { email: emailContent, options, correctResponse: correctAnswer };
    } catch (error) {
      console.error("Error generating phishing email:", error);
  
      // Return a fallback scenario if API fails
      return {
        email: "This is a sample phishing email used as a fallback.",
        options: [
          "The email asks for sensitive information.",
          "The email has spelling mistakes.",
          "The email is from an unknown sender.",
        ],
        correctResponse: "The email asks for sensitive information.",
      };
    }
  }
  