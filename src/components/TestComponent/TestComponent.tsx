import { useEffect, useRef } from "react";

export const TestComponent = () => {
  const isActive = useRef(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        isActive.current = true;
        const response = await fetch(
          "http://localhost:4000/v1/create-message",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              conversationId: "17",
              userQuery: "Hello",
            }),
          }
        );

        if (!response.ok || !response.body) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const reader = response.body.getReader();

        const decoder = new TextDecoder("utf-8");
        let done = false;

        while (!done) {
          const { value, done: isDone } = await reader.read();
          done = isDone;

          if (value) {
            // Decode the stream chunk and process the data
            const [, ...messageChunks] = decoder
              .decode(value, { stream: true })
              .split("data: ");

            messageChunks.forEach((chunk) => {
              const parsedData = JSON.parse(chunk);
              console.log("Received stream:", parsedData);
            });
          }
        }
        console.log("Stream finished");

        isActive.current = false;
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    if (!isActive.current) {
      fetchMessages();
    }
  }, []);

  return (
    <>
    </>
  );
};
