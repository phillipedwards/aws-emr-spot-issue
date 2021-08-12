import * as aws from "@pulumi/aws";

const instanceRole = new aws.iam.Role("instance-role", {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({ Service: "ec2.amazonaws.com" })
});

new aws.iam.RolePolicyAttachment("attachment", {
    role: instanceRole,
    policyArn: "arn:aws:iam::aws:policy/service-role/AmazonElasticMapReduceforEC2Role"
});

const profile = new aws.iam.InstanceProfile("profile", {
    role: instanceRole
});

const defaultRole = new aws.iam.Role("default-role", {
    name: "EMR_DefaultRole",
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({ Service: "elasticmapreduce.amazonaws.com" })
});

new aws.iam.RolePolicyAttachment("attachment2", {
    role: defaultRole,
    policyArn: "arn:aws:iam::aws:policy/service-role/AmazonElasticMapReduceRole"
});

const cluster = new aws.emr.Cluster("example", {
    releaseLabel: "emr-6.3.0",
    serviceRole: defaultRole.arn,
    masterInstanceFleet: {
        instanceTypeConfigs: [{
            instanceType: "m4.xlarge",
        }],
        targetOnDemandCapacity: 1,
    },
    ec2Attributes: {
        instanceProfile: profile.arn,
    },
    coreInstanceFleet: {
        instanceTypeConfigs: [
            {
                bidPriceAsPercentageOfOnDemandPrice: 80,
                ebsConfigs: [{
                    size: 100,
                    type: "gp2",
                    volumesPerInstance: 1,
                }],
                instanceType: "m3.xlarge",
                weightedCapacity: 1,
            },
            {
                bidPriceAsPercentageOfOnDemandPrice: 100,
                ebsConfigs: [{
                    size: 100,
                    type: "gp2",
                    volumesPerInstance: 1,
                }],
                instanceType: "m4.xlarge",
                weightedCapacity: 1,
            },
            {
                bidPriceAsPercentageOfOnDemandPrice: 100,
                ebsConfigs: [{
                    size: 100,
                    type: "gp2",
                    volumesPerInstance: 1,
                }],
                instanceType: "m4.2xlarge",
                weightedCapacity: 2,
            },
        ],
        name: "core fleet",
        targetSpotCapacity: 2,
    },
});

// maximumOndemandCapacityunits: 0 
// this property should translate to the managedScalingPolicy in AWS, however, see screen shot in repo
new aws.emr.ManagedScalingPolicy("some-policy", {
    clusterId: cluster.id,
    computeLimits: [{
        unitType: "InstanceFleetUnits",
        minimumCapacityUnits: 2,
        maximumCapacityUnits: 10,
        maximumOndemandCapacityUnits: 0,
        maximumCoreCapacityUnits: 2,
    }],
});