# Helm Commands  
```
helm repo list
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo list
helm repo remove bitnami
helm repo add bitnami https://charts.bitnami.com/bitnami
```
### to list the release names 
```
helm list -a
helm list -a
 -a = show all releases without any filter applied
 -A = list releases across all namespaces
```

### search the repository:
```
# Search for stable release versions matching the keyword "nginx"
$ helm search repo nginx

# Search for release versions matching the keyword "nginx", including pre-release versions
$ helm search repo nginx --devel

# Search for the latest stable release for nginx-ingress with a major version of 1
$ helm search repo nginx-ingress --version ^1.0.0
```
### helm search hub  
search for charts in the Artifact Hub or your own hub instance  
```
helm search hub [KEYWORD] [flags]  
```
### get command  
```
helm get <option> my-chart
  options: 
  1. values
  2. notes
  3. manifest
```
---
## Install
### to install a package:
```
helm install mydb bitnami/mysql
```
### to check the installation status:
```
helm status mydb
```
### to install any release using existing charts  
```
$helm install <release-name> <chart-name> -n <namespace>  
```
### to create a own helm chart  
```
$helm create <chart-name>  
$helm create jenkins-chart  
```
### to create your own release from your own chat 
```
$helm install <release-name> <chart-name>  
$helm install jenkins-release jenkins-chart  
```
### to upgrade an existing release:  
```
helm upgrade <release-name> <chart-name> --set replicaCount=3 -n anvesh
```  
### to Upgrade:
```
ROOT_PASSWORD=$(kubectl get secret --namespace default mydb-mysql -o jsonpath="{.data.mysql-root-password}" | base64 --decode)  
helm upgrade --namespace default mysql-release bitnami/mysql --set auth.rootPassword=$ROOT_PASSWORD  
```

## uninstall chart
```
helm uninstall <release-name>
```

### List the repos  
```
$helm repo list [flags]
```

### to add new repo to your helm  
```
$helm repo add bitnami https://charts.bitnami.com/bitnami
$helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
```
### to list repos in your helm  
```
$ helm repo list
```
### to update the current repos in your helm  
```
$helm repo update
```

### to search any chart within the repo
```
$helm search repo bitnami/rabbitmq -l  
$helm search repo prometheus-community -l  
```

### To view the template syntax after applying templates to the deployment files  
```
$helm template RELEASENAME .
individual template 
$helm template RELEASENAME . -s templates/jenkins-deployment.yaml
```
### helm show   
show the chart's definition   
show all information of the chart  
```
helm show all [CHART] [flags]  
```
### to show the chart's definition
This command inspects a chart (directory, file, or URL) and displays the contents of the Chart.yaml file
```
helm show chart [CHART] [flags]  
```
