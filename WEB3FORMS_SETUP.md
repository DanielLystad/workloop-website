# Web3Forms Setup Instructions

The contact form is now configured to use Web3Forms (free service with 250 submissions/month).

## Get Your Free Access Key

1. Go to https://web3forms.com
2. Sign up with your email (post@workloop.no)
3. Click "Create Access Key"
4. Copy your access key

## Update the Contact Form

1. Open `contact.html`
2. Find this line (around line 147):
   ```html
   <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
   ```
3. Replace `YOUR_ACCESS_KEY_HERE` with your actual Web3Forms access key
4. Save, commit, and push:
   ```bash
   git add contact.html
   git commit -m "Add Web3Forms access key"
   git push origin gh-pages
   ```

## How It Works

- Form submissions go to Web3Forms API
- You receive emails at the address you registered with Web3Forms
- Users see a success message after submitting
- No server needed - works perfectly on GitHub Pages!

## Testing

After adding your key, test the form at http://workloop.no/contact.html
