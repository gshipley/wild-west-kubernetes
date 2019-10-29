**Wild West Kubernetes**

Wild West Kubernetes is a sample application written in Spring Boot and the Phaser game engine to make killing pods fun.  In order to play the game, you need to have a kubernetes cluster running and issue the following command:

```
kubectl apply -f 
```

This will create a namespace called *wildwest* and deploy the gshipley/wildwest:latest docker image.  This will also create a service and apply the correct RBAC view role to pull information from the kubernetes API.

By default, the game doesn't actually destroy the pods with you shoot them.  If you want to enable destructive mode, issue the following command:

```
kubectl apply -f 
```

Once you have the game deployed, you will need to expose the service so that you can access the web application.  If you are using minikube, you could use port-fowarding:

```
kubectl port-forward -n wildwest svc/wildwest 8080:8080
```

Happy Pod hunting.