import React from 'react';
import './App.css';
import Block from './Block';
import style from './style.module.css';
import _ from 'lodash';

class App extends React.Component {

  state = {
    board: [],
    result: ''
  }

  // Construct an empty board filled with '-'
  constructBoard = (mark) => {
    let board = [];
    for (let row = 0; row < 3; row++) {
      board.push([]);
      for (let col = 0; col < 3; col++) {
        // id is a unique key for React to render each component 
        board[row].push({id: [row,col], mark: mark});
      }
    }
    return board;
  }

  handleClick = (id) => {

    // Get the location clicked 
    let row = id[0], col = id[1];  

    // Check if clicking on any exisiting marks
    if (this.state.board[row][col].mark !== '-') {
      alert("Illegal move!");
      return;
    }

    // Check if the game has ended
    if (this.state.result !== '') {
      alert("Please reset the game!");
      return; 
    }
    
    // Deep clone the state object to avoid mutating the state 
    let updatedTable = _.cloneDeep(this.state.board);
    
    // Human play
    updatedTable[row][col].mark = 'X';

    // Check if human wins 
    let result = this.checkWhoWin('human', updatedTable);

    // If human win or tie, update the board and end the game
    if (result !== '') {
      this.setState({board: updatedTable, result: result});
      return;
    } 

    // If human didn't win, computer plays 
    this.aimove(updatedTable);

    // Check if computer wins or tie
    result = this.checkWhoWin('computer', updatedTable);
    if (result !== '') {
      this.setState({board: updatedTable, result: result});
      return;
    }

    // If no one wins, just update the board
    this.setState({board: updatedTable});
  }

  // Return the string containing player's name and result 
  checkWhoWin = (player, board) => {
    if (this.hasWinCondition(board)) {
      return `${player} win!`;
    } else if (this.isFull(board)) {
      return 'Tie!';
    }
    return '';
  }

  // Computer makes the best move
  aimove = (board) => {
    let maxScore = -Infinity;
    let bestMove = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col].mark === '-') {
          // Assume computer puts the mark here
          board[row][col].mark = 'O';

          // By recursively generating each possible future moves,
          // we evaluate the move we just made by calculating a score 
          let score = this.computeScore('O', board);
      
          // If this move has the highest score so far, this is the best move so far
          // update the max score 
          if (score > maxScore) {
            maxScore = score;
            // Update the location for the current best move 
            bestMove = [row, col];
          }
          // Unplace the mark and keep searching for the best move
          board[row][col].mark = '-';
        } 
      }
    }
    // Make the best move and return the board  
    board[bestMove[0]][bestMove[1]].mark = 'O';
  }

  computeScore = (player, board) => {
      let maxScore = -Infinity;
      // If the current board has a win condition, this is a good move
      if (this.hasWinCondition(board)) return 1;

      // If the current board is full, this is a tie
      if (this.isFull(board)) return 0;

      // Switch player 
      player = player === 'O' ? 'X': 'O';

      // Recursively calculate the opponent's best move 
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (board[row][col].mark === '-') {
            board[row][col].mark = player;
            let score = this.computeScore(player, board);
            if (score > maxScore) {
              maxScore = score;
            }
            board[row][col].mark = '-';
          } 
        }
      }
      return maxScore * (-1);
  }

  // Check for all possible win condition 
  hasWinCondition = (board) => {
    for (let i = 0; i < 3; i++) {
      if ((board[i][0].mark !== '-') && 
          (board[i][0].mark === board[i][1].mark) && 
          (board[i][1].mark === board[i][2].mark)) 
      return true;
    }

    for (let i = 0; i < 3; i++) {
      if ((board[0][i].mark !== '-') && 
          (board[0][i].mark === board[1][i].mark) && 
          (board[1][i].mark === board[2][i].mark)) 
      return true; 
    }

    if (((board[0][0].mark !== '-') && 
      (board[0][0].mark === board[1][1].mark) && 
      (board[1][1].mark === board[2][2].mark)) ||
      ((board[0][2].mark !== '-') && 
      (board[0][2].mark === board[1][1].mark) && 
      (board[1][1].mark === board[2][0].mark)))
      return true;
    return false;
  }

  // Check if the board is full of marks
  isFull = (board) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j].mark === '-') return false;
      }
    }
    return true;
  }

  // Reset the whole board 
  handleReset = () => {
    this.setState({board: this.constructBoard('-'), result: ''})
  }

  componentDidMount() {
    this.setState({board: this.constructBoard('-')});
  }

  render() {
    // Render the whole board
    let board = this.state.board;
    let rows = board.map((row) => {
      let col = row.map((block) => {
        return <Block clicked={() => this.handleClick(block.id)} mark={block.mark} key={block.id}></Block>
      })
      return col
    })
    
    return (
      <div className="App">
        <h1>Let's play Tic Tac Toe!</h1>
        <button onClick={this.handleReset}>Reset Game</button>
        <div className={style.board}>
           {rows}
        </div>
        {this.state.result}
      </div>
    );
  }
}

export default App;
