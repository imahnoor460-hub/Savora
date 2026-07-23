from mcp import ClientSession
from mcp.client.stdio import stdio_client, StdioServerParameters

server = StdioServerParameters(
    command=r"D:\Savora\backend\.venv\Scripts\python.exe",
    args=[r"D:\Savora\mcp-server\server.py"],
)