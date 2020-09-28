#!/bin/bash

echo "Populating AuthorisedTestingFacilities table with dummy data..."

AWS_PAGER="" aws dynamodb batch-write-item \
  --endpoint-url http://localhost:8000 \
  --request-items file://authorised-testing-facilities-table-data.json
