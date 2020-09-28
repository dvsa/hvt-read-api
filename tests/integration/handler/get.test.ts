import type {
  APIGatewayProxyEvent, APIGatewayProxyResult, Context, APIGatewayEventRequestContext,
} from 'aws-lambda';
import { v4 } from 'uuid';
import { handler } from '../../../src/handler/get';
import * as dynamoHelper from '../test-helpers/dynamo.helper';

const TEST_TABLE = 'TEST_TABLE_GET';

const EXPECTED1 = { id: 'test-id-1', attr1: 'test-attr-1' };
const EXPECTED2 = { id: 'test-id-2', attr1: 'test-attr-2' };
const EXPECTED3 = { id: 'test-id-3', attr1: 'test-attr-3' };

describe('Get Lambda Function', () => {
  test('should return 200 with item when provided id', async () => {
    const pathParameters: Record<string, string> = { table: TEST_TABLE, id: EXPECTED1.id };
    const queryStringParameters: Record<string, string> = { keyName: 'id' };
    const requestContext: APIGatewayEventRequestContext = <APIGatewayEventRequestContext> { requestId: v4() };
    const headers: Record<string, string> = {};
    const eventMock: APIGatewayProxyEvent = <APIGatewayProxyEvent> {
      pathParameters,
      queryStringParameters,
      requestContext,
      headers,
    };
    const contextMock: Context = <Context> { awsRequestId: v4() };

    const res: APIGatewayProxyResult = await handler(eventMock, contextMock);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual(EXPECTED1);
  });

  test('should throw error when no keyName provided', async () => {
    const pathParameters: Record<string, string> = { table: TEST_TABLE, id: EXPECTED1.id };
    const queryStringParameters: Record<string, string> = {};
    const requestContext: APIGatewayEventRequestContext = <APIGatewayEventRequestContext> { requestId: v4() };
    const headers: Record<string, string> = {};
    const eventMock: APIGatewayProxyEvent = <APIGatewayProxyEvent> {
      pathParameters,
      queryStringParameters,
      requestContext,
      headers,
    };
    const contextMock: Context = <Context> { awsRequestId: v4() };

    await expect(handler(eventMock, contextMock)).rejects.toThrow(
      'One of the required keys was not given a value',
    );
  });

  beforeAll(async () => {
    const params: Record<string, unknown> = dynamoHelper.getCreateTableParams('id', TEST_TABLE);
    await dynamoHelper.createTable(params);
  });

  beforeEach(async () => {
    const deleteParams: Record<string, unknown> = dynamoHelper.getDeleteTableParams(TEST_TABLE);
    await dynamoHelper.deleteTable(deleteParams);

    const createParams: Record<string, unknown> = dynamoHelper.getCreateTableParams('id', TEST_TABLE);
    await dynamoHelper.createTable(createParams);

    await dynamoHelper.put(EXPECTED1, TEST_TABLE);
    await dynamoHelper.put(EXPECTED2, TEST_TABLE);
    await dynamoHelper.put(EXPECTED3, TEST_TABLE);
  });

  afterAll(async () => {
    const deleteParams: Record<string, unknown> = dynamoHelper.getDeleteTableParams(TEST_TABLE);
    await dynamoHelper.deleteTable(deleteParams);
  });
});
