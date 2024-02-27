import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();
const region = aws.config.region;
const helloMessage = config.require("hello_message");

// eks cluster component
const eksCluster = new eks.Cluster("eksCluster", {
	name: "eksCluster",
	instanceType: "t3a.medium",
	desiredCapacity: 3,
	minSize: 2,
	maxSize: 4,
	deployDashboard: false,
	enabledClusterLogTypes: [
			"api",
			"audit",
			"authenticator",
	],
});

const repo = new awsx.ecr.Repository("repository");

// client component
const clientImage = new awsx.ecr.Image("client-side-service", { repositoryUrl: repo.repository.repositoryUrl, context: "./client", platform: "linux/amd64" });
const clientAppName = "client";
const clientAppLabels = { appClass: clientAppName };
const clientDeployment = new k8s.apps.v1.Deployment("client-side-service", {
	metadata: { labels: clientAppLabels },
	spec: {
		replicas: 2,
		selector: { matchLabels: clientAppLabels },
		template: {
			metadata: { labels: clientAppLabels },
			spec: {
				containers: [{
					name: clientAppName,
					image: clientImage.imageUri,
					ports: [{ name: "http", containerPort: 8889 }],
					env: [
						{ name: "HELLO_MESSAGE", value: helloMessage },
					],
					resources: {
						limits: {
							memory: "500Mi",
							cpu: "500m",
						},
					},
				}],
			},
		},
	}}, {
	provider: eksCluster.provider,
});


// loadbalancer component
const clientsideListener = new k8s.core.v1.Service("client-side-listener", {
    metadata: { labels: clientDeployment.metadata.labels },
    spec: {
        type: "LoadBalancer",
        ports: [{ port: 8889, targetPort: "http" }],
        selector: clientAppLabels,
        publishNotReadyAddresses: false,
    }}, {
    provider: eksCluster.provider,
    },
);

// export the kubeconfig so that we can use it to interact with the cluster
// loadbalancer URL
export const kubeConfig = eksCluster.kubeconfig;
export const URL = clientsideListener.status.loadBalancer.ingress[0].hostname;
