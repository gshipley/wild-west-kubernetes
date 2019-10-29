package com.vmware.wildwest.controllers;

import com.vmware.wildwest.models.PlatformObject;
import io.kubernetes.client.ApiClient;
import io.kubernetes.client.Configuration;
import io.kubernetes.client.apis.CoreV1Api;
import io.kubernetes.client.models.V1Pod;
import io.kubernetes.client.models.V1PodList;
import io.kubernetes.client.util.ClientBuilder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
@RestController
public class TestAPI {

	@RequestMapping("/kube")
	public ArrayList getPlatformObjects() {
		System.out.println("2");
		ApiClient client;
		CoreV1Api api;
		ArrayList<PlatformObject> thePods = new ArrayList<>();
		try {
			client = ClientBuilder.cluster().build();
			// set the global default api-client to the in-cluster one from above
			Configuration.setDefaultApiClient(client);

			// the CoreV1Api loads default api-client from global configuration.
			api = new CoreV1Api();

			thePods = new ArrayList<>();
			try {
				System.out.print(("Client info: " + client.getAuthentications().keySet().toArray()));
				System.out.println("\n\nJorge is awesome\n\n");
				V1PodList pods = api.listNamespacedPod("wildwest", null, null, null, null, null, null, null, null, null);
				for (V1Pod item : pods.getItems()) {
					thePods.add(new PlatformObject(item.getMetadata().getUid(), item.getMetadata().getName(), "POD"));
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return thePods;
	}
}