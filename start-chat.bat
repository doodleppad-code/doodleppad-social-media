@echo off
echo Starting Chat Server and React Native App...

echo.
echo Starting MongoDB (if not running)...
echo Note: Make sure MongoDB is installed and running on your system

echo.
echo Starting Chat Server...
cd server
start "Chat Server" cmd /k "npm start"

echo.
echo Waiting for server to start...
timeout /t 3 /nobreak > nul

echo.
echo Starting React Native App...
cd ..
start "React Native App" cmd /k "npm start"

echo.
echo Both services are starting...
echo Chat Server: http://localhost:3001
echo React Native App: Check the terminal for Expo URL
echo.
pause
