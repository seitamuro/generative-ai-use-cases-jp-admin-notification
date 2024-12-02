import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayAuthorizerEvent, APIGatewayProxyResult } from 'aws-lambda';

const TABLE_NAME = process.env.TABLE_NAME!;

export const currentTimestamp = (): string => {
  const date = new Date(Date.now());
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

  const timestamp = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

  console.log('currentTimestamp: ', timestamp);

  return timestamp;
};

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
        ':partitionKey': 'article',
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
