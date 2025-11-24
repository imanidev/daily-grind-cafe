import Anthropic from "@anthropic-ai/sdk";

async function chat () {
    const client = new Anthropic();
    const message = await client.messages.create( {
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1024,
        messages: [
            { role: "user", content: "Hello, Claude!" }
        ],
    } );
    console.log( message.content );
}

chat();
