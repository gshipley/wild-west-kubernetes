package com.vmware.wildwest.models;

import java.util.Hashtable;

public class Game {

	private Score score;
	private Hashtable<String, PlatformObject> gameObjects;

	// The GameMode enum can be used to provide access to kubernetes distributions that extend K8s
	// with their own platform objects. If adding a game mode, you will need to ensure that the
	// K8s distribution you are targeting uses the same API client.  For some distributions, such as
	// OpenShift, this isn't the case.  You will need to swap out the entire upstream K8s java client
	// for something that understands the fork.  For OpenShift, take a look at the Fabric client.
	public enum GameMode {
		KUBERNETES
	}

	public GameMode mode = GameMode.KUBERNETES;
	
	public Game() {
		score = new Score();
		gameObjects = new Hashtable<>();
	}

	public Score getScore() {
		return score;
	}

	public void setScore(Score score) {
		this.score = score;
	}

	public void addGameObject(PlatformObject newObject) {
		if (!gameObjects.containsKey(newObject.getObjectID())) {
			gameObjects.put(newObject.getObjectID(), newObject);
		}
	}

	public void removeGameObject(PlatformObject theObject) {
		gameObjects.remove(theObject.getObjectID());
	}

	public GameMode getGameMode() {
		return mode;
	}

	public void setGameMode(GameMode mode) {
		this.mode = mode;
	}

}
