import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as Main from "../lib/vpc-frowlog-stack";

test("IAM Role Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Main.VpcFlowLogStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::IAM::Role", {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "vpc-flow-logs.amazonaws.com",
            },
          },
        ],
        Version: "2012-10-17",
      },
    })
  );
});
