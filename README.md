# pulumi-aws-ts-k8s-go

A simple golang/gin app deployed to Kubernetes on AWS EKS.

The example shows how easy it is to deploy a containerized application to Amazon EKS. Pulumi does the following:
- Builds the Docker images
- Provisions AWS Container Registry (ECR) instance
- Pushes the images to the ECR instance
- Provisions AWS EKS cluster
- Uses the images to create Kubernetes deployments

## Prerequisites

1. Install NPM modules:

	```bash
	$ npm install
	```

## Deploying and running the program


1. Create a new stack:

	```bash
	$ pulumi stack init pulumi-aws-ts-k8s-go
	```

2. Set the AWS region and environment variables:

	```bash
	$ pulumi config set aws:region us-west-2
	$ pulumi config set hello-go:hello_message "Hello, Pulumi"
	```

3. Run `pulumi up -y` to deploy changes:


4. Verify that the EKS instance exists by connecting to it on port `:8889` in a browser window.

## Clean up

To clean up resources, run `pulumi destroy` and answer the confirmation question at the prompt.

## Misc. Commands

* `pulumi stack --show-urns`
* `pulumi destroy --target urn:pulumi:pulumi-aws-ts-k8s-go::hello-go::eks:index:Cluster::eksCluster -y --target-dependents`
