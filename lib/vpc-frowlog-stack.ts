import * as cdk from "@aws-cdk/core";
import ec2 = require("@aws-cdk/aws-ec2");
import iam = require("@aws-cdk/aws-iam");
import logs = require("@aws-cdk/aws-logs");

export class VpcFlowLogStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const paramVpcId = new cdk.CfnParameter(this, "VpcId", {
      type: "AWS::EC2::VPC::Id",
      description: "VPC Id",
    });

    const paramFilter = new cdk.CfnParameter(this, "Filter", {
      type: "String",
      allowedValues: ["ALL", "ACCEPT", "REJECT"],
      default: "ALL",
      description: "Filter",
    });

    const logGroup = new logs.LogGroup(this, "LogGroupFlowLogs", {
      retention: logs.RetentionDays.INFINITE,
    });

    const flowLogRole = new iam.Role(this, "RoleFlowLogs", {
      assumedBy: new iam.ServicePrincipal("vpc-flow-logs.amazonaws.com"),
    });

    const policyStatement = new iam.PolicyStatement({
      actions: [
        "logs:CreateLogStream",
        "logs:DescribeLogStreams",
        "logs:PutLogEvents",
      ],
      resources: [logGroup.logGroupArn],
    });
    policyStatement.effect = iam.Effect.ALLOW;
    flowLogRole.addToPolicy(policyStatement);

    const flowlog = new ec2.CfnFlowLog(this, "FlowLog", {
      deliverLogsPermissionArn: flowLogRole.roleArn,
      logGroupName: logGroup.logGroupName,
      resourceId: paramVpcId.valueAsString,
      trafficType: paramFilter.valueAsString,
      resourceType: "VPC"
    });
  }
}
