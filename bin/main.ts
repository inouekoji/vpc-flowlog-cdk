#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { VpcFlowLogStack } from '../lib/vpc-frowlog-stack';

const app = new cdk.App();
new VpcFlowLogStack(app, 'VpcFlowLogStack', {
      env: {
            account: process.env.CDK_DEFAULT_ACCOUNT,
            region: process.env.CDK_DEFAULT_REGION,
      }
});
