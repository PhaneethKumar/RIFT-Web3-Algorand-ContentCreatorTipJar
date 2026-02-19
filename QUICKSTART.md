# Quick Start Guide 🚀

Get your Content Creator Tip Jar running in 5 minutes!

## Option 1: Simple Start (No Installation)

1. **Open the project**
   - Double-click `index.html`
   - Your browser will open the application

2. **Connect a wallet**
   - Click "Connect Wallet" button
   - A demo wallet will be created automatically

3. **Create your profile**
   - Click "Become a Creator"
   - Fill in your details
   - Submit the form

4. **Start receiving tips!**
   - Share your profile URL
   - Test tipping yourself

## Option 2: Local Server (Recommended)

### Using Python (if installed)
```bash
# Navigate to project folder
cd "Content Creator Tip Jar"

# Start server
python -m http.server 8000

# Open browser to http://localhost:8000
```

### Using Node.js (if installed)
```bash
# Navigate to project folder
cd "Content Creator Tip Jar"

# Install dependencies (first time only)
npm install

# Start server
npm start

# Browser opens automatically
```

## Testing the Application

### Create Multiple Test Creators

1. **First Creator**
   - Connect wallet (generates Wallet A)
   - Create profile as "Artist"
   - Note the profile URL

2. **Second Creator**
   - Clear browser data or use incognito
   - Connect wallet (generates Wallet B)
   - Create profile as "Musician"

3. **Test Tipping**
   - Visit first creator's profile
   - Send a tip
   - Check dashboard to see earnings

### Sample Test Data

Create profiles with these examples:

**Artist Profile**
- Name: Alex Artist
- Category: Artist
- Bio: Digital artist creating vibrant illustrations and concept art
- Avatar: https://via.placeholder.com/150/667eea/ffffff?text=AA
- Portfolio:
  ```
  https://via.placeholder.com/400/667eea/ffffff?text=Art+1
  https://via.placeholder.com/400/764ba2/ffffff?text=Art+2
  https://via.placeholder.com/400/f093fb/ffffff?text=Art+3
  ```

**Musician Profile**
- Name: Sam Sounds
- Category: Musician
- Bio: Indie musician and producer crafting unique soundscapes
- Avatar: https://via.placeholder.com/150/764ba2/ffffff?text=SS
- Portfolio:
  ```
  https://via.placeholder.com/400/764ba2/ffffff?text=Album+1
  https://via.placeholder.com/400/667eea/ffffff?text=Album+2
  ```

**Photographer Profile**
- Name: Pat Photos
- Category: Photographer
- Bio: Landscape and portrait photographer capturing life's moments
- Avatar: https://via.placeholder.com/150/f093fb/ffffff?text=PP
- Portfolio:
  ```
  https://via.placeholder.com/400/f093fb/ffffff?text=Photo+1
  https://via.placeholder.com/400/4facfe/ffffff?text=Photo+2
  https://via.placeholder.com/400/00f2fe/ffffff?text=Photo+3
  https://via.placeholder.com/400/43e97b/ffffff?text=Photo+4
  ```

## Embedding the Widget

1. **Get embed code**
   - Go to your dashboard
   - Copy the embed code

2. **Add to your website**
   ```html
   <!-- Paste this in your HTML -->
   <iframe src="http://localhost:8000/widget.html?creator=YOUR_WALLET_ADDRESS" 
           width="320" 
           height="400" 
           frameborder="0" 
           style="border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
   </iframe>
   ```

3. **Test the widget**
   - Create a test HTML file
   - Paste the embed code
   - Open in browser

## Upgrading to Real Algorand

### Step 1: Install Algorand SDK

```bash
npm install algosdk @perawallet/connect
```

### Step 2: Get TestNet ALGO

1. Install Pera Wallet mobile app
2. Create a wallet
3. Visit https://bank.testnet.algorand.network/
4. Enter your address
5. Receive free TestNet ALGO

### Step 3: Update Code

Replace the mock wallet connection in `app.js`:

```javascript
import { PeraWalletConnect } from "@perawallet/connect";

const peraWallet = new PeraWalletConnect();

async function connectWallet() {
    try {
        const accounts = await peraWallet.connect();
        connectedWallet = accounts[0];
        updateWalletUI();
    } catch (error) {
        console.error('Connection error:', error);
    }
}
```

### Step 4: Implement Real Transactions

Update `sendTip` function in `app.js`:

```javascript
async function sendTip(recipientAddress, amount) {
    const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
    const params = await algodClient.getTransactionParams().do();
    
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: connectedWallet,
        to: recipientAddress,
        amount: amount * 1000000,
        note: new Uint8Array(Buffer.from('Tip from Creator Tip Jar')),
        suggestedParams: params
    });
    
    const signedTxn = await peraWallet.signTransaction([[{ txn }]]);
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    
    await algosdk.waitForConfirmation(algodClient, txId, 4);
    return { txId, amount };
}
```

## Troubleshooting

### Browser shows blank page
- Check browser console (F12) for errors
- Ensure all files are in the same folder
- Try a different browser

### Wallet won't connect
- For demo mode, it auto-generates
- For real mode, install Pera Wallet
- Check browser console for errors

### Tips not showing
- Check browser localStorage is enabled
- Try clearing cache and reloading
- Verify wallet addresses match

### Widget not loading
- Check the creator wallet address in URL
- Ensure widget.html is accessible
- Check browser console for CORS errors

## Next Steps

1. ✅ Test all features locally
2. ✅ Customize the design
3. ✅ Add your own branding
4. ✅ Integrate real Algorand
5. ✅ Deploy to web hosting
6. ✅ Share with creators!

## Learning Challenges

Try these to enhance your skills:

1. **Add a search feature** to find creators by name
2. **Implement categories filter** with icons
3. **Create a "trending" section** for popular creators
4. **Add dark mode** toggle
5. **Build a mobile-responsive menu**
6. **Add animation effects** for tips
7. **Create achievement badges** for supporters
8. **Implement tip goals** for creators
9. **Add social sharing** buttons
10. **Build an admin panel** for moderation

## Resources

- 📚 [Algorand Developer Docs](https://developer.algorand.org/)
- 🎥 [Algorand YouTube Tutorials](https://www.youtube.com/c/Algorand)
- 💬 [Algorand Discord Community](https://discord.gg/algorand)
- 🐦 [Algorand Twitter](https://twitter.com/algorand)

## Need Help?

- Check the main README.md
- Review code comments
- Search Algorand documentation
- Experiment and learn by doing!

---

**Happy Building! 🎉**
