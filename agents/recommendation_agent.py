from mcp import ClientSession

class RecommendationAgent:

    def __init__(self, session):
        self.session = session

    async def recommend(self, keyword):

        result = await self.session.call_tool(
            "search_menu",
            {
                "keyword": keyword
            }
        )

        return result.content