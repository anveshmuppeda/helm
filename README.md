# Helm
Helm Basic notes
Prerequisites
To get started with helm charts, you need to have the following.
1. A working Kubernetes cluster.
2. Helm installed on your workstation.
3. A valid kubeconfig to connect to the cluster.
4. Working knowledge of Kubernetes and YAML.

## What is Helm Chart?
For the purpose of explanation, I am choosing a very basic example of a website frontend deployment using Nginx on Kubernetes

Helm Chart Structure
To understand the Helm chart, let’s take an example of Nginx deployment. To deploy Nginx on Kubernetes, typically you would have the following YAML files.

nginx-deployment
    ├── configmap.yaml
    ├── deployment.yaml
    ├── ingress.yaml
    └── service.yaml

Now if we create a Helm Chart for the above Nginx deployment, it will have the following directory structure.

nginx-chart/
|-- Chart.yaml
|-- charts
|-- templates
|   |-- NOTES.txt
|   |-- _helpers.tpl
|   |-- deployment.yaml
|   |-- configmap.yaml
|   |-- ingress.yaml
|   |-- service.yaml
|   `-- tests
|       `-- test-connection.yaml
`-- values.yaml
As you can see, the deployment YAML files are part of the template directory (highlighted in bold) and there are helm-specific files and folders. Let’s look at each file and directory inside a helm chart and understand its importance.

.helmignore: It is used to define all the files which we don’t want to include in the helm chart. It works similarly to the .gitignore file.
Chart.yaml: It contains information about the helm chart like version, name, description, etc.
values.yaml: In this file, we define the values for the YAML templates. For example, image name, replica count, HPA values, etc. As we explained earlier only the values.yaml file changes in each environment. Also, you can override these values dynamically or at the time of installing the chart using --values or --set command.
charts: We can add another chart’s structure inside this directory if our main charts have some dependency on others. By default this directory is empty.
templates: This directory contains all the Kubernetes manifest files that form an application. These manifest files can be templated to access values from values.yaml file. Helm creates some default templates for Kubernetes objects like deployment.yaml, service.yaml etc, which we can use directly, modify, or override with our files.
templates/NOTES.txt: This is a plaintext file that gets printed out after the chart is successfully deployed. 
templates/_helpers.tpl: That file contains several methods, and sub-template. These files are not rendered to Kubernetes object definitions but are available everywhere within other chart templates for use. 
templates/tests/: We can define tests in our charts to validate that your chart works as expected when it is installed. 


