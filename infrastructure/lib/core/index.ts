import * as cdk from '@aws-cdk/core';
import { AssetStorage } from './storage';

export class ApplicationStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new AssetStorage(this, 'Storage');
  }
}
