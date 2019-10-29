package com.vmware.wildwest.controllers;

import com.vmware.wildwest.models.Game;
import com.vmware.wildwest.models.Score;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

import java.util.Hashtable;
import java.util.Random;



@Configuration
@Scope(value = "singleton")
public class GameController {
	private Hashtable<String, Game> games = new Hashtable<>();

	public Game createGame() {
		Game newGame = new Game();
		Score gameScore = new Score();
		gameScore.setGameID(this.generateGameID());
		gameScore.setScore(0);
		newGame.setScore(gameScore);
		newGame.setGameMode(this.determineGameMode());

		games.put(newGame.getScore().getGameID(), newGame);

		return newGame;
	}

	public Game getGame(String gameID) {
		return this.games.get(gameID);
	}

	public void deleteGame(String gameID) {
		this.games.remove(gameID);
	}

	private String generateGameID() {
		String randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
		StringBuilder gameID = new StringBuilder();
		Random rnd = new Random();
		while (gameID.length() < 18) {
			int index = (int) (rnd.nextFloat() * randomChars.length());
			gameID.append(randomChars.charAt(index));
		}

		return gameID.toString();
	}

	private Game.GameMode determineGameMode() {
		Game.GameMode currentMode = Game.GameMode.KUBERNETES;

		// For now, the game mode is determined by an environment variable in the backend pod named GAME_MODE
		// If this environment variable is not set, it will default to KUBERNETES.
		// Given that most people will be using Kubernetes as their distribution for this game, a sane default
		// of kubernetes was chosen and will be used if no environment variable is defined.
		// This was added in case someone wants to add support for specific distributions of K8s

		if (System.getenv().containsKey("GAME_MODE")) {
			// possible game mode options are kube, k, kubernetes, openshift
			String gameEnvironmentVariable = System.getenv("GAME_MODE");
			switch (gameEnvironmentVariable) {
			case "kube":
			case "kubernetes":
			case "k":
				currentMode = Game.GameMode.KUBERNETES;
				break;
			default:
				currentMode = Game.GameMode.KUBERNETES;
			}
		}
		return currentMode;
	}
}
