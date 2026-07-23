import os
import json

from dotenv import load_dotenv
from google import genai

load_dotenv()


class ReservationAgent:

    def __init__(self, session):
        self.session = session

        api_key = os.getenv("GEMINI_API_KEY")
        model = os.getenv("GEMINI_MODEL")

        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in .env")

        self.model = model
        self.client = genai.Client(api_key=api_key)

    async def handle(self, action, data):

        if action != "create":
            return "Done"

        message = data["message"]

        prompt = f"""
You are a restaurant reservation assistant.

Extract reservation details from the user's message.

IMPORTANT RULES:
- Return ONLY valid JSON.
- Do NOT add markdown.
- Do NOT explain anything.
- Date must be in YYYY-MM-DD format.
- Time must be in HH:MM:SS (24-hour) format.
- Guests must be an integer.
- If special_request is not mentioned, return an empty string.

Example:

User:
Book a table for Ali, 2 guests, 25-07-2026, 9pm, ali@gmail.com, 03001234567

Output:
{{
    "name": "Ali",
    "email": "ali@gmail.com",
    "phone": "03001234567",
    "date": "2026-07-25",
    "time": "21:00:00",
    "guests": 2,
    "special_request": ""
}}

User Message:
{message}
"""

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
        )

        try:
            details = json.loads(response.text)
        except json.JSONDecodeError:
            return (
                "Gemini did not return valid JSON.\n\n"
                + response.text
            )

        print("\nExtracted Details:")
        print(details)

        result = await self.session.call_tool(
            "create_reservation",
            arguments=details
        )

        return result.content