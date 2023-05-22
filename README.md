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
```
nginx-deployment
    ├── configmap.yaml
    ├── deployment.yaml
    ├── ingress.yaml
    └── service.yaml
```
Now if we create a Helm Chart for the above Nginx deployment, it will have the following directory structure.
```
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
```
As you can see, the deployment YAML files are part of the template directory (highlighted in bold) and there are helm-specific files and folders. Let’s look at each file and directory inside a helm chart and understand its importance.  

1. .helmignore: It is used to define all the files which we don’t want to include in the helm chart. It works similarly to the .gitignore file.
2. Chart.yaml: It contains information about the helm chart like version, name, description, etc.
3. values.yaml: In this file, we define the values for the YAML templates. For example, image name, replica count, HPA values, etc. As we explained earlier only the values.yaml file changes in each environment. Also, you can override these values dynamically or at the time of installing the chart using --values or --set command.
4. charts: We can add another chart’s structure inside this directory if our main charts have some dependency on others. By default this directory is empty.
5. templates: This directory contains all the Kubernetes manifest files that form an application. These manifest files can be templated to access values from values.yaml file. Helm creates some default templates for Kubernetes objects like deployment.yaml, service.yaml etc, which we can use directly, modify, or override with our files.
6. templates/NOTES.txt: This is a plaintext file that gets printed out after the chart is successfully deployed. 
7. templates/_helpers.tpl: That file contains several methods, and sub-template. These files are not rendered to Kubernetes object definitions but are available everywhere within other chart templates for use. 
8. templates/tests/: We can define tests in our charts to validate that your chart works as expected when it is installed. 

## Create Helm Chart From Scratch  
To get hands-on with helm chart creation, let’s create an Nginx helm chart from scratch.  

Execute the following command to create the chart boilerplate. It creates a chart with the name nginx-chart with default files and folders.  
```
helm create nginx-chart
```
If you check the created chart, it will have the following files and directories.
```
nginx-chart
│   ├── Chart.yaml
│   ├── charts
│   ├── templates
│   │   ├── NOTES.txt
│   │   ├── _helpers.tpl
│   │   ├── deployment.yaml
│   │   ├── hpa.yaml
│   │   ├── ingress.yaml
│   │   ├── service.yaml
│   │   ├── serviceaccount.yaml
│   │   └── tests
│   │       └── test-connection.yaml
│   └── values.yaml
```
Let’s cd into the generated chart directory.
```
cd nginx-chart
```
We’ll edit the files one by one according to our deployment requirements.
```
Chart.yaml
```
As mentioned above, we put the details of our chart in Chart.yaml file. Replace the default contents of chart.yaml with the following.
```
apiVersion: v2
name: nginx-chart
description: My First Helm Chart
type: application
version: 0.1.0
appVersion: "1.0.0"
maintainers:
- email: contact@devopscube.com
  name: devopscube
```
1. apiVersion: This denotes the chart API version. v2 is for Helm 3 and v1 is for previous versions.
2. name: Denotes the name of the chart.
3. description: Denotes the description of the helm chart.
4. Type: The chart type can be either ‘application’ or ‘library’. Application charts are what you deploy on Kubernetes. Library charts are re-usable charts that can be used with other charts. A similar concept of libraries in programming.
5. Version: This denotes the chart version. 
6. appVersion: This denotes the version number of our application (Nginx). 
7. maintainers: Information about the owner of the chart.
