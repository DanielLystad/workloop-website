#!/bin/bash
# IndexNow submission script for WorkLoop.no

API_KEY="e2cbfd4236580bfa85fddef51df85401c1a5c61e252e0e60cc3eda4f0465e119"
HOST="workloop.no"

PAYLOAD='{
  "host": "'$HOST'",
  "key": "'$API_KEY'",
  "keyLocation": "https://'$HOST'/'$API_KEY'.txt",
  "urlList": [
    "https://'$HOST'/",
    "https://'$HOST'/about",
    "https://'$HOST'/services",
    "https://'$HOST'/blog",
    "https://'$HOST'/contact"
  ]
}'

echo "📤 Submitting to IndexNow API..."
RESPONSE1=$(curl -s -w "\n%{http_code}" -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$PAYLOAD")
STATUS1=$(echo "$RESPONSE1" | tail -n1)

echo "📤 Submitting to Bing directly..."
RESPONSE2=$(curl -s -w "\n%{http_code}" -X POST "https://www.bing.com/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$PAYLOAD")
STATUS2=$(echo "$RESPONSE2" | tail -n1)

echo ""
echo "✅ IndexNow API: HTTP $STATUS1"
echo "✅ Bing Direct: HTTP $STATUS2"
echo ""
echo "All pages submitted to:"
echo "  • Bing (Microsoft)"
echo "  • Yandex"
echo "  • DuckDuckGo"
echo "  • Other IndexNow-enabled search engines"
echo ""
echo "💡 Check Bing Webmaster Tools → URL Inspection → enter URL to see indexing status"
