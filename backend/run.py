#!/usr/bin/env python3
"""
Simple script to run the GreenLens Backend API
"""

import uvicorn
from dotenv import load_dotenv

load_dotenv()


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
    )
