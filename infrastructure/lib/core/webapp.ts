import * as cdk from 'aws-cdk-lib';
import { aws_s3 as s3, aws_cloudfront as cloudfront } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
const path = require('path');

interface WebAppProps {
  hostingBucket: s3.IBucket;
  relativeWebAppPath: string;
  baseDirectory: string;
}

export class WebApp extends Construct {
  public readonly webDistribution: cloudfront.CloudFrontWebDistribution;

  constructor(scope: Construct, id: string, props: WebAppProps) {
    super(scope, id);

    const oai = new cloudfront.OriginAccessIdentity(this, 'WebhostingOAI', {});

    const cloudfrontProps: any = {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: props.hostingBucket,
            originAccessIdentity: oai,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
      errorConfiguration: [
        {
          errorCachingMinTtl: 86400,
          errorCode: 403,
          responseCode: 200,
          responsePage: '/index.html',
        },
        {
          errorCachingMinTtl: 86400,
          errorCode: 404,
          responseCode: 200,
          responsePage: '/index.html',
        },
      ],
    };

    this.webDistribution = new cloudfront.CloudFrontWebDistribution(
      this,
      'AppHostingDistribution',
      cloudfrontProps,
    );

    props.hostingBucket.grantRead(oai);

    // new cwt.WebAppDeployment(this, 'WebAppDeploy', {
    //   baseDirectory: props.baseDirectory,
    //   relativeWebAppPath: props.relativeWebAppPath,
    //   webDistribution: this.webDistribution,
    //   webDistributionPaths: ['/*'],
    //   buildCommand: 'yarn build',
    //   buildDirectory: 'build',
    //   bucket: props.hostingBucket,
    //   prune: true,
    // });

    new s3deploy.BucketDeployment(this, 'WebAppDeploy', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../../webapp/build'))],
      destinationBucket: props.hostingBucket,
      distribution: this.webDistribution,
      distributionPaths: ['/*'],
      prune: true,
    });

    new cdk.CfnOutput(this, 'URL', {
      value: `https://${this.webDistribution.distributionDomainName}/`,
    });
  }
}
