# Fix MongoDB Atlas DNS Timeout

## Problem
Your DNS server cannot resolve MongoDB Atlas hostnames, causing connection timeouts.

## Quick Solutions

### Option 1: Change DNS to Google DNS (RECOMMENDED)

**Using PowerShell (Run as Administrator):**
```powershell
Get-NetAdapter | Where-Object Status -eq 'Up' | Set-DnsClientServerAddress -ServerAddresses ('8.8.8.8','8.8.4.4')
```

**Or Manually:**
1. Press `Win + R`, type `ncpa.cpl`, press Enter
2. Right-click your active network adapter → Properties
3. Select "Internet Protocol Version 4 (TCP/IPv4)" → Properties
4. Select "Use the following DNS server addresses"
5. Preferred DNS: `8.8.8.8`
6. Alternate DNS: `8.8.4.4`
7. Click OK

**Then flush DNS cache:**
```powershell
ipconfig /flushdns
```

### Option 2: Use Standard Connection String (Not SRV)

1. Go to MongoDB Atlas (https://cloud.mongodb.com)
2. Click "Connect" on your `learnhub` cluster
3. Choose "Connect your application"
4. Select Driver: "Node.js"
5. **Click "Standard connection string" or toggle off SRV**
6. Copy the connection string that looks like:
   ```
   mongodb://username:password@host1:27017,host2:27017,host3:27017/dbname?options
   ```
7. Replace the MONGODB_URI in `.env` with this string

### Option 3: Check Firewall/VPN

- **Disable VPN temporarily** if you're using one
- **Check Windows Firewall** - ensure Node.js is allowed
- **Corporate/School Network** - may block MongoDB Atlas (port 27017)
- **Try mobile hotspot** - to test if it's your network

## After Fixing

Restart your backend server:
```bash
cd backend
npm run dev
```

You should see: `MongoDB Connected: learnhub.huyhy2v.mongodb.net`
