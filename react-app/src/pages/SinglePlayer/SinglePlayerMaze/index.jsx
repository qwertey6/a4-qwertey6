import React from 'react'
import * as d3 from "d3";
import axios from 'axios';
import { NotificationManager } from 'react-notifications';

class SinglePlayerMaze extends React.Component {
	constructor(props){
		super(props);
	}


	render() {
		return <svg id={this.props.maze.id} className="PlayableMaze" width="100%" height="100%" ></svg>
	}

	componentDidMount() {
		this.playableMazeScript()
	}

	componentDidUpdate(){
		this.playableMazeScript()
	}

	playableMazeScript(){
		console.log("SCRIPT LOADED");

		/*THE GAME PROCEEDS IN STEPS: MOVE, ABILITY, REPEAT
		*/
		const SLIME_MAX_LENGTH = 5;
		const SLIME_PENALTY = 300;//make moves take longer if the player is on a slime tile
		const PLAYER_MOVE_SPEED = 200;//200ms per move
		/* An ability's type is one of:
			dig
			*slime
			*stun
			*...
			*...
			or null
		*/
		function abilityHandler(p){
			if(p.use_ability == true){// only use their ability if this player has activated their ability
				p.use_ability = false;//mark that we have used up this player's ability for this "turn"
				switch(p.ability){//switch onto the right ability to use
					case "dig":
					//console.log("digging")
						let digTile = getTile(p.x+p.dx, p.y+p.dy);//select the element where the player is trying to move
						if(digTile == false){return;}
						if(!digTile.node().className.baseVal.includes("B")){return;}//if we have not selected any tile, then the player is likely trying to dig out of the maze, so exit

						let updated_digTileDatum = digTile.datum();
						updated_digTileDatum.health -= 0.31;
						if(updated_digTileDatum.health <= 0.1){
							digTile.attr("opacity", 1)
									.attr("class", digTile.attr("class").replace("B", "W"));
									return;
						}
						//console.log(digTile.datum());
						digTile.datum(updated_digTileDatum);//update the data of the dug tile to reflect the reduced health
						digTile.attr("opacity", function(d){return d.health;});
						//console.log(digTile.datum());
						break;
					case "slime":
						// TODO : Implement the slime ability
						
						p.trail.push({x:p.x, y:p.y});
						if(p.trail.length > SLIME_MAX_LENGTH){
							p.trail = p.trail.slice(1);
						}
						
						let pslime = slimes.selectAll("rect").filter(".p"+players.indexOf(player))
							.data(p.trail);

						pslime.attr("x", function(d){return (d.x * w + w/4) +"%";})
							.attr("y", function(d){return (d.y * h + h/4) +"%";});

						pslime.enter()
							.append("rect")
							.attr("class", "p" + players.indexOf(p))
							.attr("width" , w/2 + "%")
							.attr("height", h/2 + "%")
							.attr("x", function(d){return (d.x * w + w/4) +"%";})
							.attr("y", function(d){return (d.y * h + h/4) +"%";})
							.attr("fill", "red")
							.attr("opacity", 0.25);


						break;
					case "stun":
						// TODO : Implement the stun ability
						break;
				}
			}
		}
		// This function is Omega(#players * 5)
		function isSlimed(x,y){
			for(let p of players){
				if(p.ability == "slime"){
					for(let tile of p.trail){
						if(tile.x == x && tile.y == y){
							return true;
						}
					}
				}
			}
			return false;
		}
		// the icon should be the node of the <g> of the shape.
		// dx/dy is the direction the player is moving in. This is used to figure out how to update x/y, or which direction to use the ability in (for dig)
		//update is set to true whenever the player performs an action, and set to false at the end of the action. This is used for multiplayer event handling
		//converts the board back into a server friendly string
		var alltiles = [];
		function getBoardState(){
		  board.selectAll("rect").each(function(d){alltiles[d.x + d.y*16] = this})
		  return  alltiles.map(function(d){return d.className.baseVal.includes("B")})
		      .map(function(d){return d ? "B" : "W";}).join("");
		}
		function randbetween(lower, upper){
			return lower + (Math.random()*(upper-lower));
		}

		var tilehistory = [];// a list of recently visited tiles

		function getTile(x,y){
			let t = board.selectAll("rect").filter(function(d){return d.x == x && d.y == y});
			if(t.node()){
				return t;
			}else{
				return false;
			}
		}

		//Tile states: B=unnavigable W=navigable F=already navigated
		function playerHandler(){
			return function(){
				for (let p of players){ //this function iterates over all players and updates them if they need updating
					if(!p.update){continue;}//only update the player if the player has performed an action
					p.update = false;//then mark that we have handled this action
					let update_pos = false;//whether to update the player position at the end of this turn.
					if(p.ability == "dig" || p.ability == "slime"){p.use_ability = true;}//if the player's ability is digging or sliming, then try to dig/slime at every step
					let curtile = getTile(p.x + p.dx, p.y+p.dy);
					let prevtile = getTile(p.x, p.y);
					let slimed = isSlimed(p.x, p.y) || isSlimed(p.x + p.dx, p.y + p.dy);

					if(curtile){
						switch(curtile.attr("class")){
							//Do not do anything if the current tile's state is unnavigable
							case "B":
								update_pos = false;
								break;
							
							//If we are moving back a tile, unmark/unnavigate the previous tile
							case "F":
								d3player.transition() // TODO :: USE THE p.icon ATTRIBUTE OF OUR PLAYER!!!
										.attr("cx", randbetween(curtile.datum().x*w, (curtile.datum().x+1)*w)+"%")
										.attr("cy", randbetween(curtile.datum().y*h, (curtile.datum().y+1)*h)+"%")
										.duration(PLAYER_MOVE_SPEED + SLIME_PENALTY*slimed);
								prevtile.attr("class", prevtile.attr("class").replace("F","W"));
								update_pos = true;
						  		break;

							//If we are moving into a new, unnavigated tile, then set the previous tile to the new tile and navigate to it.
							case "W":
								curtile.attr("class", curtile.attr("class").replace("W","F"));
								d3player.transition()
										.attr("cx", randbetween(curtile.datum().x * w, (curtile.datum().x+1)*w)+"%")
										.attr("cy", randbetween(curtile.datum().y * h, (curtile.datum().y+1)*h)+"%")
										.duration(PLAYER_MOVE_SPEED + SLIME_PENALTY*slimed);
								if(curtile.datum().x == 15 && curtile.datum().y == 15){
                  NotificationManager.success('You beat the maze!')
								}
								update_pos = true;
								break;
							default:
								console.log("UNKNOWN TILE TYPE/CLASS - MUST BE ONE OF 'B'/'W'/'F'");
								break;
						}
					}
					//console.log(player);
					abilityHandler(p);
					if(update_pos){
						p.x += player.dx;//finish the move by updating the player's location/movement states for the next turn IFF the player made a valid move
						p.dx = 0;
						p.y += player.dy;
						p.dy = 0;
					}
				}
			}
		}

		var width  = 100;
		var height = 100;
		var h = height/16;//tile height
		var w = width/16;

		//M var menu = d3.select("svg");
		var player = {trail:[], icon:null, x:0, y:0, ability:"slime", use_ability:false, dx:0, dy:0, update:false, name:"name"};

		var board = d3.select("svg").append("g").attr("class","board");
		var handler = playerHandler();//MazeNavigationHandler();//set 1 handler to handle all mouse over events
		var d3player = d3.select("svg").append("circle"); //we append the player here, so that the player is always above the board
		var slimes = d3.select("svg").append("g").attr("class","slime");
		var players = [];
		players.push(player);

		d3player.attr("fill", "red")
				.attr("r", width/16/2)
				.attr("cx", w/2+"%")
				.attr("cy", h/2+"%");

		player.icon = d3player;//set the player's icon to the d3player node

		axios.get('/mazes/'+this.props.maze.id)
		  .then(res => {
		    console.log(res.data);
		    var data = res.data;


			for(var i=0; i<16; i++){//load columns
				for(var j=0; j<16; j++){//load rows
					let tile = data.maze[16*i + j];

					board.append("rect")
						.data([{x:j, y:i, state:tile, health:1, slimed:false}])
						.attr("width", w+"%")
						.attr("height", h+"%")
						.attr("x", (w*j) +"%")
						.attr("y", (h*i) +"%")
						.attr("class", tile)
						//.on("mouseover", handler)
				}
			}
		})

		d3.select("body")
			.on("keyup", function() {
				let key = d3.event.keyCode;
				//console.log(key);
				/*
				37 - left
				38 - up
				39 - right
				40 - down
				32 - ability
				*/
				//player = {trail:[], icon:null, x:0, y:0, ability:null, use_ability:false, dx:0, dy:0, update:0};
				switch(key){
					case 32:
						player.use_ability = true;
						break;
					case 37:
						player.dx = -1;
						player.dy = 0;
						player.update = 1;
						break;
					case 38:
						player.dx = 0;
						player.dy = -1;
						player.update = 1;
						break;
					case 39:
						player.dx = 1;
						player.dy = 0;
						player.update = 1;
						break;
					case 40:
						player.dx = 0;
						player.dy = 1;
						player.update = 1;
						break;
				}
				transmit(player);// send our move to the server
				handler();
				//after updating our player object, we can call the movement handler on it.
		})
		function transmit(p){
			//todo: implement sending the player object to the server somehow
		}
	}
}

export default SinglePlayerMaze
