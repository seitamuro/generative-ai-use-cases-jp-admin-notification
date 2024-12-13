import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayAuthorizerEvent, APIGatewayProxyResult } from 'aws-lambda';
import { currentTimestamp } from './utils/currentTimestamp';

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (
  event: APIGatewayAuthorizerEvent
): Promise<APIGatewayProxyResult> => {
  const dynamoDb = new DynamoDBClient({});
  const dynamoDbDocument = DynamoDBDocumentClient.from(dynamoDb);

  try {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression:
        'category = :partitionKey AND created_at <= :currentTime',
      ExpressionAttributeValues: {
        ':partitionKey': 'image',
        ':currentTime': currentTimestamp(), // 現在時刻以前のアイテム
      },
      ScanIndexForward: false,
    });

    const res = await dynamoDbDocument.send(command);
    console.log('res: ', res);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: res }),
    };
  } catch (error) {
    console.log('error: ', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Internal Server Error', error: error }),
    };
  }
};
