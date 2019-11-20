**Wild West Kubernetes**

![](https://github.com/gshipley/wild-west-kubernetes/raw/master/src/main/resources/static/assets/sceenshot.png)

Wild West Kubernetes is a sample application written in Spring Boot and the Phaser game engine to make killing pods fun.  In order to play the game, you need to have a kubernetes cluster running and issue the following command:

```
kubectl apply -f https://git.io/k8s-wild-west
```

This will create a namespace called *wildwest* and deploy the gshipley/wildwest:latest docker image with five replicas.  This will also create a service and apply the correct RBAC view role to pull information from the kubernetes API.  It should be noted that the default kubernetes/k8s.yaml file creates a service using a NodePort. This should work in most minikube environments but you should change it if you are running on a cluster with a LoadBalancer.  For an example of an ingress, check out the kubernetes/ingress.yaml file.

By default, the game doesn't actually destroy the pods when you shoot them.  If you want to enable destructive mode, issue the following command:

```
kubectl apply -f https://git.io/k8s-wild-west-destructive
```

Once you have the game deployed, you will need to expose the service so that you can access the web application.  If you are using minikube, you could use port-fowarding:

```
kubectl port-forward -n wildwest svc/wildwest 8080:8080
```

Happy Pod hunting.
