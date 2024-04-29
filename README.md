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