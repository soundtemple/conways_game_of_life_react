import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import _ from "underscore";
// import game_of_life from "./game_of_life.js";

const columns = 80;
const rows = 20;
var regen;
var board = [];
var genWeighting = 0.05;
var neighbours = [-1, 1, columns, -columns, columns - 1, columns + 1, -columns + 1, -columns - 1];

class CellGrid extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      board
    }
  }
  // // Method in a class syntax
  cellState(index) {
    var cellClass;
    console.log("this function was called!");
    board[index] > 0 ? cellClass = "cell-live" : cellClass = "cell-dead";
    this.setState({
      cellClass: cellClass,
    });
  }

  render() {
    console.log(this.state);
    return (
      <div className="cell-grid">
        {_.range(20).map(function(elem, rowNum) {
          var rowId = 'row' + rowNum;
          return (
            <div className="row" id={rowId}>
              {_.range(80).map(function(elem, cellNum) {
                var cellId = 'cell' + ((rowNum * columns) + cellNum);

                return (
                  <div className="cell-live" id={cellId}>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    console.log(this);
    return (
      <div className="container">
        <div className="logo">
          <h1>{this.props.name} Conways Game of Life</h1>
        </div>
        <div className="board">
          <CellGrid />
        </div>
        <div className="game-controls">
          <button onClick={gameStart} type="button" id="start-gen">Generate</button>
          <button onClick={gameStop} type="button" id="stop-gen">Stop</button>
        </div>
      </div>
    );
  }
}


ReactDOM.render(
  <Game name="Tim"/>,
  document.getElementById('app')
);


// initialise board. create array and with values 0 or 1 for on/off
function initBoard(columns, rows) {
  var cellNum = 0;
  while (cellNum < (columns * rows)) {
    board.push(initCell());
    cellNum += 1;
  };
}

initBoard(columns, rows);

// set init cell to On or Off. Weighted to Off for better genreation results
function initCell() {
  return Math.random() < genWeighting ? 1 : 0;
}


// ------- NEW GENERATION -----------
// generate new tick of board.
// get cell score based on neighbour statuses (checkNeighbours)
// Get new cell state based on score (newCellState)
function newGeneration() {
  var cellScore, cellState;
  var newBoard = [];
  board.forEach(function (elem, index) {
    cellScore = checkNeighbours(index);
    cellState = newCellState(index, cellScore);
    newBoard.push(cellState);
  });
  board = newBoard;
  console.log(board);
}

// Checking each neighbour state. Tabulate a score
function checkNeighbours(currentCell) {
  var cellScore;
  var cellTotal = 0;
  neighbours.forEach(function (neighbour) {
    // Account for neighbours outside the array range
    isNaN(board[currentCell + neighbour]) ? cellScore = 0 : cellScore = board[currentCell + neighbour];
    cellTotal += cellScore;
  });
  return cellTotal;
}

// Cell dies unless neighbour score is 2-3 OR dead cell has neighbour score ==3
function newCellState(currentCell, cellScore) {
  var newCellState = 0;
  cellScore === 2 || cellScore === 3 && board[currentCell] ? newCellState = 1 : newCellState = 0;
  if (cellScore === 3 && board[currentCell] === 0) newCellState = 1;
  return newCellState;
}




// game controls
function gameStart() {
  regen = setInterval(function () {newGeneration()}, 500);
}

function gameStop() {
  clearInterval(regen);
}
