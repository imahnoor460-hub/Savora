from agents.menu_agent import MenuAgent
from agents.reservation_agent import ReservationAgent
from agents.support_agent import SupportAgent
from agents.recommendation_agent import RecommendationAgent


class Coordinator:

    def __init__(self, session):
        self.menu = MenuAgent(session)
        self.reservation = ReservationAgent(session)
        self.support = SupportAgent(session)
        self.recommendation = RecommendationAgent(session)

    async def route(self, user_message):

        text = user_message.lower()

        # Menu
        if "menu" in text:
            return await self.menu.handle(text)

        # Reservation
        elif any(word in text for word in [
            "book",
            "booking",
            "reservation",
            "reserve",
            "table"
        ]):
            return await self.reservation.handle(
                "create",
                {
                    "message": user_message
                }
            )

        # Cancel Reservation
        elif "cancel" in text:
            return await self.reservation.handle(
                "cancel",
                {
                    "message": user_message
                }
            )

        # Recommendation
        elif any(word in text for word in [
            "recommend",
            "suggest",
            "recommendation"
        ]):
            return await self.recommendation.recommend(user_message)

        # Default Support
        else:
            return await self.support.handle(user_message)