#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/infra-stack';
import { InfraStackProd } from '../lib/infra-stack-prod';
const app = new cdk.App();
const devStack = new InfraStack(app, 'InfraStack', {
    env: {
        region: app.node.tryGetContext('dev').region,
        account: app.node.tryGetContext('dev').account,
    },
    environment: 'dev',
    });
const prodStack = new InfraStackProd(app, 'InfraStackProd', {
    env: {
        region: app.node.tryGetContext('prod').region,
        account: app.node.tryGetContext('prod').account,
    },
    environment: 'prod',
    });




