const fs = require('fs');
const path = require('path');

// Path to your package.json file
const packageJsonPath = path.join(__dirname, 'package.json');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Define the new version for AWS CDK packages
const newCdkVersion = '^2.50.0';
const newConstructsVersion = '^10.0.0';

// List of individual AWS CDK packages that should be replaced with aws-cdk-lib
const individualCdkPackages = [
  '@aws-cdk/assert',
  '@aws-cdk/assets',
  '@aws-cdk/aws-apigateway',
  '@aws-cdk/aws-apigatewayv2',
  '@aws-cdk/aws-apigatewayv2-authorizers',
  '@aws-cdk/aws-apigatewayv2-integrations',
  '@aws-cdk/aws-applicationautoscaling',
  '@aws-cdk/aws-autoscaling',
  '@aws-cdk/aws-autoscaling-common',
  '@aws-cdk/aws-autoscaling-hooktargets',
  '@aws-cdk/pipelines',
];

// Function to update CDK packages in a dependencies object
function updateCdkPackages(dependencies) {
  if (!dependencies) return;

  for (const [pkg, version] of Object.entries(dependencies)) {
    if (pkg.startsWith('@aws-cdk/') || pkg === 'aws-cdk-lib' || pkg === 'constructs') {
      if (pkg === 'constructs') {
        dependencies[pkg] = newConstructsVersion;
      } else if (individualCdkPackages.includes(pkg)) {
        delete dependencies[pkg];
        if (!dependencies['aws-cdk-lib']) {
          dependencies['aws-cdk-lib'] = newCdkVersion;
        }
      } else {
        dependencies[pkg] = newCdkVersion;
      }
    }
  }
}

// Update dependencies and devDependencies
updateCdkPackages(packageJson.dependencies);
updateCdkPackages(packageJson.devDependencies);

// Write the updated package.json back to the file
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

console.log('All AWS CDK packages have been updated to version 2');
