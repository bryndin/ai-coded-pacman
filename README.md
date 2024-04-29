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
