import { RemovalPolicy } from 'aws-cdk-lib';
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  LambdaIntegration,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export interface NotificationProps {
  api: RestApi;
  userPool: UserPool;
}

export class Notification extends Construct {
  constructor(scope: Construct, id: string, props: NotificationProps) {
    super(scope, id);

    const table = new Table(this, 'Table', {
      partitionKey: { name: 'category', type: AttributeType.STRING },
      sortKey: { name: 'created_at', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // APIの実装
    const authorizer = new CognitoUserPoolsAuthorizer(this, 'Authorizer', {
      cognitoUserPools: [props.userPool],
    });

    const commonAuthorizerProps = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer,
    };

    const notificationFunction = new NodejsFunction(this, 'Notification', {
      entry: './lambda/notification.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
      environment: { TABLE_NAME: table.tableName },
    });
    table.grantReadData(notificationFunction);

    props.api.root
      .addResource('notification')
      .addMethod(
        'GET',
        new LambdaIntegration(notificationFunction),
        commonAuthorizerProps
      );
  }
}
