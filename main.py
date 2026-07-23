import asyncio

from mcp import ClientSession
from mcp.client.stdio import stdio_client, StdioServerParameters

from agents.coordinator import Coordinator


server = StdioServerParameters(
    command=r"D:\Savora\backend\.venv\Scripts\python.exe",
    args=[r"D:\Savora\mcp-server\server.py"],
)


async def main():

    async with stdio_client(server) as (read, write):

        async with ClientSession(read, write) as session:

            await session.initialize()

            tools = await session.list_tools()

            print(tools)

            agent = Coordinator(session)

            while True:

                message = input("You: ")

                response = await agent.route(message)

                print(response)


asyncio.run(main())