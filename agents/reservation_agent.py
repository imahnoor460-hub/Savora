class RecommendationAgent:

    def __init__(self, session):
        self.session = session

    async def recommend(self, keyword):

        result = await self.session.call_tool(
            "search_menu",
            arguments={
                "keyword": keyword
            }
        )

        return result.content