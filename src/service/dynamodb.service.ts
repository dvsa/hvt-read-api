import { DynamoDB } from 'aws-sdk';
import { AttributeMap, ScanOutput } from 'aws-sdk/clients/dynamodb';

type DynamoKey = {[key: string]: string};

type Item = AttributeMap;

type PagedItems = ScanOutput;

const client = new DynamoDB.DocumentClient({
  endpoint: process.env.DYNAMO_URL,
  region: process.env.DYNAMO_REGION,
});

export const get = async (key: DynamoKey, table: string): Promise<Item> => {
  const params = {
    Key: key,
    TableName: table,
  };

  const data = await client.get(params).promise();
  return data.Item;
};

export const getAll = async (
  table: string, pageSize: number = undefined, lastEvaluatedKey: DynamoKey = undefined): Promise<PagedItems> => {
  const params = {
    TableName: table,
    Limit: pageSize,
    ExclusiveStartKey: lastEvaluatedKey,
  };

  const response = await client.scan(params).promise();

  return response;
};
