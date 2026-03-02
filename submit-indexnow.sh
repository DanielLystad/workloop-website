#!/bin/bash
# IndexNow submission script for WorkLoop.no

API_KEY="e2cbfd4236580bfa85fddef51df85401c1a5c61e252e0e60cc3eda4f0465e119"
HOST="workloop.no"

# Submit all pages to IndexNow
curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d '{
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

echo ""
echo "✅ Submitted all pages to IndexNow"
echo "Search engines (Bing, Yandex, etc.) will be notified of these URLs"
