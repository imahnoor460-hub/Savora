from mcp import ClientSession

class MenuAgent:
    def __init__(self, session: ClientSession):
        self.session = session

    async def handle(self, message: str):
        message = message.lower()

        if "search" in message or "pizza" in message or "burger" in message:
            keyword = message.split()[-1]

            result = await self.session.call_tool(
                "search_menu",
                arguments={}
            )

            return result.content

        result = await self.session.call_tool(
            "get_menu",
            arguments={}
        )

        return result.content