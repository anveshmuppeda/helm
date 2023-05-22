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

## templates
There are multiple files in templates directory created by helm. In our case, we will work on simple Kubernetes Nginx deployment.  

Let’s remove all default files from the template directory.
```
rm -rf templates/*
```
We will add our Nginx YAML files and change them to the template for better understanding.  

Create a deployment.yaml file and copy the following contents.  
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: "nginx:1.16.0"
          imagePullPolicy: IfNotPresent
          ports:
            - name: http
              containerPort: 80
              protocol: TCP
```
If you see the above YAML file, the values are static. The idea of a helm chart is to template the YAML files so that we can reuse them in multiple environments by dynamically assigning values to them.

To template a value, all you need to do is add the object parameter inside curly braces as shown below. It is called a template directive and the syntax is specific to the Go templating
```
{{ .Object.Parameter }}
```
First Let’s understand what is an Object. Following are the three Objects we are going to use in this example.

1. Release: Every helm chart will be deployed with a release name. If you want to use the release name or access release-related dynamic values inside the template, you can use the release object.
2. Chart: If you want to use any values you mentioned in the chart.yaml, you can use the chart object.
3. Values: All parameters inside values.yaml file can be accessed using the Values object.

First, you need to figure out what values could change or what you want to templatize. I am choosing name, replicas, container name, image and imagePullPolicy which I have highlighter in the YAML file in bold. 

1. name: name: {{ .Release.Name }}-nginx : We need to change the deployment name every time as Helm does not allow us to install releases with the same name. So we will templatize the name of the deployment with the release name and interpolate -nginx along with it. Now if we create a release using the name frontend, the deployment name will be frontend-nginx. This way, we will have guaranteed unique names.
2. container name: {{ .Chart.Name }}: For the container name, we will use the Chart object and use the chart name from the chart.yaml as the container name.
3. Replicas: {{ .Values.replicaCount }} We will access the replica value from the values.yaml file.
4. image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}" Here we are using multiple template directives in a single line and accessing the repository and tag information under the image key from the Values file.

Similarly, you can templatize the required values in the YAML file.  

Here is our final deployment.yaml file after applying the templates. The templated part is highlighted in bold. Replace the deployment file contents with the following.
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-nginx
  labels:
    app: nginx
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: 80
              protocol: TCP
```
Create service.yaml file and copy the following contents.
```
apiVersion: v1
kind: Service
metadata:
  name: {{ .Release.Name }}-service
spec:
  selector:
    app.kubernetes.io/instance: {{ .Release.Name }}
  type: {{ .Values.service.type }}
  ports:
    - protocol: {{ .Values.service.protocol | default "TCP" }}
      port: {{ .Values.service.port }}
      targetPort: {{ .Values.service.targetPort }}
```
In the protocol template directive, you can see a pipe ( | ) . It is used to define the default value of the protocol as TCP. So that means we won’t define the protocol value in values.yaml file or if it is empty, it will take TCP as a value for protocol.  

Create a configmap.yaml and add the following contents to it. Here we are replacing the default Nginx index.html page with a custom HTML page. Also, we added a template directive to replace the environment name in HTML.  
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-index-html-configmap
  namespace: default
data:
  index.html: |
    <html>
    <h1>Welcome</h1>
    </br>
    <h1>Hi! I got deployed in {{ .Values.env.name }} Environment using Helm Chart </h1>
    </html
```
