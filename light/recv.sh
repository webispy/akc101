#!/bin/sh

TOKEN="bf946bc4366d4ef98ed18d089673cbe5"
DID="b809f9e73ebb4a5ab022233253398199"

END=$(($(date +"%s") * 1000))
START=$(($END - 24 * 3600 * 1000))
PARAM="count=1&endDate=$END&startDate=$START&order=desc&ddid=$DID"

curl -X GET -H "Content-Type:application/json" \
  -H "Authorization:Bearer $TOKEN" \
  "https://api.artik.cloud/v1.1/actions?$PARAM"

