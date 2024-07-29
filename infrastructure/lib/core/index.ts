import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AssetStorage } from './storage';
import { WebApp } from './webapp';

export class ApplicationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const storage = new AssetStorage(this, 'Storage');

    new WebApp(this, 'WebApp', {
      hostingBucket: storage.hostingBucket,
      baseDirectory: '../',
      relativeWebAppPath: 'webapp',
    });
  }
}
