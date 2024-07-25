import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

export class AssetStorage extends cdk.Construct {
  public readonly uploadBucket: s3.Bucket;

  public readonly hostingBucket: s3.Bucket;

  public readonly assetBucket: s3.Bucket;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    this.uploadBucket = new s3.Bucket(this, 'UploadBucket', {
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    this.hostingBucket = new s3.Bucket(this, 'HostingBucket', {
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    this.assetBucket = new s3.Bucket(this, 'AssetBucket', {
      encryption: s3.BucketEncryption.S3_MANAGED,
    });
  }
}
