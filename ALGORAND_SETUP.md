# Algorand SDK Setup ⚡

## Current Status

✅ **Algorand SDK is now integrated!**

The project supports **two modes**:

### 1. Demo Mode (Default)
- Works immediately without setup
- Uses mock wallet and transactions
- Perfect for testing UI/UX
- Data stored in localStorage

### 2. Real Algorand Mode
- Requires Pera Wallet mobile app
- Real blockchain transactions on TestNet
- Actual ALGO transfers
- Transaction confirmations

## How It Works

The app **automatically detects** which mode to use:

```javascript
// If SDK scripts are loaded → Real Algorand
// If SDK scripts missing → Demo mode
```

## Quick Start (Demo Mode)

**Already working!** Just open `index.html` and:
1. Click "Connect Wallet" → Auto-generates mock wallet
2. Create profile
3. Send tips (simulated)

## Upgrade to Real Algorand (5 steps)

### Step 1: Install Pera Wallet
- Download from App Store or Google Play
- Create a new wallet
- **Save your recovery phrase!**

### Step 2: Get TestNet ALGO
1. Copy your wallet address from Pera Wallet
2. Visit: https://bank.testnet.algorand.network/
3. Paste address and click "Dispense"
4. Receive 10 free TestNet ALGO

### Step 3: Verify SDK Scripts
Check that `index.html` includes:
```html
<script src="https://unpkg.com/algosdk@2.7.0/dist/browser/algosdk.min.js"></script>
<script src="https://unpkg.com/@perawallet/connect@1.3.4/dist/index.min.js"></script>
```

✅ Already added!

### Step 4: Connect Real Wallet
1. Open the app in your browser
2. Click "Connect Wallet"
3. Scan QR code with Pera Wallet
4. Approve connection

### Step 5: Send Real Tips!
- Browse creators
- Click tip amount
- Approve transaction in Pera Wallet
- Wait for confirmation (~4 seconds)

## Verification

Check console for:
```
✓ Algorand SDK initialized
✓ Pera Wallet initialized
✓ Using real Algorand SDK
```

## Transaction Flow

### Real Mode:
```
User clicks tip
  ↓
Create payment transaction
  ↓
Sign with Pera Wallet
  ↓
Send to Algorand TestNet
  ↓
Wait for confirmation
  ↓
Update UI
```

### Demo Mode:
```
User clicks tip
  ↓
Generate mock transaction
  ↓
Store in localStorage
  ↓
Update UI
```

## Network Configuration

Edit `algorand-sdk.js` to change networks:

```javascript
const NETWORK = 'testnet'; // or 'mainnet'
```

**TestNet** (default):
- Free ALGO from dispenser
- Safe for testing
- No real money

**MainNet** (production):
- Real ALGO required
- Real transactions
- Use with caution

## Troubleshooting

**"Pera Wallet not initialized"**
- Check SDK scripts are loaded
- Verify internet connection
- Try refreshing page

**"Transaction failed"**
- Ensure sufficient ALGO balance
- Check you're on TestNet
- Verify recipient address is valid

**QR code won't scan**
- Ensure Pera Wallet is updated
- Try different browser
- Check camera permissions

**Transaction pending forever**
- Network might be congested
- Wait up to 1 minute
- Check AlgoExplorer for status

## Testing Real Transactions

1. **Create two profiles** (use different wallets)
2. **Send tip** from wallet A to creator B
3. **Check AlgoExplorer**: https://testnet.algoexplorer.io/
4. **Verify transaction** appears on blockchain
5. **Check dashboard** shows updated balance

## Cost Estimate

**TestNet**: FREE
- Unlimited transactions
- Free ALGO from dispenser

**MainNet**:
- Transaction fee: ~0.001 ALGO (~$0.0002)
- Minimum balance: 0.1 ALGO
- Very affordable for micropayments!

## Security Notes

✅ **Safe**:
- Private keys never leave Pera Wallet
- Transactions signed on your device
- No keys stored in browser

⚠️ **Important**:
- Never share recovery phrase
- Always verify transaction details
- Start with TestNet
- Use small amounts initially

## Features Enabled

With real Algorand:
- ✅ Actual blockchain transactions
- ✅ Verifiable on AlgoExplorer
- ✅ Real-time confirmations
- ✅ Global payments
- ✅ Low fees (~$0.0002)
- ✅ 4-second finality

## Next Steps

1. ✅ SDK integrated
2. ⏳ Test with Pera Wallet
3. ⏳ Send real TestNet transaction
4. ⏳ Verify on AlgoExplorer
5. ⏳ Deploy to production

## Resources

- **Pera Wallet**: https://perawallet.app/
- **TestNet Dispenser**: https://bank.testnet.algorand.network/
- **AlgoExplorer**: https://testnet.algoexplorer.io/
- **Algorand Docs**: https://developer.algorand.org/

---

**You're ready for real blockchain transactions!** 🚀
