Create an AWS EMR cluster with a particular ManagedScalingPolicy.

Expected: ManagedScalingPolicy with property `maximumOndemandCapacityUnits: 0` set should translate to AWS with the same policy.

Actual: Due a TF AWS provider bug, TF ignores any value less than 1 when setting the `maximumOndemandCapacityUnits`, which results in the property not being set in the Managed Scaling Policy.

## Steps to Reproduce
1. Clone this repo.
2. Pulumi up
3. Wait for Cluster to become available
4. View Cluster in AWS console
5. Look at Managed Scaling Policy

<img width="1557" alt="Screen Shot 2021-08-12 at 2 36 20 PM" src="https://user-images.githubusercontent.com/25461821/129274104-f3f1217e-f791-407f-aa7c-62489456c3aa.png">
