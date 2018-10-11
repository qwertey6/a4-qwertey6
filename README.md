## JQ | GAME | MazeCraze
`Jake Kaplan`
`Quinn Averill`

MAZE CRAZE is an online game where you can play, edit, and delete mazes which other players create!
Available at TODO

## How to play
First, create a username, and choose an avatar and an ability (currently the avatar and ability don't change the
game, but they will in the next iteration)

Then, you will be able to choose 3 options: Edit/Create Mazes, Singleplayer, and Multiplayer

In Edit/Create Mazes, you will be able to create a new randomly generated maze, or create your own with the mouse.
You can also delete a maze, but you cannot delete the last maze! When creating a new maze, the randomly generated 
maze may not be solve-able, so make sure to edit it before playing it!

In Singleplayer mode, you can play the maze by yourself by tracing your mouse through the maze. Start is the top left
corner of the maze, and the end is the bottom right corner!

In Multiplayer mode, you can join a maze's lobby and play against other players in real time!
Race against eachother, and try to beat the maze's high score!


## Technical Achievements
- **Tech Achievement 1**: Our node server and react client both use socket.io to communicate with eachother.
The client can reach out to the server, and the server can reach out to the client withouth needed to make an http request.
This is the core technology that made multiplayer possible.
- **Tech Achievement 2**: The front end uses various chained methods of timing the player turns, and is easily modifiable to balance the game
- **Tech Achievement 3**: The front end allows players to pick their own icon, using nested SVG's and css translate(..)rotate(..)s to calculate positioning

### Design/Evaluation Achievements
- **Design Achievement 1**: The react app uses the react-notifications module to present
elegant notifications to the user in response of their actions.
- **Design Achievement 2**: The react app uses the react-loading module to present an animation for waiting when joining
a lobby
- **Design Achievement 3**: The react app uses the reat-tooltip to display information on hoover of certain items.


##OLD ACHIEVEMENTS FROM PROJECT 4
## Technical Achievements
- **Tech Achievement 1**: Shown in the react-app directory, the webapp uses React running on it's own server to 
                          serve pages to the browser instead of the node server.
- **Tech Achievement 2**: The Node server uses the module express to route each endpoint according to it's request method 
- **Tech Achievement 3**: The react app uses the module axios to make easy HTTP requests to the server instead of using xhr
- **Tech Achievement 4**: The react app delivers d3 to the front end, which handles all of the in-board interactions/

### Design/Evaluation Achievements
- **Design Achievement 1**: The React app uses the React-Router module to route pages correctly, allowing the user of
                            the browser's back button and easy navigation throughout the app
- **Design Achievement 2**: The Node server uses a structured file system to organize the endpoints
- **Design Achievement 3**: The Node server has a logging method that logs each endpoint to the console
- **Design Achievement 4**: Added a Favicon to distinguish our app from every other open tab in your browser

