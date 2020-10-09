import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { createLogger, Logger } from '../util/logger';
import * as dynamodb from '../service/dynamodb.service';

/**
 * Lambda Handler
 *
 * @param {APIGatewayProxyEvent} event
 *  PathParam should have following structure: /{table}/{id}
 *  QueryParam should have following values: keyName.
 * @param {Context} context
 * @returns {Promise<APIGatewayProxyResult>}
 */
export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const logger: Logger = createLogger(event, context);
  const queryParams: Record<string, string> = event.queryStringParameters;
  const pathParams: Record<string, string> = event.pathParameters;
  logger.info(`Get: ${JSON.stringify({ pathParams, queryParams })}`);

  try {
    const { id, table } = pathParams;
    const { keyName } = queryParams;
    const item = await dynamodb.get({ [keyName]: id }, table);

    logger.info(`Retrived item: ${JSON.stringify(item)}`);
    return {
      statusCode: 200,
      body: JSON.stringify(item),
    };
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
