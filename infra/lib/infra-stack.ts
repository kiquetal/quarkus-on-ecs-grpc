import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {aws_ecr, CfnOutput} from "aws-cdk-lib";
import {EcsConstruct} from "./EcsConstruct";
// import * as sqs from 'aws-cdk-lib/aws-sqs';


interface InfraStackProps extends cdk.StackProps {
  environment: string;
}

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: InfraStackProps) {
    super(scope, id, props);

    const ecrServerGrpc = new aws_ecr.Repository(this, 'EcrServerGrpc', {
        repositoryName: 'grpc-java-server',

        });
    const ecrClientGrpc = new aws_ecr.Repository(this, 'EcrClientGrpc', {
        repositoryName: 'grpc-java-client',
        });

    new EcsConstruct(this, 'EcsConstruct')

    new CfnOutput(this, 'EcrServerGrpcOutput', {
        value: ecrServerGrpc.repositoryUri
    });
    new CfnOutput(this, 'EcrClientGrpcOutput', {
        value: ecrClientGrpc.repositoryUri
    });


  }


}
