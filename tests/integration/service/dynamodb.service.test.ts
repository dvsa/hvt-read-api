import * as dynamodb from '../../../src/service/dynamodb.service';
import * as dynamoHelper from '../test-helpers/dynamo.helper';

const TEST_TABLE = 'TEST_TABLE_SERVICE';

describe('Test dynamodb service', () => {
  test('GET should return one item from dynamodb table', async () => {
    const expected = { id: 'test-id-1', attr1: 'test-attr-1' };
    await dynamoHelper.put(expected, TEST_TABLE);

    const result = await dynamodb.get({ id: expected.id }, TEST_TABLE);

    expect(result).toEqual(expected);
  });

  test('GETALL should return all requested items from dynamodb table', async () => {
    const expected1 = { id: 'test-id-1', attr1: 'test-attr-1' };
    const expected2 = { id: 'test-id-2', attr1: 'test-attr-2' };
    const expected3 = { id: 'test-id-3', attr1: 'test-attr-3' };
    await dynamoHelper.put(expected1, TEST_TABLE);
    await dynamoHelper.put(expected2, TEST_TABLE);
    await dynamoHelper.put(expected3, TEST_TABLE);

    const results = await dynamodb.getAll(
      TEST_TABLE,
    );

    expect(results.Count).toBe(3);
    results.Items.forEach((result) => {
      expect([expected1, expected2, expected3]).toContainEqual(result);
    });
  });

  test('GETALL should return one item and lastEvaluatedKey from dynamodb table', async () => {
    const expected1 = { id: 'test-id-1', attr1: 'test-attr-1' };
    const expected2 = { id: 'test-id-2', attr1: 'test-attr-2' };
    const expected3 = { id: 'test-id-3', attr1: 'test-attr-3' };
    await dynamoHelper.put(expected1, TEST_TABLE);
    await dynamoHelper.put(expected2, TEST_TABLE);
    await dynamoHelper.put(expected3, TEST_TABLE);

    const results = await dynamodb.getAll(
      TEST_TABLE,
      1,
    );

    expect(results.Count).toBe(1);
    expect([expected1, expected2, expected3]).toContainEqual(results.Items[0]);
    expect(results.LastEvaluatedKey).toBeDefined();
  });

  test('GETALL should page items from dynamodb table', async () => {
    const expected1 = { id: 'test-id-1', attr1: 'test-attr-1' };
    const expected2 = { id: 'test-id-2', attr1: 'test-attr-2' };
    const expected3 = { id: 'test-id-3', attr1: 'test-attr-3' };
    await dynamoHelper.put(expected1, TEST_TABLE);
    await dynamoHelper.put(expected2, TEST_TABLE);
    await dynamoHelper.put(expected3, TEST_TABLE);

    const resultsPage1 = await dynamodb.getAll(TEST_TABLE, 1);
    const keyName = 'id';
    const keyValue = resultsPage1.LastEvaluatedKey.toString();
    const resultsPage2 = await dynamodb.getAll(TEST_TABLE, 1, { [keyName]: keyValue });

    expect([expected1, expected2, expected3]).toContainEqual(resultsPage1.Items[0]);
    expect([expected1, expected2, expected3]).toContainEqual(resultsPage2.Items[0]);
    expect(resultsPage1.Items[0] !== resultsPage2.Items[1]).toBe(true);
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
  });

  afterAll(async () => {
    const deleteParams: Record<string, unknown> = dynamoHelper.getDeleteTableParams(TEST_TABLE);
    await dynamoHelper.deleteTable(deleteParams);
  });
});
