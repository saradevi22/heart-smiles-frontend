# Troubleshooting Network Errors

## Backend Status Check
Run this command to verify the backend is running:
```bash
curl http://localhost:5001/api/health
```

Expected response: `{"status":"OK","message":"HeartSmiles Backend API is running"...}`

## Restart Backend
If the backend is not responding:
```bash
cd backend
npm run dev
```

## Restart Frontend
If you need to restart the frontend:
```bash
# Stop the current frontend (Ctrl+C in the terminal running it)
# Then restart:
npm start
```

## Common Issues

### Network Error: Cannot reach server
- **Solution 1**: Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
- **Solution 2**: Check if backend is running on port 5001
- **Solution 3**: Verify no firewall is blocking localhost:5001
- **Solution 4**: Clear browser cache and reload

### Port Already in Use
If you see `EADDRINUSE` error:
```bash
# Kill processes on port 5001
lsof -ti:5001 | xargs kill -9

# Or kill all node processes (be careful!)
pkill -f "node.*server.js"
```

### CORS Errors
The backend is configured to allow requests from:
- http://localhost:3000
- http://localhost:3002

Make sure your frontend is running on one of these ports.

