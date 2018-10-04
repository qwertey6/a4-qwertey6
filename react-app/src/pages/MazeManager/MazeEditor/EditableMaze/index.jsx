import React from 'react'
import * as d3 from "d3";
import axios from 'axios';
import './editableMaze.css'

class EditableMaze extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return <svg id="editable-maze-svg" className="EditableMaze" ></svg>
  }

  componentDidMount() {
    this.editableMazeScript()
  }

  componentDidUpdate(){
    this.editableMazeScript()
  }

  editableMazeScript() {
    console.log("SCRIPT LOADED");

    //converts the board back into a server friendly string
    function getBoardState(){
      var alltiles = [];
      board.selectAll("rect").each(function(d){alltiles[d.x + d.y*16] = this})
      return  alltiles.map(function(d){return d.className.baseVal.includes("B")})
        .map(function(d){return d ? "B" : "W";}).join("");
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
        if  (((curtile.datum().x == prevtile.datum().x-1) && (curtile.datum().y == prevtile.datum().y  )) ||
          ((curtile.datum().x == prevtile.datum().x+1) && (curtile.datum().y == prevtile.datum().y  )) ||
          ((curtile.datum().x == prevtile.datum().x  ) && (curtile.datum().y == prevtile.datum().y+1)) ||
          ((curtile.datum().x == prevtile.datum().x  ) && (curtile.datum().y == prevtile.datum().y-1))){

          console.log(curtile);
          //Do not do anything if the current tile's state is unnavigable
          if (curtile.attr("class") == "B"){return;}

          //If we are moving back a tile, unmark/unnavigate the previous tile
          if (curtile.attr("class") == "F"){
            prevtile.attr("class", prevtile.attr("class").replace("F","W"));
            if(tilehistory.length == 1){return;}//don't pop our origin
            tilehistory.pop();//remove the most recent tile from history
          }

          //If we are moving into a new, unnavigated tile, then set the previous tile to the new tile and navigate to it.
          if (curtile.attr("class") == "W"){
            curtile.attr("class", curtile.attr("class").replace("W","F"));
            tilehistory.push(curtile);//add the current tile to the top of our tile history
            if(curtile.datum().x == 15 && curtile.datum().y == 15){
              alert("Winrar is you!")
            }
          }
        }
      }
    }

    var width  = 100;
    var height = 100;

    //M var menu = d3.select("svg");

    var board = d3.select("svg").append("g").attr("class","board");
    var handler = MazeNavigationHandler();//set 1 handler to handle all mouse over events

    axios.get('/mazes/'+this.props.maze.id)
      .then(res => {
        console.log(res.data);
        var data = res.data;
        var h = height*0.5/16;//tile height
        var w = h


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
              .on("mouseover", function(d){
                var mouse = d3.event;
                console.log(mouse.buttons);
                if (mouse.buttons>0) {
                  if(d.state == "B"){
                    d.state = "W";
                    d3.select(this).attr("class", "W");
                  }else{
                    d.state = "B";
                    d3.select(this).attr("class", "B");
                  }
                }
              })
              .on("click", function(d){
                if(d.state == "B"){
                  d.state = "W"
                  d3.select(this).attr("class", "W");
                }else{
                  d.state = "B"
                  d3.select(this).attr("class", "B")
                }
              })
          }
        }
      });
  }
}

export default EditableMaze
