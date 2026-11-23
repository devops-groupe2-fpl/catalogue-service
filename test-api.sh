#!/bin/bash
BASE_URL="http://localhost:3000"
echo "Testing /health..."; curl -s $BASE_URL/health; echo
echo "Testing /products..."; curl -s $BASE_URL/products | head -c 200; echo
echo "Testing /products/1..."; curl -s $BASE_URL/products/1; echo
echo "Testing /products/999 (404)..."; curl -s -w " HTTP:%{http_code}\n" $BASE_URL/products/999
