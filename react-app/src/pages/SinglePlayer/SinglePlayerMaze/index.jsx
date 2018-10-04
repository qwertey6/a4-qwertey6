import React from 'react'
import * as d3 from "d3";
import axios from 'axios';

class SinglePlayerMaze extends React.Component {
  constructor(props){
    super(props);
  }


  render() {
    return <svg id={this.props.maze.id} className="PlayableMaze" width="100%" height="100%" ></svg>
  }

  componentDidUpdate(){
    console.log("SCRIPT LOADED");

    // the icon should be the node of the <g> of the shape.
    var player = {trail:[], icon:null, x:0, y:0, ability:null};
    //converts the board back into a server friendly string
    var alltiles = [];
    function getBoardState(){
      board.selectAll("rect").each(function(d){alltiles[d.x + d.y*16] = this})
      return  alltiles.map(function(d){return d.className.baseVal.includes("B")})
          .map(function(d){return d ? "B" : "W";}).join("");
    }
    function randbetween(lower, upper){
    	console.log(lower + (Math.random()*(upper-lower)))
    	return lower + (Math.random()*(upper-lower));
    }

    var tilehistory = [];// a list of recently visited tiles

    //Tile states: B=unnavigable W=navigable F=already navigated
    function MazeNavigationHandler(){
      return function(){
        if(tilehistory[0] == undefined){
          var firstTile = board.selectAll("rect").filter(function(d){return d.x+d.y ==0});//select the element at 0,0
          firstTile.attr("class", firstTile.attr("class").replace("W","F"));
          tilehistory.push(firstTile);

        }
        var curtile = d3.select(this);
        var prevtile =tilehistory[tilehistory.length-1];
        //only proceed if the currently moused over tile is adjacent to the previously selected tile:
        if(((curtile.datum().x == prevtile.datum().x-1) && (curtile.datum().y == prevtile.datum().y  )) ||
           ((curtile.datum().x == prevtile.datum().x+1) && (curtile.datum().y == prevtile.datum().y  )) ||
           ((curtile.datum().x == prevtile.datum().x  ) && (curtile.datum().y == prevtile.datum().y+1)) ||
           ((curtile.datum().x == prevtile.datum().x  ) && (curtile.datum().y == prevtile.datum().y-1))){
          
          console.log(curtile);
          //Do not do anything if the current tile's state is unnavigable
          if (curtile.attr("class") == "B"){return;}
          
          //If we are moving back a tile, unmark/unnavigate the previous tile
          if (curtile.attr("class") == "F"){
          	console.log(curtile.datum())
			d3player.transition()
					.attr("cx", randbetween(curtile.datum().x * w, (curtile.datum().x+1)*w)+"%")
					.attr("cy", randbetween(curtile.datum().y*h, (curtile.datum().y+1)*h)+"%")
					.duration(500);
            prevtile.attr("class", prevtile.attr("class").replace("F","W"));
            //then move our player into the tile

            if(tilehistory.length == 1){return;}//don't pop our origin
            tilehistory.pop();//remove the most recent tile from history
          }

          //If we are moving into a new, unnavigated tile, then set the previous tile to the new tile and navigate to it.
          if (curtile.attr("class") == "W"){
            curtile.attr("class", curtile.attr("class").replace("W","F"));
            tilehistory.push(curtile);//add the current tile to the top of our tile history
            d3player.transition()
					.attr("cx", randbetween(curtile.datum().x * w, (curtile.datum().x+1)*w)+"%")
					.attr("cy", randbetween(curtile.datum().y * h, (curtile.datum().y+1)*h)+"%")
					.duration(500);
            if(curtile.datum().x == 15 && curtile.datum().y == 15){
              alert("Winrar is you!")
            }
          }
        }
      }
    }

    var width  = 100;
    var height = 100;
	var h = height/16;//tile height
	var w = h

    //M var menu = d3.select("svg");

    var board = d3.select("svg").append("g").attr("class","board");
    var handler = MazeNavigationHandler();//set 1 handler to handle all mouse over events
    var d3player = d3.select("svg").append("circle"); //we append the player here, so that the player is always above the board
    d3player.attr("fill", "red")
    		.attr("r", width/16/2)
    		.attr("cx", w/2+"%")
    		.attr("cy", h/2+"%");

    axios.get('/mazes/'+this.props.maze.id)
      .then(res => {
        console.log(res.data);
        var data = res.data;


        for(var i=0; i<16; i++){//load columns
          for(var j=0; j<16; j++){//load rows
            var tile = data.maze[16*i + j];

            board.append("rect")
              .data([{x:j, y:i, state:tile}])
              .attr("width", w+"%")
              .attr("height", h+"%")
              .attr("x", (w*j) +"%")
              .attr("y", (h*i) +"%")
              .attr("class", tile)
              .on("mouseover", handler)
        }
      }
    })

    d3.select("body")
    	.on("keydown", function() {
			let key = d3.event.keyCode;
			/*
			37 - left
			38 - up
			39 - right
			40 - down
			*/
			switch(key){
				case 37:
					break;
				case 38:
					break;
				case 39:
					break;
				case 40:
					break;
    		}
	})
}
}
export default SinglePlayerMaze
