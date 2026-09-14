import os

from dotenv import load_dotenv
from google import genai

load_dotenv()


class SupportAgent:

    def __init__(self, session):
        self.session = session

        self.client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY")
        )

        self.model = os.getenv("GEMINI_MODEL")

    async def handle(self, user_message):

        result = await self.session.call_tool(
            "get_restaurant_info",
            {}
        )

        info = result.content[0].text

        print(info)

        prompt = f"""
You are a helpful restaurant support assistant.

Restaurant Information:
{info}

Answer only using this information.

User Question:
{user_message}
"""

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
        )

        return response.text