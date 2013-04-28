What is the name of this game, even?
====================================

The `Game` class
----------------

The game class is the primary backbone of the game; it takes care of everything from setting up video and  audio to running the game loop and setting up event handlers.

### Member variables

  * `rows` - the number of rows in the grid
  * `cols` - the number of columns in the grid
  * `width` - the width of the video display
  * `height` - the height of the video display
  * `score` - the player's current score

### Public Methods

Note that the class will have more methods (such as render), but they are only publically accessible because of JavaScript.

  * `constructor(id, width, height, rows, cols)` - id is the id of the element to be replaced with the game video output, width and height specify the resolution, and rows and cols specify the size of the game grid
  * `start()` - begins the game
  * `setSoundtrack(file)` - file is the relative location of the audio file containing the soundtrack, which is loaded and then looped
  * `keyPressed(key)` - returns true if key is being held down, false otherwise
  * `mouseWasClicked()` - returns an object with the x and y coordinates of the mouse click relative to the video output if the mouse has been clicked since the function was last called, false otherwise
  * `onUpdate(callback)` - callback is a function which will be called once each iteration of the game loop, after all of the entities' individual update functions have been called. This function should only contain logic for the game as a whole, such as updating the scoreboard and creating new entities or enemies.
  * `onCollide(callback)` - `callback` is a function which will be called when an entity attempts to move to a cell which already contains an entity. When this happens, the entities will not be moved, and callback will be called with three arguments: the two entities and an object containing the x and y coordinates of the disputed location. `callback` must then handle the situation.
  * `validLocation(location)` - check if `location` is on the game grid
  * `adjacentLocation(location, direction)` - return the location adjacent to `location` that is in `direction`
  * `addEntity(entity, location)` - `entity` is an object which represents a game entity (see section about the Entity hierarchy) and location is an object with the x and y coordinates at which the entity should be inserted. If an entity already occupies that location, it will return false, otherwise, it will return true. The entity will have its location set to the specified location, and `game` set to `this`.
  * `moveEntity(entity, direction)` - `direction` is 0 for north, 1 for east, 2 for south, and 3 for west. The entity will be moved one space in the specified direction. If the resulting location is not on the grid, the entity will not be moved. If the resulting location is occupied, the entity will not be moved and the callback set by `onCollide` will be called to resolve the collision. If `entity` is not on the game grid, no action is taken.
  * `removeEntity(entity)` - remove entity from game grid

Each entity is in charge of moving itself. See the Entity section for details.

The `Entity` interface
----------------------
The `Entity` interface provides a general interface that all entities should implement. To create a new type of entity, use `Entity` as the prototype for the new type. Don't instantiate the `Entity` interface directly, since it would just sit still and be boring if you did so.

### Member Variables

  * `game` - the game that the entity belongs to
  * `time` - the number of iterations of the game loop that it takes to move the entity. I'm not sure if this is necessary, it really depends on what we want the speed of an entity to be determined by.
  * `location` - an object containing the x and y coordinates of the entity's location on the game grid; use this as a read only variable, as changing this manually will simply confuse the game engine into oblivion rather than move the entity
  * `moving` - the direction that the entity is moving, -1 if the entity is not moving
  * `timeMoved` - the number of iterations since the entity started moving

### Public Methods

  * `constructor(level)` - level is the level of the entity; see the section about levels for more details
  * `move(direction)` - direction is 0 for north, 1 for east, 2 for south, and 3 for west. The entity will be moved one space in the specified direction, at the speed specified by `this.time`.
  * `update()` - called once per iteration, except when the entity is moving from one cell to another. The game logic relative to the entity should be contained in this function.
  * `die()` - called when the entity dies.

The `PlayerEntity` class
------------------------

The `PlayerEntity` class represents the player. There should only be one object of this class in the game. Please note that all functions sharing names with functions in the Entity class are overriden. All other variables and methods of the Entity class are inherited.

### Public Methods

  * `constructor()` - creates a new player entity with level set to 1
  * `update()` - checks for keyboard (or mouse? or both?) input and moves the entity in the appropriate direction if it has been received
  * `die()` - decrements lives if they are even a part of this game and there happens to be a couple extra lying around, otherwise ends the game.

The `AIEntity` class
--------------------

The `AIEntity` class represents a non-player character, whose motions are determined by the computer. All state information used for the "AI" should be kept in the object.

### Member Variables

  * all the variables containing data for the AI should be member variables

### Public Methods

  * `constructor(level)` - creates a new ai entity and sets the level
  * `update()` - crunches those lovely numbers and follows some algorithm or something to figure out whether or not to move and where to move
  * `die()` - should increase the score, according to the level it is at

Sharks???
=========

If a shark's behavior differs greatly from that of a normal ai, create a SharkEntity with AIEntity or just Entity as its prototype. Also, I'm not sure what the correct terminology should be for "sharks", since they in fact will not be sharks but something else instead.

Level Hierarchy
===============

Each level will be represented by a different color. Add more information about colors and other behavior dependent on the level here.
