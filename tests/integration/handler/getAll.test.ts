/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type {
  APIGatewayProxyEvent, APIGatewayProxyResult, Context, APIGatewayEventRequestContext,
} from 'aws-lambda';
import { v4 } from 'uuid';
import { handler } from '../../../src/handler/dbGetAll';
import * as dynamoHelper from '../test-helpers/dynamo.helper';

const TEST_TABLE = 'TEST_TABLE_GETALL';

const EXPECTED1 = { id: 'test-id-1', attr1: 'test-attr-1' };
const EXPECTED2 = { id: 'test-id-2', attr1: 'test-attr-2' };
const EXPECTED3 = { id: 'test-id-3', attr1: 'test-attr-3' };

describe('Get All Lambda Function', () => {
  test('should return 200 with all items when just table path param', async () => {
    const pathParameters: Record<string, string> = { table: TEST_TABLE };
    const requestContext: APIGatewayEventRequestContext = <APIGatewayEventRequestContext> { requestId: v4() };
    const headers: Record<string, string> = {};
    const eventMock: APIGatewayProxyEvent = <APIGatewayProxyEvent> {
      pathParameters,
      requestContext,
      headers,
    };
    const contextMock: Context = <Context> { awsRequestId: v4() };

    const res: APIGatewayProxyResult = await handler(eventMock, contextMock);
    const body = JSON.parse(res.body);
    const items = body.Items as any[];

    expect(res.statusCode).toBe(200);
    expect(items.length).toBe(3);
    items.forEach((item) => {
      expect([EXPECTED1, EXPECTED2, EXPECTED3]).toContainEqual(item);
    });
  });

  test('should return 200 with 2 items when provided table path param and pageSize query param', async () => {
    const pathParameters: Record<string, string> = { table: TEST_TABLE };
    const queryStringParameters: Record<string, string> = { pageSize: '2' };
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
    const body = JSON.parse(res.body);
    const items = body.Items as any[];

    expect(res.statusCode).toBe(200);
    expect(items.length).toBe(2);
    items.forEach((item) => {
      expect([EXPECTED1, EXPECTED2, EXPECTED3]).toContainEqual(item);
    });
  });

  test('should return 200 when provided all params', async () => {
    const pathParameters: Record<string, string> = { table: TEST_TABLE };
    const queryStringParameters: Record<string, string> = {
      pageSize: '1', keyName: 'id', lastEvaluatedKey: 'test-id-1',
    };
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
    const body = JSON.parse(res.body);
    const items = body.Items as any[];

    expect(res.statusCode).toBe(200);
  });

  test('should throw error when provided lastEvaluatedKey but no keyName query params', async () => {
    const pathParameters: Record<string, string> = { table: TEST_TABLE };
    const queryStringParameters: Record<string, string> = { pageSize: '1', lastEvaluatedKey: 'test-id-1' };
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
      'You need to provide both lastEvaluatedKey and keyName query params',
    );
  });

  test('should throw error when provided keyName but no lastEvaluatedKey query params', async () => {
    const pathParameters: Record<string, string> = { table: TEST_TABLE };
    const queryStringParameters: Record<string, string> = { pageSize: '1', keyName: 'id' };
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
      'You need to provide both lastEvaluatedKey and keyName query params',
    );
  });

  beforeAll(async () => {
    const params = dynamoHelper.getCreateTableParams('id', TEST_TABLE) as any;
    await dynamoHelper.createTable(params);
  });

  beforeEach(async () => {
    const deleteParams = dynamoHelper.getDeleteTableParams(TEST_TABLE);
    await dynamoHelper.deleteTable(deleteParams);

    const createParams = dynamoHelper.getCreateTableParams('id', TEST_TABLE) as any;
    await dynamoHelper.createTable(createParams);

    await dynamoHelper.put(EXPECTED1, TEST_TABLE);
    await dynamoHelper.put(EXPECTED2, TEST_TABLE);
    await dynamoHelper.put(EXPECTED3, TEST_TABLE);
  });

  afterAll(async () => {
    const deleteParams = dynamoHelper.getDeleteTableParams(TEST_TABLE);
    await dynamoHelper.deleteTable(deleteParams);
  });
});
