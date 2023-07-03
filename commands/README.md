# Helm Commands  

helm repo list

helm repo add bitnami https://charts.bitnami.com/bitnami

helm repo list

helm repo remove bitnami

helm repo add bitnami https://charts.bitnami.com/bitnami


## Search the repository:

helm search repo mysql

helm search repo database

helm search repo database --versions

## get  
```
helm get <option> my-chart
  options: 
  1. values
  2. notes
  3. manifest
```
## Install a package:

kubectl get pods

(Below Two commands - In a Different Shell/Commandline window/tab)

minikube ssh

docker images

helm install mydb bitnami/mysql

Check the cluster:

kubectl get pods

minikube ssh

docker images

To check the installation status:

helm status mydb



--------------------------------------------

To Upgrade:

ROOT_PASSWORD=$(kubectl get secret --namespace default mydb-mysql -o jsonpath="{.data.mysql-root-password}" | base64 --decode)

helm upgrade --namespace default mysql-release bitnami/mysql --set auth.rootPassword=$ROOT_PASSWORD

-------

helm uninstall mysql-release




To list the release names 
$helm list -a
$ helm list -a -n anvesh

List the repos
$helm repo list [flags]


To add new repo into your helm
$helm repo add bitnami https://charts.bitnami.com/bitnami
$helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

to list repos in your helm
$ helm repo list

to update the current repos in your helm
$helm repo update

To search any chart within the repo
$helm search repo bitnami/rabbitmq -l
$helm search repo prometheus-community -l

To install any release using existing charts
$helm install <release-name> <chart-name> -n <namespace>

To create a own helm chart
$helm create <chart-name>
$helm create jenkins-chart

To create your own release from your own chat 
$helm install <release-name> <chart-name>
$helm install jenkins-release jenkins-chart

To upgrade existing release:
helm upgrade <release-name> <chart-name> --set replicaCount=3 -n anvesh


To view the template syntax after applying templates to the deployment files
$helm template RELEASENAME .
individual template 
$helm template RELEASENAME . -s templates/jenkins-deployment.yaml
