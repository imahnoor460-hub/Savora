from mcp.server.fastmcp import FastMCP
import requests

# MCP Server
mcp = FastMCP("Restaurant MCP")

# Django Backend URL
BASE_URL = "http://127.0.0.1:8000"


@mcp.tool()
def get_home_info():
    """
    Get home page data.
    """
    try:
        response = requests.get(f"{BASE_URL}/home/")
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": str(e)}


@mcp.tool()
def get_menu():
    print("get_menu tool called")
    """
    Fetch all menu items from the Django backend.
    """
    try:
        response = requests.get(f"{BASE_URL}/menu/")
        response.raise_for_status()
        return response.json()

    except Exception as e:
        return {"error": str(e)}


@mcp.tool()
def search_menu(keyword: str):
    """
    Search menu items by keyword.
    """
    try:
        response = requests.get(f"{BASE_URL}/menu/")
        response.raise_for_status()

        items = response.json()

        result = []

        for item in items:
            if (
                keyword.lower() in item["name"].lower()
                or keyword.lower() in item["description"].lower()
            ):
                result.append(item)

        return result

    except Exception as e:
        return {"error": str(e)}


@mcp.tool()
def create_reservation(
    name: str,
    email: str,
    phone: str,
    date: str,
    time: str,
    guests: int,
):
    
    """
    Create a restaurant reservation.

    IMPORTANT:
    - Do not use remembered user information.
    - Ask the user for:
      * name
      * email
      * phone
      * date
      * time
      * guests
    before calling this tool.
    """

    data = {
        "name": name,
        "email": email,
        "phone": phone,
        "date": date,
        "time": time,
        "guests": guests,
    }

    try:
        print("Sending:", data)

        response = requests.post(
            f"{BASE_URL}/reservation/",
            json=data,
        )
        print("Status Code:", response.status_code)
        print("Response:", response.text)

        response.raise_for_status()

        return response.json()

    except Exception as e:
        print("ERROR:", e)
        return {"error": str(e)}

@mcp.tool()
def cancel_reservation(name: str, phone: str):

    response = requests.get(f"{BASE_URL}/reservation/")
    print("GET Status:", response.status_code)

    reservations = response.json()
    print("Reservations:", reservations)

    reservation_id = None

    for reservation in reservations:
        print(reservation)

        if (
            reservation["name"].lower() == name.lower()
            and reservation["phone"] == phone
        ):
            reservation_id = reservation["id"]
            break

    print("Matched ID:", reservation_id)

    if reservation_id is None:
        return {"error": "Reservation not found"}

    delete_response = requests.delete(
        f"{BASE_URL}/reservation/{reservation_id}/"
    )

    print("DELETE Status:", delete_response.status_code)
    print("DELETE Response:", delete_response.text)

    return {"message": "Reservation cancelled successfully"}

    

    
@mcp.tool()
def update_reservation(
    reservation_id: int,
    date: str,
    time: str,
    guests: int,
):
    """
    Update an existing reservation.
    """

    data = {
        "date": date,
        "time": time,
        "guests": guests,
    }

    try:
        response = requests.patch(
            f"{BASE_URL}/reservation/{reservation_id}/",
            json=data,
        )

        response.raise_for_status()

        return response.json()

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    mcp.run()