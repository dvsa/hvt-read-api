import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { createLogger, Logger } from '../util/logger';
import { containsAtLeastOneUndefined, containsAtLeastOneDefined } from '../util/array';
import * as dynamodb from '../service/dynamodb.service';

/**
 * Lambda Handler
 *
 * @param {APIGatewayProxyEvent} event
 *  PathParam should have following structure: /{table}
 *  QueryParam You can provide three optional query parameters: pageSize, keyName, lastEvaluatedKey
 * @param {Context} context
 * @returns {Promise<APIGatewayProxyResult>}
 */
export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const logger: Logger = createLogger(event, context);
  const queryParams: Record<string, string> = event.queryStringParameters;
  const pathParams: Record<string, string> = event.pathParameters;
  logger.info(JSON.stringify({ queryParams }));

  try {
    const { table } = pathParams;
    const pageSize = +queryParams?.pageSize;
    const lastEvaluatedKey = queryParams?.lastEvaluatedKey;
    const keyName = queryParams?.keyName;
    logger.info(`GetAll: ${JSON.stringify({ pathParams, queryParams })}`);

    if (containsAtLeastOneUndefined([keyName, lastEvaluatedKey])
        && containsAtLeastOneDefined([keyName, lastEvaluatedKey])) {
      throw new Error('You need to provide both lastEvaluatedKey and keyName query params');
    }
    const key = containsAtLeastOneUndefined([keyName, lastEvaluatedKey]) ? undefined : { [keyName]: lastEvaluatedKey };

    const items = await dynamodb.getAll(table, pageSize, key);

    logger.info(`Retrived items: ${JSON.stringify(items)}`);
    return {
      statusCode: 200,
      body: JSON.stringify(items),
    };
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
