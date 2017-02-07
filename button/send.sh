#!/bin/sh

TOKEN="8b38d4d3326b4a74803909f560b150d8"
DID="842f9c4bafc84c8f9bd79f95684aa23f"
MSG="{ \
  \"sdid\": \"${DID}\", \
  \"type\": \"message\", \
  \"data\": \"{ \
    \\\"state\\\": \\\"pressed\\\" \
  }\" \
}"

curl -X POST -H "Content-Type:application/json" \
  -H "Authorization:Bearer $TOKEN" \
  "https://api.artik.cloud/v1.1/messages" \
  -d "$MSG"

