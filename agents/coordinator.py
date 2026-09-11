from agents.menu_agent import MenuAgent
from agents.reservation_agent import ReservationAgent
from agents.recommendation_agent import RecommendationAgent
from agents.support_agent import SupportAgent


class Coordinator:

    def __init__(self, session):
        self.menu = MenuAgent(session)
        self.reservation = ReservationAgent(session)
        self.recommendation = RecommendationAgent(session)
        self.support = SupportAgent(session)

    async def route(self, user_message):

        text = user_message.lower()

        # Menu
        if "menu" in text:
            return await self.menu.handle(text)

        # Cancel Reservation (CHECK FIRST)
        elif "cancel" in text:
            print("Action: CANCEL")
            return await self.reservation.handle(
                "cancel",
                {
                    "message": user_message
                }
            )

        # Update Reservation
        elif any(word in text for word in [
            "update",
            "change",
            "modify",
            "edit"
        ]):
            print("Action: UPDATE")
            return await self.reservation.handle(
                "update",
                {
                    "message": user_message
                }
            )

        # Create Reservation
        elif any(word in text for word in [
            "book",
            "booking",
            "reservation",
            "reserve",
            "table"
        ]):
            print("Action: CREATE")
            return await self.reservation.handle(
                "create",
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