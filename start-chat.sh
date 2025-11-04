#!/bin/bash

echo "Starting Chat Server and React Native App..."

echo ""
echo "Starting MongoDB (if not running)..."
echo "Note: Make sure MongoDB is installed and running on your system"

echo ""
echo "Starting Chat Server..."
cd server
npm start &
SERVER_PID=$!

echo ""
echo "Waiting for server to start..."
sleep 3

echo ""
echo "Starting React Native App..."
cd ..
npm start &
APP_PID=$!

echo ""
echo "Both services are starting..."
echo "Chat Server: http://localhost:3001"
echo "React Native App: Check the terminal for Expo URL"
echo ""
echo "Press Ctrl+C to stop both services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping services..."
    kill $SERVER_PID 2>/dev/null
    kill $APP_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
