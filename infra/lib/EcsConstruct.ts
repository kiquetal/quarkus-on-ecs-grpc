import {Construct} from "constructs";
import {aws_ecr, aws_ecs} from "aws-cdk-lib";


export class EcsConstruct extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);


       const clusterEcs = new aws_ecs.Cluster(this, 'EcsCluster', {
            clusterName: 'cluster-ecs',
           enableFargateCapacityProviders: true,
           defaultCloudMapNamespace: {
                name: 'cresterida',
               useForServiceConnect: true
           }

        });

       const taskGrpServer = new aws_ecs.FargateTaskDefinition(this, 'TaskGrpServer', {
            cpu: 256,
           memoryLimitMiB: 512
        });
       taskGrpServer.addContainer('ContainerServer', {
           image: aws_ecs.ContainerImage.fromEcrRepository(aws_ecr.Repository.fromRepositoryName(this,'grpc-java-server','grpc-java-server'), 'latest'),

              logging: aws_ecs.LogDrivers.awsLogs({streamPrefix: 'server'}),
           portMappings:  [{
               name: 'grpc-server',
                containerPort: 50051

           }],

         });

       const serviceGrpcServer = new aws_ecs.FargateService(this, 'ServiceGrpcServer', {
           cluster: clusterEcs,
           taskDefinition: taskGrpServer,
           serviceName: 'grpc-server',
            serviceConnectConfiguration: {
               services: [{
                     portMappingName: 'grpc-server'
               }]
            },
            desiredCount: 1
           }
         );

       const grpClient = new aws_ecs.FargateTaskDefinition(this, 'TaskGrpClient', {
              cpu: 256,
              memoryLimitMiB: 512
         });

         grpClient.addContainer('ContainerClient', {
              image: aws_ecs.ContainerImage.fromEcrRepository(aws_ecr.Repository.fromRepositoryName(this,'grpc-java-client','grpc-java-client'), 'latest'),
              logging: aws_ecs.LogDrivers.awsLogs({streamPrefix: 'client'})
             , environment: {
                 GRPC_HOST: 'grpc-server.cresterida',
             },
             portMappings:  [{
                    name: 'grpc-client',
                    containerPort: 8080
                }]
            });

         const serviceGrpcClient = new aws_ecs.FargateService(this, 'ServiceGrpcClient', {
                cluster: clusterEcs,
                taskDefinition: grpClient,
                serviceName: 'grpc-client',
                serviceConnectConfiguration:{
                    namespace: 'cresterida',
                } ,
                desiredCount: 1
            });
         }


}
