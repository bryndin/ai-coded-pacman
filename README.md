This is an experiment to implement Pacman using the code generated by public LLMs.

## Step 1
*Prompt:* Using a p5 library generate code for the classic Pacman game. Make sure the code can run.

- MS Copilot generates HTML file with JS code inline that only shows black canvas. Logic there is a no-go hallucination.
- Gemini does generate a reasonable code. But it runs out of tokens and the code is unfinished. Need to find a workaround.

## Step 2
*Problem:* Code is not fully generated and is incorrect. Parts of the `Pacman` class aren't generated.
*Prompt:* From the code above, only show the Pacman class

- Asked to generate class Pacman separately and now code is syntactically correct.
- The code refers to Ghost class that is not defined anywhere.
- Nothing is being drawn.

## Step 3
*Problem:* Nothing is being rendered. `setup` function is referring to `Ghost` class that is not defined.

*Prompt:* `setup` function refers to `Ghost` that is not defined. Can you create a class for `Ghost`?

- Canvas was empty and the code is clearly missing the `Ghost` class, that we asked Gemeni to generate.
- Adding the newly generated `Ghost` class fixed the code and now we have at least maze and pacman visuals. 
- Ghosts aren't shown. Can't control pacman. No interactivity in general.

![Visuals after Step 3](/screenshots/step3.png)

## Step 4
*Problem:* Pacman doesn't respond to keyboard movements.
#### Prompt
Pacman is not moving. How is it supposed to be controlled and what is the problem with that code?

#### Reply (shortened)
 Missing getAngle function: The show method in the Pacman class references a getAngle function that's not defined. This function is likely used to determine the direction Pacman is facing to draw the mouth correctly.

Incomplete canMove function: The canMove function only defines the logic to get the grid coordinates of the intended move but lacks the actual collision check with walls. It needs to check if the corresponding grid position in grid is "WALL" to prevent movement.

Missing update loop: The draw function doesn't have a loop to continuously update the game state. This means Pacman's position and direction won't change between frames, making it seem like it's not moving.

#### Actions
- Adding `getAngle` function to `Pacman` class.
- Add wall checking logic to `canMove` method.
- Updated `draw` function doesn't have duplicated Ghost drawing rows.
- Newly added logic to `draw` related to `canMove` decisions is broken. Pacman is not rendered anymore.

## Step 5
*Problem:* Pacman stopped rendering as the result of the previous step.

#### Prompt
Rendering of pacman broke, what is wrong with canMove related logic in the `draw` function?

#### Answer (shortened)
The issue with the canMove related logic in the draw function is related to a variable typo. Here's the breakdown:

Typo in variable name: Inside the draw function, you're using gridy to access the grid array, but this variable isn't defined anywhere. It should be gridY which is correctly defined within the canMove function of the Pacman class.

Incorrect usage of gridY: The canMove function returns grid[gridy] && grid[gridy][gridX] !== "WALL". This checks if grid[gridy] exists (which might be undefined due to the typo) and then checks its element at gridX. However, within the draw function, you're only using gridY for the first check, but not for accessing the element within the grid.

#### Notes
Gemini generates code with errors. We saw code given unfinishes. Code referring to undefined classes and functions. Typos in variables, e.g. casing typos.

#### Actions
- Fix `gridy` typos that must be `gridY` in `Pacman.canMove`.

Pacman is rendered again. Ghost appears too.
Pacman moves up on arow key press, but not down or right.
Walls need fixing too, as Pacman position is inside the wall.

![Visuals after Step 5](/screenshots/step5.png)

## Step 6
*Problem:* Maze doesn't make sense and Pacman is positioned in the wall. Instead we want to have the classic level of 28x36 grid. Original tiles were 8x8 pixel, it's too small for modern screens, we can do 16x16 or 32x32.

#### Prompt
Modify `createGrid` function to generate the classical pacman level with the grid of 28x36.

#### Answer (shortened)
Here's the modified createGrid function to generate a classic Pacman level with a grid of 28x36:

<- code ->

This code defines an innerWalls array containing objects that specify coordinates for horizontal and vertical walls. The loop iterates through these objects and marks the corresponding cells in the grid with "WALL".

Note:
 - This is a basic example.

#### Actions
- Replace `createGrid()` with the newly generated code.

Rendering broke again.

## Step 7
*Problem:* Maze rendering broke.  It's not clear why Gemini insists on generating outer walls. Inner walls mix horizontal and vertical walls with different schemas.

#### Prompt
There is a problem in `createGrid` can you identify and fix it?

#### Answer (shortened)
The issue lies in the way the innerWalls array defines horizontal walls. Here's the breakdown:

Incorrect x-coordinate range for horizontal walls: The objects in the innerWalls array for horizontal walls define x1 and x2 to represent the starting and ending positions on the x-axis. However, these values should represent the column indexes in the grid, which range from 0 to width/cellSize - 1 (exclusive).
Currently, the code defines x2 as the ending position for drawing the wall. Since the loop iterates from x1 to x2 (inclusive), it will try to mark one extra cell beyond the intended end position  as "WALL" which might cause issues with rendering or collision detection.

Here's how to fix it:

<- code ->

By adjusting x2 in the horizontal wall definitions to be one less than the intended ending position, the loop will iterate up to the correct cell (inclusive), ensuring the wall is drawn within the grid boundaries.

#### Actions
- This is not the problem breaking rendering, but the fact `createGrid()` redefines the global `grid` variable. Asking again

#### Prompt
Why `createGrid` redefines `grid` that is already a global variable?

#### Answer (shortened)
You're right, redefining grid inside the createGrid function might be unnecessary and can be confusing. Here's why it happens and how to improve it:

JavaScript variable scope: JavaScript has two main variable scopes: global and local. Variables declared outside any function (like grid here) are globally accessible. Variables declared within a function are local to that function.

Reassignment vs. redeclaration: In the createGrid function, you're not technically redeclaring grid. You're assigning a new empty array to the existing grid variable. This effectively wipes out any previous content in grid.

There are two ways to improve this:

Option 1: Utilize existing grid variable directly:

<- code ->

This approach removes the line grid = []; and directly uses the grid variable within the function. Since grid is already defined globally, it's accessible within the function.

Option 2: Use a local variable within createGrid:

<- code ->

This approach defines a local variable localGrid within the function to build the grid. After the loop finishes creating the grid structure, it assigns the entire localGrid to the global grid variable.

Both approaches achieve the same functionality but with slightly different strategies for handling the grid data. Choose the one that you find clearer or more suitable for your code organization.

#### Actions
- Let's go with Option 2, but instead of assigning `grid = localGrid;` inside of it, lets ask `createGrid()` to return it.

#### Prompt
Modify Option 2 to return `localGrid` instead of assigning it to `grid` variable. Modify the call to `createGrid` to use that returned value.

#### Answer (shortened)
Here's the modified code utilizing Option 2 with createGrid returning the generated grid:

1. Modified createGrid function:

<- code ->

Instead of assigning the local grid to the global grid variable, the function now returns the localGrid using the return statement.

2. Modified call to createGrid:
   
<- code ->

In the setup function, the call to createGrid is used, and the returned value (the generated grid) is assigned to the global grid variable. This eliminates the need for direct assignment within the function.

This approach keeps the grid creation logic encapsulated within the createGrid function and separates it from modifying the global grid variable directly.

#### Action
- Rendering is still broken, because global `grid` is defined as a `const`. swithch it to `let` similar to `pacman` and `ghosts`. Now it does render.

Only outer walls are rendered correctly. Canvas and grid size didn't change and is still a square.

![Visuals after Step 7](/screenshots/step7.png)

## Step 8
*Problem:* Grid is still 10x10, not 28x36. Canvas size is not increased either.

#### Prompt
Change canvas size to accommodate the 28x36 grid with the cell size of 16 pixels.

#### Answer (shortened)
To accommodate a 28x36 grid with a cell size of 16 pixels, you'll need to adjust the canvas size in the setup function. Here's the modified code:
<- code ->

#### Notes
- cell size is hardcoded: `const gridWidth = 28 * 16;`
- It doesn't mention that `const cellSize = 40;` needs updating too, and thus all rendering is of size 40, not 16.

#### Prompt
Cells are still of size 40 pixels, not 16.  Help to update.

#### Answer (shortened)
You're right, the cells are still rendering at 40 pixels even though the canvas size is adjusted. The cell size is determined by how you draw elements within the grid. Here's how to fix it:

Update drawing functions: The size of the Pacman, ghosts, and potentially other elements in your code is likely defined based on the cell size. You need to update these drawing functions to use the actual cell size (16 pixels) instead of assuming it's the same as the canvas size.
Here are some examples:

Pacman:
<- code ->

#### Notes
- This is wrong. Gemini seem to forget about global `const cellSize = 40;` and instead suggests to hack Pacman and Ghost size ` this.size = cellSize - 5; // Update size based on actual cellSize (16)`

#### Prompt
Should I update the global cellSize instead?

#### Answer
No, it's generally better practice to avoid updating the global cellSize variable in this scenario. Here's why:

Maintainability: Using the actual cellSize (16) directly within the drawing functions makes the code clearer and easier to understand. It removes the need to mentally track the value of a global variable and its potential modifications throughout the code.

Flexibility: If you ever decide to change the cell size in the future, you only need to modify the value used within the drawing functions instead of updating a single global variable and potentially affecting other parts of the code unintentionally.

Encapsulation: Keeping the cell size definition within the context of the drawing functions promotes better encapsulation. Each function becomes more self-contained, relying on the provided cellSize value to draw elements correctly.

While there's nothing technically wrong with updating the global cellSize, the approaches mentioned above offer several advantages for code maintainability, flexibility, and clarity.

#### Notes
- This is plain wrong. Based on the original code generated. Gemini suggests to keep the original `40` that it came up with. Instead hack Pacman and Ghost. This doesn't solve the problem with wall sizes.
- I'm going to fix it myself as it's pretty obvious change.

![Visuals after Step 8](/screenshots/step8.png)

## Step 9
*Problem:* Only the outer walls are generated, not the inner ones.

#### Prompt
createGrid only generates the outer walls, but not the inner ones. Find and fix the problem there.

#### Answer (shortened)
The problem lies in the conditional statement within the loop that creates the outer walls in the createGrid function. Here's the breakdown:

Outer wall condition: The current condition checks if x === 0 || x === width / cellSize - 1 || y === 0 || y === height / cellSize - 1 to mark cells as "WALL" for the outer boundaries.

Inner walls not considered: This condition only checks the edges of the grid (based on cell size and canvas size). It doesn't account for any additional walls you might want to define within the grid itself.

Here's how to fix it:

Option 1: Modify the loop condition (less flexible):
<- code ->

This approach changes the condition to true to mark all cells as "WALL" initially. Then, you'll need to add another loop or logic specifically designed to define the inner walls and set their corresponding positions in the grid to "EMPTY".

Option 2: Use a separate loop for inner walls (more flexible):
<- code ->

This approach keeps the outer wall creation logic. Then, it introduces a separate loop that iterates through the innerWalls array (defined as before) to set the corresponding cells in the grid to "WALL".

Option 2 is generally preferred as it allows for more flexibility in defining the inner walls without affecting the outer wall creation logic.

#### Notes
- Option 1 is meaningless, broken logic and doesn't take the inner walls in account at all.
- Option 2 is exactly what the current broken logic does.

#### Prompt
Why innerWalls array mixes names, for example some elements use {y, x1, x2} names while the other use {y1,y2, x}?  Does it work correctly with the nested for loops operating on innerWalls.forEach?

#### Answer (shortened)
You're right, there's an inconsistency in the naming conventions used within the innerWalls array for defining walls. This inconsistency can lead to confusion and potential errors.

#### Notes
- While Gemini does claim inconsistency can be a problem, the newly generated code is exactly the same as it was before.

#### Prompt
Should innerWalls be split into 2 arrays, for horizontal and vertical walls,  and the forEach loops be modified accordingly?

#### Answer
Splitting the innerWalls array into separate arrays for horizontal and vertical walls is a good approach and can improve code organization and readability. Here's how to implement it:

1. Separate arrays:
<-code->
2. Modified forEach loops:
<-code->

The loops now iterate through the respective arrays and use consistent naming for the loop variables (y for horizontal walls and x for vertical walls) based on the wall type being processed.

Advantages:

Improved Readability: Separating walls by type makes the code easier to understand and maintain.
Flexibility: Adding or removing walls of a specific type becomes simpler as you only need to modify the corresponding array.
Maintainability: If the logic for processing horizontal and vertical walls differs, you can handle them within separate loops.
This approach provides a well-organized way to define and manage the inner walls in your Pacman level.

#### Notes 
- generated code uses `grid` not the `localGrid` we changed previously. This could be due to Gemini not knowing which option of the previous 2 we picked.
- The walls look nothing like the classic pacman level.


## Step 10

#### Prompt
Based on this picture of the classic Pacman game level, where walls are of blue color, generate the inner walls coordinates for `horizontalWalls` and `verticalWalls` arrays in our Pacman game.

#### Answer
Absolutely, based on a classic Pacman game level where walls are blue colored, here's a possible set of coordinates for the horizontalWalls and verticalWalls arrays:

Horizontal Walls (horizontalWalls array):
<-code->
Vertical Walls (verticalWalls array):
<-code (unfinished) ->

#### Notes
- Code was cut short. Had to ask to print the `verticalWalls` separately.
- Resulted walls have nothing in common with the level we need.
- Microsoft Copilot can't generate one either, replacing entries with comments, generating rows of different lenght and being in overall a waste of time.
- Remove all the generating logic and replace it with a static array representing the level.
- Replace "WALL" with 1
- Hand draw the level

## Step 11
*Problem:* Pacman doesn't go right.

#### Prompt
1. Pacman can move left, up and down, but doesn't move right. Fix it.
2. Is there a problem in `keyPressed()` function?

#### Notes:
- Gemini is unable to find the typo in "RIGHT_arrow". Let's fix it ourselves.

## Step 12
*Problem:* 
- Pacman doesn't align to the grid. It's shifted half a cell.
- Pacman's speed is too fast.

#### Prompt
Pacman moves too fast, how to make it move slower and smooth?

#### Answer
There are a couple of approaches you can take to make Pacman move slower and smoother in your Pacman game:

1. Timer-based Movement:
<- code ->
2. Animation Loop:
<- code ->

#### Prompt
Current logic in Pacman.move() makes Pacman move my a cell size. Make a better, more smooth per-pixel movement.

#### Answer
You're right, moving Pacman by a full cell size in each update can feel clunky. To achieve smoother per-pixel movement, we can leverage concepts like animation and frame rates. Here's an approach using requestAnimationFrame:

1. Update Pacman's Movement Speed:

Define a variable, for example, pacman.speed, to represent Pacman's movement speed in pixels per frame. A common starting point could be something like 2 pixels per frame.
2. Calculate Movement Distance:

Instead of directly moving Pacman by a full cell size, calculate the distance to move based on the speed and the time elapsed since the last update.
Here's an improved Pacman.move() function:
<- code ->

#### Notes
- `Pacman.move()` method is not being used.. It duplicates the logic in `draw()` function.
 
#### Prompt
I don't see the move() function being used anywhere. Is it correct?

#### Notes
- Gemini started refactoring code to use `pacman.direction` `"RIGHT"` etc. instead of the previous logic of `setDirection(x, y)` operating on `pacman.directionX` and `pacman.directionY`

#### Prompt
I don't see the move() function being used anywhere. Is it correct?

#### Prompt
There is already a method `setDirection(x,y)` under Pacman class. Should the pacman's `directionX` and `directionY` attributes be used instead of newly introduced `direction` attribute?

#### Answer (shortened)
You're absolutely right. It's better to leverage the existing setDirection(x, y) method and directionX and directionY attributes for Pacman's movement logic if they're already present in your codebase. Here's how to adapt the approach:

#### Notes
- `Pacman.move()` is still not used.

#### Prompt
Show me how to integrate `Pacman.move()` into the animation loop using `requestAnimationFrame`. Dose grid and ghost drawing need updating?

#### Notes
- It explains how to use `requestAnimationFrame` with the new `animate()` function that will call `Pacman.move()`.
- Not clear why do we need that `animate()` logic, if there is already the `draw()` function.

#### Prompt
How does the new `animate()` function relate to the existing `draw()` function that is responsible for drawing? Do we need to use both?

#### Notes
- While what Gemini describes with splitting `animate()` and `draw()` makes sense, the `draw()` is the p5s lib callback.

#### Prompt
Isn't our current `draw()` function part of p5js game library and that library calls it instead of us calling it directly?

#### Answer (shortened)
You're absolutely correct. I apologize for the confusion in the previous explanation.

In the context of p5.js, the draw() function is indeed a core function provided by the library.  Here's a more accurate explanation:

#### Notes
- The movement and drawing logic gets more and more entangled.

#### Prompt
Show me the overall `draw()` and the pacman's `move()` function.

#### Notes
- At this point Gemini starts going in loops and doesn't have a good history of our code. It started providing the general code that is a variatio of what it suggested initially.
- It's time to switch prompts to more precise and detailed ones. See if that can make some preogress.

#### Prompt
How does the `Pacman.move()` method is used with `Pacman.canMove(x,y)` method?

#### Prompt
The current `move()` function operated with x and y being the pixels of the top left corner of the pacman. This function uses `canMove(x,y)` function that checks if pacman can move into a new location not occupied by the wall declared in the `grid` array.  But it `canMove(x,y) only checks for the top left coordinates of pacman. Update `canMove` function to check all 4 corners.

#### Notes
- Lengthy reply is not that useful. It suggests doing 4 checks and OR-ing the checks, but that's what we already asked. The rest of code is useless restatements.
- A few more tries to generate `canMove` that checks all 4 corners results in bad code offsetting `gridX` and `gridY` instead of `x` and `y`
- Instead reuse the idea of top 4 corners, but have to implement it myself.

## Step 13
*Problem:* Pacman must not stop if keyboard command can't change that direction immidiately, but instead apply it at the next possibility.

#### Prompt
Already moving pacman stops if a new keyboard command points him into the wall. How does the `move()` `draw()` and `keyPressed()` functions need to change to ignore the change of direction if it's not possible at this moment?

#### Notes
- Gemini suggest to add "desired direction" that updates "direction" when pacman can move in the "desired" direction, but it's a faulty logic. 

#### Prompt
In the code above, while moving left the change in "desiredDirection" to go up will wrongly change the"pacmanDirection".

#### Notes
- Better, but with the repeating logic

#### Prompt
Good, but there is a repeating logic that can be factored out into a function. Is it worth doing that?

#### Prompt
Another problem is the code is missing the second check for `canMove` function. If else is executed no more collision check happens.

#### Notes
- Gemini keeps generating buggy code and have to be pointed out to fix it.

## Step 14
*Problem:* Ghosts aren't moving. Add the chasing logic. Also Pacman can't enter some of the tunnels.

#### Prompt
Ghosts aren't moving, add logic to chase Pacman.

#### Notes
- Gemini provides the "simple chase logic" to define the direction. Code is reasonable, but needs heavy adaption from the `Pacman.move()`. At the end the chase, though a simple one, works.

## Step 15
*Problem:* Simple chase logic is too simple. Can Gemini help us to build a smarter one from the classic implementation of Pacman?

#### Prompt
Can you provide a more complex chase logic that is used in real implementations of Pacman?

#### Answer
Absolutely! While the simple chase logic in the previous response provides a starting point, real Pacman implementations often utilize a combination of techniques for more interesting and challenging ghost behavior. Here's a breakdown of some common approaches:

1. Target Grid Approach:

Divide the maze into a grid of smaller cells.
For each ghost, define a target grid cell based on Pacman's current location or a predetermined pattern (e.g., scatter points).
The ghost uses a pathfinding algorithm (like A*) to find the shortest path to its target cell, avoiding walls.
2. Chasing Modes:

Implement different chasing modes for ghosts, like:
Chase Mode: Ghosts actively chase Pacman using the target grid approach.
Scatter Mode: Ghosts move away from specific scatter points in the maze (can be timed or triggered by Pacman's actions).
Frightened Mode: Ghosts become vulnerable and move randomly when Pacman eats a power pellet.
3. Field of View (FOV) Optimization:

Ghosts don't have complete knowledge of the entire maze.
Implement a limited field of view for each ghost, restricting their awareness of Pacman's location to nearby grid cells.
This can be achieved using techniques like raycasting or pre-calculated visibility maps.
4. Teaming and Cooperation:

In advanced versions, ghosts might collaborate.
For example, a chasing ghost might communicate Pacman's location to a strategically positioned ghost to cut him off.
Here's an example incorporating some of these ideas:
<-code->
Remember:

Replace the placeholder functions (getClosestPacmanCell, getScatterCell, findPath, getDirectionTowards) with your specific implementations based on your chosen pathfinding algorithm and FOV approach.
Adjust the chase threshold, ghost modes, and other parameters to fine-tune the ghost behavior for your game.

#### Prompt
Generate `getDirectionTowards` function for the code above

#### Notes
- Generates the "simple chase" approach similar to what we used before.

#### Prompt
Generate `findPath` function for the `ghostMove` function above.

#### Answer (shortened)
The findPath function in the context of Pacman ghost AI typically involves a pathfinding algorithm to find the shortest path from the ghost's current position to a target cell within the maze. Here's an example using a basic Breadth-First Search (BFS) approach:
<- code ->

#### Notes
- Need a helper function that will look at the grid to filter out the wall cells.

#### Prompt
Generate code for the `getValidNeighbors(x,y)` function that will look at the grid to avoid cells with walls.

#### Notes
- Great, we got something reasonably looking!
- Path finding functions use grid coordinates, while pacman anf ghost use canvas ones. Need a function to convert between them

#### Prompt
Create a function to convert from the canvas coordinates in pixels to cell coordinates in the grid.

#### Notes
- Since `Ghost.move()` method is a hack of several suggestions from Gemini, I had to patch it manually with proper conversions from the canvas coords into the grid coords using `canvasToGridCell()` Gemini just generated. Some hacking required to pass "cell" object instead Ghost or Pacman instances.
- Ghosts are shown and move, but the movement is cleary broken.
- At least nothing leads to code freezing.

## Step 16
*Problem:* Pacman is unable to enter some of the tunnels. This problem existed even before the addition of ghost logic. It's time to look at it, as it may affect the AI behind ghosts.

#### Prompt
Pacman can't turn into some of the paths. Look at the Pacman movement code and see if something is wrong there.

#### Answer (shortened)
Absolutely! Let's analyze the Pacman movement code to identify potential issues that might prevent him from turning into some paths:

Common Issues:

Collision Check Order:

Make sure the collision check happens after the desired direction change is applied to Pacman's position.
If the collision check is done before updating the position, it might prevent Pacman from entering a valid path even if the new position wouldn't lead to a collision.
Incomplete Collision Checking:

Ensure your canMove function considers all four corners of Pacman when checking for collisions with walls.
A simple check for the center of Pacman might miss collisions when entering narrow passages or making sharp turns.
Cell Snapping:

If you're using a cell-based approach for movement, there might be issues where Pacman's position gets snapped to the center of a cell after a movement update.
This can cause him to get stuck in corners or miss narrow paths if the snapping logic doesn't account for his desired direction.
Floating-Point Precision Errors:

Depending on how you calculate Pacman's movement based on speed and time, you might encounter floating-point precision errors.
These errors can lead to slight discrepancies between the intended movement and the actual position, potentially causing Pacman to miss some paths.
Code Review:

Here's a breakdown of some things to look for in your Pacman movement code:

#### Notes
- This is due to the `speed` variable set to 100. It causes Pacman to jam over the coordinates needed to enter the turn.

#### Promt
The problem happens due to the high speed value that causes pacman position to jump over the x,y coordinates corresponding to the wall opening cell. Suggest a code change to fix the problem.

#### Answer
Absolutely! You're right, a high speed value can cause Pacman to overshoot wall openings. Here's a code change to address this issue:

1. Movement Based on Cell Size:

Instead of directly calculating movement distances based on speed and time, we can tie the movement to the size of a cell in the grid. This ensures Pacman's movement aligns perfectly with the grid and avoids overshooting openings.

Here's an example code change:
<- code ->

2. Alternative: Snapping with Threshold

If directly calculating movement distances is preferred, you can implement a snapping mechanism with a threshold:
<- code ->

#### Notes
- Option 1 is a no go. It will make Pacman jump from cell to cell and will get in the way of animation, control etc. Won't work without some tricky animation based solutions on top.
- Option 2 with snapping to the grid should work. Let's try it.

#### Prompt
Factor out the snapping logic into a reusable function.

#### Notes
- Refactoring Gemini did is interesting: `function snapToCell(position, cellSize, threshold = 0.1 * cellSize) {` . `cellSize` is not used in the body of the function, only for the default value of `threshold`

#### Prompt
Do we need to pass `cellSize` to `snapToCell` function?

#### Answer (shortened)
You're right, there are ways to avoid passing cellSize to the snapToCell function every time. Here are two approaches:

1. Global Cell Size Variable:
2. Function Argument with Default Value:

#### Notes
- Gemini can't set it's mind on data structures. We have classes, array like objects representing x,y coords and the separate vars for x and y. Similar problem with canvas vs grid coords.
- It's easier to change `snapToCell()` to operate on one coordinate than return both. Have to change it manually, as it is getting messy with Gemini.
- there is a bug in `snapToCell` it only rounds within 1 pixel no matter how big is the threshold.

#### Prompt
Look at `snapToCell` function, it only snaps within 1 pixel no matter how big is the threshold. Fix it.

#### Prompt
This is still incorrect. the difference between a coordinate and it's rounded value is still within 1 pixel.

#### Prompt 
The problem is still there. We want to round 27 to 25, with the threshold of 0.5 and the cellSize 16

#### Prompt
We have to snap within half of the cell, which is 8 pixels. For example x=6 is snapped to x=0. x=22 is snapped to 24. Checking `Math.abs(position.x - Math.round(position.x))` is incorrect, as this difference is always within 1 pixel.

#### Notes
- Here I give up because Gemini is clearly unable to understand and fix the problem.
- Multiple other tests had shown Gemini really struggles with this kind of problems.

#### Prompt
Suggest optimization to this function.  It detects collisions of 4 corners of pacman with walls and creates false positives. Function:
<- code of canMove ->

#### Notes
- While suggestion to reduce 4 corner checks is valid. Optimization is buggy. Gemini wrongly implies there is a direction info in these 4 coordinates, while there is none and thus conditional checks are wrong.

#### Prompt
If I've implemented snapping to the grid, do I need to check all 4 corners of Pacman for collisions? If I do, modify this `canMove()` collision checker.
<- code of canMove ->

#### Answer
Yes, even with snapping to the grid, it's generally recommended to check all 4 corners of Pacman for collisions. Here's why:

1. Floating-point Precision Errors:
2. Sub-cell Collisions:
Modified canMove function:
<- code of canMove ->

#### Notes
- Gemini insists on the same buggy modification to `canMove()`.
- The problem withsnapping all coordinates is, when changing direction we aren't longer collide with the wall as the coordinates are snapped back into the current empry cell.

#### Prompt
Without adding snapping to the grid into `move()` method of Pacman, Pacman can't turn into some of the corridors. With added snapping, the coordinates that otherwise be inside the wall on a direction change are snapped back into the open cell creating a false positive directional change. Provide suggestions on how to fix the problem.

#### Answer
Here are a few approaches to fix this problem:

1. Pre-Turn Check:
<- code ->
2. Post-Turn Snap with Tolerance:
<- code ->
3. Directional Snapping:
<- code ->

#### Notes
- (1) doesn't solve the problem as without snapping and with 4 point check, to turn we'd have to have a perfect alignment of pacman with the corridor next to it. 1 point check bings us back to previous bugs.
- (2) doesn't work either, as it always snaps
- (3) a no go either
- It's gettting hard to make Gemini design a working approach with incrimental small movements of Pacman together with the snapping to grid. Let's try something different.

## Step 17
*Problem:* The maze is drawn over white background, that is visually distracting. Needs to be changed to black.

#### Prompt
How to change the background of an empty html page from white to black

#### Answer
There are two main ways to change the background of an empty HTML page from white to black:
1. Using CSS:
This is the most common and recommended approach. Here's how to do it.
<- code ->

## Step 18
*Problem:* It's time to host our Pacman game somewhere. Let's try Github pages.

#### Prompt
Give me step by step instructions on how can I host our pacman game on github pages

#### Notes
- Gemini instrictions + minor looksup of Github docs and it's live: https://bryndin.github.io/ai-coded-pacman/

## Step 19
*Problem:* Collisions and snapping is still broken.

#### Prompt
Pacman move logic has a collision problem. Suggest code modifications to resolve them.
In the 1move()` function below `desiredDirX` and `desiredDirY` are the new desired direction for Pacman, while `directionX` and `directionY` are the current movement direction,  each can take values of -1, 0, or 1. `canMove` function checks 4 corners of Pacman against the grid to know if there is a wall or open space.
<- code ->

#### Notes
- Gemini suggests pre-turn checks and making `canMove` check all 4 corners, that we already told it we do.

#### Prompt
My code already implements Option 1 and Option 2, and the collision issue is still there. Modify code to implement Option 3.

#### Notes
- Option 3 does a while loop moving Pacman "slower" not to overstep the tern. "slower" mins taking 0.1 of a step. This can still skip some pixels and lead to a missed turn.

#### Prompt
The snapTolerance can still be over 1 pixel in length and thus can overstep the exact location of a corridor. Why not make snapTolerance to be exactly 1 pixel?

#### Answer
You're right, setting snapTolerance to exactly 1 pixel can seem like a good solution to avoid overstepping the corridor boundaries. However, there are potential drawbacks to consider:

Grid Imperfections: Even with a perfect grid representation in your code, there might be slight rounding errors during calculations (especially when dealing with floating-point numbers) that could cause Pacman to miss the exact corridor center by 1 pixel. This can still lead to collisions or jittery movement.

Floating-Point Precision: Computers often represent numbers using floating-point arithmetic, which can introduce slight inaccuracies. Setting snapTolerance to 1 pixel might not guarantee perfect snapping due to these limitations.

Snapping Issues: With a 1-pixel tolerance, Pacman might get stuck in narrow corridors where the combined width of Pacman and the corridor walls is less than or equal to the sum of his size and the tolerance (e.g., Pacman size = 10 pixels, corridor width = 11 pixels, tolerance = 1 pixel). He wouldn't be able to move in either direction because snapping to the center would always cause a collision.

Alternatives to 1-Pixel Tolerance:

Lower Tolerance with Buffer: You can keep the tolerance slightly lower than 1 pixel (e.g., 0.9) to avoid overstepping corridor boundaries in most cases. Additionally, you can introduce a small buffer zone around corridor walls (e.g., 0.1 pixels) within which collisions are ignored. This allows for slight inaccuracies and smoother movement.

Raycasting: Implement a raycasting system to check for clear paths in the desired direction before attempting movement. This can provide more precise collision detection and avoid the need for snapping altogether.

Combined Approach: Consider a combination of pre-turn checks, a slightly lower tolerance for snapping, and a small buffer zone for smoother movement. This approach might offer a balance between accuracy and visual appeal.

Considerations:

Carefully test your chosen approach to ensure Pacman moves smoothly within corridors without getting stuck or exhibiting jittery behavior.
Adjust values like tolerance and buffer size based on your specific grid size, Pacman size, and desired movement feel.
Remember: There's no one-size-fits-all solution, and the best approach might depend on your game's specific requirements and desired gameplay experience.

#### Notes
- Putting ray tracing aside, we can try to eliminate floating points by working with integers only.

#### Prompt
At what rate does p5js lib calls the `draw()` function?

#### Notes
- Gemini tells us p5lib tries to draw at 60 fps. That can drop with complex animation or slow machines.

#### Prompt
Do we need the currentTime and deltaTime multipliers, given that p5lib tries to draw at 60 fps?

#### Prompt
If we remove that logic, we should be able to solve the collision problem if our grid cell size in pixels is divisible by the value of `this.speed` variable in the pacman coordinates calculation below. Is it correct? 

#### Answer (shortened)
Yes, you're absolutely correct! Removing the currentTime and deltaTime multipliers and ensuring the grid cell size is divisible by the speed value can potentially solve the collision problem in certain scenarios. 

#### Notes
- Lets leave the speed factor be divisible of the cell size for now. To keep it simple.

## Step 19
#### Prompt
Improve the following code and print the improved version

#### Answer
<- code (partial) ->
Improvements made include:

Constants are defined in uppercase to indicate that they are constants.
Switch statement is used in keyPressed function for better readability.
Code comments are added for clarity in certain sections.
Minor formatting adjustments for consistency and readability.
This revised version should be more organized, easier to read, and maintain.

#### Notes
- None of the LLMs where able to look at the file at github. Pasting the entire JS code only (partially) worked in ChatGPT, that was able to suggest a few minor improvements and printed the first part of the file back. So the other parts are probably were cut due to the token size.