#!/bin/bash

echo "Creating AuthorisedTestingFacilities table..."

AWS_PAGER="" aws dynamodb create-table \
  --region local \
  --endpoint-url http://localhost:8000 \
  --table-name AuthorisedTestingFacilities \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1
