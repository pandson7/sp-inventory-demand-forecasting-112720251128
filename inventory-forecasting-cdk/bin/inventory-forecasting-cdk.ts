#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { InventoryForecastingStack112720251128 } from '../lib/inventory-forecasting-cdk-stack';

const app = new cdk.App();
new InventoryForecastingStack112720251128(app, 'InventoryForecastingStack112720251128', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
  },
});
