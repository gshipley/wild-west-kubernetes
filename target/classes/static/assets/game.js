    //*******************************************************************
    //**  Wild West K8s
    //**  Author: Grant Shipley @gshipley
    //**  Thanks to Marek Jelen, Jorge Morales, and RyanJ
    //**  Shootem-up game to kill K8s pods
    //*******************************************************************
    var game;
    var gunSight;
    var gunshot;
    var currObject;  // This is the sprite in the game representing the current K8s Object
    var currentK8sObject;
    var emitter;
    var gameLoop;
    var index=0;
    var frameObject;
    var line='';
    var yeehaw;
    var explosion;
    var gameID;
    var objectText;
    var killFrameText;
    var scoreText;
    var introText;
    var gameScore = 0;
    var noviceMode = false;
    var content = [
        " ",
        "Wild West K8s",
        " "
    ];
    var locations = [
        [341, 409],  // door 1
        [585, 420],  // door 2
        [7825, 425],  // door 3
        [643, 122],  // top of building 3
        [955, 287],  // building 4 balcony
        [149, 149],  // building 1 left roof
        [149, 140],  // building 1 right roof
        [860, 634],  // Barrel
        [30, 530]    // cactus
    ];

    // We need to create the game on the server
    $.ajax({
        url: '/createGame',
        async: false,
        success: function(results) {
            gameID = results.score.gameID;

            // Now that we have a gameID from the server, we can start the game
            game = new Phaser.Game(1151, 768, Phaser.AUTO, 'k8sgame', { preload: preload, create: create, update: update, render: render });
        }
    });

    function preload() {

        game.load.image('playfield', 'assets/gameplayfield.png');
        game.load.image('gunsight', 'assets/gunsight.png');
        game.load.audio('gunshot', 'assets/gunshot.wav');
        game.load.image('SERVICE', 'assets/service.png');
        game.load.image('POD', 'assets/pod.png');
        game.load.image('PVC', 'assets/storage.png');
        game.load.audio('yeehaw', 'assets/yeehaw.wav');
        game.load.audio('explosion', 'assets/explosion.wav');
        game.load.image('killframe', 'assets/frame.png');
    }

    function create() {
        // load the playfield background image
        var playfield = game.add.image(game.world.centerX, game.world.centerY, 'playfield');
        playfield.anchor.setTo(0.5, 0.5);

        // Start the physics system for the gunsight and explosion
        game.physics.startSystem(Phaser.Physics.ARCADE);

        introText = game.add.text(32, 660, '', { font: "26pt Courier", fill: "#000000", stroke: "#000000", strokeThickness: 2 });
        scoreText = game.add.text(765, 10, 'Score: 000', { font: "16pt Courier", fill: "#000000", stroke: "#000000", strokeThickness: 2 });

        objectText = game.add.text(32, 670, '', { font: "16pt Courier", fill: "#000000", stroke: "#000000", strokeThickness: 2 });

        //display the intro text
        displayIntroText();

        // Load the gunshot audio
        gunshot = game.add.audio('gunshot');
        // Load the yeehaw
        yeehaw = game.add.audio('yeehaw');
        // Play the intro sound
        yeehaw.play();

        // Set the explosion sound
        explosion = game.add.audio('explosion');

        
        // load the gun sights
        gunSight = game.add.sprite(game.world.centerX, game.world.centerY, 'gunsight');
        gunSight.anchor.set(0.5);
        game.physics.arcade.enable(gunSight);
        gunSight.inputEnabled = true;

        // If the player fired their weapon
        gunSight.events.onInputDown.add(function () {
            gunshot.play();
            // Check if the gunsight is over the currentObject
            
            if(checkOverlap(gunSight, currObject)) {
                // delete the object on the game server
                stopGameDisplayLoop();
                deletePlatformObject(currentK8sObject);

                // Add the emitter for the explosion and play the yeehaw for target hit
                explosion.play();
                emitter = game.add.emitter(0, 0, 100);
                emitter.makeParticles(currentK8sObject.objectType);
                emitter.gravity = 200;

                //  Position the emitter where the mouse/touch event was
                emitter.x = locations[currLocation][0];
                emitter.y = locations[currLocation][1];

                //  The first parameter sets the effect to "explode" which means all particles are emitted at once
                //  The second gives each particle a 2000ms lifespan
                //  The third is ignored when using burst/explode mode
                //  The final parameter (10) is how many particles will be emitted in this single burst
                emitter.start(true, 2000, null, 10);

                currObject.destroy();

                objectText.text="";
                scoreText.text = "Score: ".concat(gameScore += 100);
            } else {
                // The player missed the target and should be penalized with a deduction in score
                scoreText.text = "Score: ".concat(gameScore -= 50);
            }
        }, this);

    }

    function displayKillFrame() {
        frameObject = game.add.sprite(220, 153, 'killframe');
        frameObject.inputEnabled = true;

        killFrameText = game.add.text(330, 270, '', { font: "26pt Courier", fill: "#000000", stroke: "#000000", strokeThickness: 2 });
        killFrameText.setText(killFrameHelp[currentK8sObject.objectType]);

        frameObject.events.onInputDown.add(function() {
            frameObject.destroy();
            killFrameText.destroy();
            startGameDisplayLoop();
        }, this);
    }

    function displayObject() {

        // Get a random location from the location array as defined in the locations array
        currLocation = getRandomLocation(0, locations.length-1);

        // Get a random object from the kubernetes API
        getRandomKubernetesObject();

        // Add the object to the playfiend using the random location
        currObject = game.add.sprite(locations[currLocation][0], locations[currLocation][1], currentK8sObject.objectType);

        //delete the kubernetes object after it has been visible for 3 seconds.
        game.time.events.add(Phaser.Timer.SECOND * 2, function() {
            currObject.destroy();
            objectText.text = "";
        });
        gunSight.bringToTop();
    }

    
    function getRandomKubernetesObject() {
        $.ajax({
            url: '/getRandomObject',
            async: false,
            success: function(results) {
                currentK8sObject = results;
                objectText.text = "Type: " + results.objectType + "\nName: " + results.objectName + "\nID: " + results.objectID;

            }
        });
    }

    function deletePlatformObject() {
        $.ajax({
            url: '/deleteObject',
            async: false,
            type: 'GET',
            data: { gameID: gameID, objectType : currentK8sObject.objectType, objectName : currentK8sObject.objectName, objectID : currentK8sObject.objectID },
            success: function() {
                if(noviceMode == false) {
                    startGameDisplayLoop();
                } else {
                    displayKillFrame(currentK8sObject);

                }
            },
            error: function() {
                startGameDisplayLoop();
            }
        })
    }
    function checkOverlap(spriteA, spriteB) {
        if(typeof spriteA != 'undefined' && typeof spriteB != 'undefined') {
            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();

            return Phaser.Rectangle.intersects(boundsA, boundsB);
        }

    }

    function getRandomLocation(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    function update() {

        //  If the gunsight is > 8px away from the pointer then let's move to it
        if (game.physics.arcade.distanceToPointer(gunSight, game.input.activePointer) > 8) {
            //  Make the object seek to the active pointer (mouse or touch).
            game.physics.arcade.moveToPointer(gunSight, 300, game.input.activePointer, 100);
        }
        else {
            //  Otherwise turn off velocity because we're close enough to the pointer
            gunSight.body.velocity.set(0);
        }
    }

    function updateLine() {

        if (line.length < content[index].length)
        {
            line = content[index].substr(0, line.length + 1);
            // text.text = line;
            introText.setText(line);
        }
        else
        {
            //  Wait 2 seconds then start a new line
            game.time.events.add(Phaser.Timer.SECOND * 1, displayIntroText, this);
        }

    }

    function displayIntroText() {

        index++;

        if (index < content.length)
        {
            line = '';
            game.time.events.repeat(80, content[index].length + 1, updateLine, this);
        } else {
            introText.destroy();
            startGameDisplayLoop();
        }

    }

    function startGameDisplayLoop() {
        gameLoop = game.time.events.loop(Phaser.Timer.SECOND * 3, displayObject, this);
    }

    function stopGameDisplayLoop() {
        game.time.events.remove(gameLoop);
    }

    function render() {
        // If you are working / modifying this code base,
        // uncomment the following line to display helpful information
        // in the top left corner

        // game.debug.inputInfo(32, 32);
    }
