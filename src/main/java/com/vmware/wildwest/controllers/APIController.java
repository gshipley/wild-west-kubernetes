package com.vmware.wildwest.controllers;

import java.util.List;

import com.vmware.wildwest.helpers.PlatformObjectHelper;
import com.vmware.wildwest.models.Game;
import com.vmware.wildwest.models.PlatformObject;
import com.vmware.wildwest.models.Score;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;



@CrossOrigin(origins = "*")
@RestController
public class APIController {
	@Autowired
	private GameController gameController;

	@RequestMapping("/score")
	public Score getScore(@RequestParam(value = "gameID") String gameID) {
		return this.gameController.getGame(gameID).getScore();
	}

	@RequestMapping("/createGame")
	public Game getScore() {
		return gameController.createGame();
	}

	@RequestMapping("/egg")
	public String easterEgg() {
		return "Every game needs an easter egg!!";
	}
	
	@RequestMapping("/objects")
	public List<PlatformObject> getPlatformObjects() {
		PlatformObjectHelper helper = new PlatformObjectHelper();
		return helper.getPlatformObjects();
	}

	@RequestMapping("/getRandomObject")
	public PlatformObject getRandomPlatformObject() {
		PlatformObjectHelper helper = new PlatformObjectHelper();
		return helper.getRandomPlatformObject();
	}

	@CrossOrigin
	@RequestMapping("/deleteObject")
	public void deletePlatformObject(@RequestParam(value = "gameID") String gameID, 
							@RequestParam(value = "objectID") String objectID, 
							@RequestParam(value = "objectType") String objectType,
							@RequestParam(value = "objectName") String objectName) {

		PlatformObjectHelper helper = new PlatformObjectHelper();
		helper.deletePlatformObject(gameID, objectID, objectType, objectName);
	}

}