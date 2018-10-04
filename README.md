## JQ | GAME | MazeCraze
`Jake Kaplan`
`Quinn Averill`

Include a brief summary of your project here.
Images are encouraged, along with concise, high-level text.

## How to play
First, create a username, and choose an avatar and an ability (currently the avatar and ability don't change the
game, but they will in the next iteration)

Then, you will be able to choose 3 options: Edit/Create Mazes, Singleplayer, and Multiplayer (multiplayer will be
introduced in the next iteration).

In Edit/Create Mazes, you will be able to create a new randomly generated maze, or create your own with the mouse.
You can also delete a maze, but you cannot delete the last maze! When creating a new maze, the randomly generated 
maze may not be solve-able, so make sure to edit it before playing it!

In Singleplayer mode, you can play the maze by yourself by tracing your mouse through the maze. Start is the top left
corner of the maze, and the end is the bottom right corner!

## Technical Achievements
- **Tech Achievement 1**: Shown in the react-app directory, the webapp uses React running on it's own server to 
                          serve pages to the browser instead of the node server.
- **Tech Achievement 2**: The Node server uses the module express to route each endpoint according to it's request method 
- **Tech Achievement 3**: The react app uses the module axios to make easy HTTP requests to the server instead of using xhr

### Design/Evaluation Achievements
- **Design Achievement 1**: The React app uses the React-Router module to route pages correctly, allowing the user of
                            the browser's back button and easy navigation throughout the app
- **Design Achievement 2**: The Node server uses a structured file system to organize the endpoints
- **Design Achievement 3**: The Node server has a logging method that logs each endpoint to the console
- **Design Achievement 4**: Added a Favicon to distinguish our app from every other open tab in your browser


OLD ACIEVEMENTWS FROM PROJECT 3
## Technical Achievements
- **Tech Achievement 1**: Using SQLite3 on Heroku (do not do this)
- **Tech Achievement 2**: Everything is made with D3, except for (most) of the XMLHttpRequests.
- **Tech Achievement 3**: Made swappable controllers for the maze board. Can click Edit/Play to entirely change how the mouse interaction works. 
- **Tech Achievement 4**: Even the Edit controller is attached to multiple events - users can either simply click to edit the board, or click AND drag.
- **Tech Achievement 5**: The play controller is state-aware. This is necessary to disallow the user from "skipping" through parts of the maze. This was accomplished with higher order functions
- **Tech Achievement 6**: Multiple pages for interacting with the same data at different levels. Seeing all mazes vs interacting with a specific one.

### Design/Evaluation Achievements
- **Design Achievement 1**: Imported an externally made svg graphic
- **Design Achievement 2**: Layout designed for mobile phones
- **Design Achievement 3**: Render the board with softened edges using filters
- **Design Achievement 4**: Multiple ways to interact with the board while editing. Added click and drag for convenience.
