
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function Game ({ socket, username, room }){
const defaultWidth = 10; 
const defaultHeight = 10;
const minSize = 5;
const maxSize = 30;
const nSquareToWin = 5;
function Square(props) {
  return (props.win) ? (
    <button className="square square-highlight" onClick={props.onClick}>
      {props.value}
    </button>
  ) : (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>  
  )  ;
}

function SquareRow(props)  {
    let squareRow =props.row.map((square, idx) => {
      let k = "s" + idx;
      let win = false;
      let winner = props.winner;
      let rowIdx = props.rowIdx;
      if (winner) {
        if (winner.direction === "ToRight" &&
          idx >= winner.x && idx <= winner.x + nSquareToWin - 1 && rowIdx === winner.y) {
            win = true;
        }
        if (winner.direction === "ToDown" &&
            rowIdx >= winner.y && rowIdx <= winner.y + nSquareToWin - 1 && idx === winner.x) {
            win = true;
        }
        if (winner.direction === "ToRightDown" &&
          idx >= winner.x && idx <= winner.x + nSquareToWin - 1 && idx - winner.x === rowIdx - winner.y) {
            win = true;
        }
        if (winner.direction === "ToLeftDown" &&
          idx <= winner.x && idx >= winner.x - nSquareToWin + 1 && winner.x - idx === rowIdx - winner.y) {
            console.log(winner.x+' '+winner.y+' '+idx+' '+rowIdx+' '+nSquareToWin);
            win = true;
        }
      }
      return (
        <Square win={win} value={square} onClick={() => props.onClick(props.rowIdx, idx)} key={k} />
      )
    })
    return (
      <div className="board-row">
        {squareRow}
      </div>
    )
  }
const Board =(props)=>{
  function renderSquare(i) {
    return (
      <Square
        value={props.squares[i]} 
        onClick={() => props.onClick(i)}
      />
    );
  }
  
    let board;
    board = props.squares.map((row, idx) => {
      let k = "r" + idx;
      return (
        <SquareRow winner={props.winner} rowIdx={idx} row={row} onClick={props.onClick} key={k}/>
      )
    })
    return (
      <div>
        {board}
      </div>
    );
  }
  
function Game1(props) {
      let tmpArr = Array(defaultHeight);
      for (let i = 0; i < defaultHeight; i++) {
        tmpArr[i] = Array(defaultWidth).fill(null);
      }
      
      const [ inputWidth, setInputWidth] =useState(defaultWidth)
      const [ inputHeight, setInputHeight] = useState(defaultHeight)
      const [width, setWidth] = useState(defaultWidth)
      const [height,setHeight] = useState(defaultHeight)
      const [history, setHistory]= useState([{
        squares: tmpArr,
        location: null,
      }])
      const [stepNumber, setStepNumber] = useState(0)
      const [xIsNext, setXIsNext ] = useState(true)
      const [isDescending, setIsDescending] = useState(true)

    const jumpTo=(step)=> {
        setStepNumber (step)
        setXIsNext ((step % 2) === 0)
      
    }
    const handleClick=(i, j)=> {
      const History = history.slice(0, stepNumber + 1);
      const current = history[stepNumber];
      const squares = current.squares.slice();
      current.squares.map((row, idx) => {
        squares[idx] = current.squares[idx].slice();
        return true;
      })
      if (calculateWinner(squares) || squares[i][j]) {
        return;
      }
      squares[i][j] = xIsNext ? 'X' : 'O';
    
      setHistory(history.concat([{
          squares: squares,
          location: {x: i, y: j}
        }]))
        setStepNumber( history.length)
        setXIsNext (!xIsNext)
      
    }
    const sort=()=> {
      setIsDescending(!isDescending);
    }
    const handleChangeWidth=(e)=> {
      const val = Number(e.target.value);
      setInputWidth(val);
      if (val >= minSize && val <= maxSize) {
        let tmpArr = Array(height);
        for (let i = 0; i < height; i++) {
          tmpArr[i] = Array(val).fill(null);
        }
          setWidth (val)
          setHistory ([{
            squares: tmpArr,
            location: null,
          }])
          setStepNumber (0)
          setXIsNext (true)
      }
    }
    const handleChangeHeight=(e)=> {
      const val = Number(e.target.value);
      setInputHeight( val);
      if (val >= minSize && val <= maxSize) {
        let tmpArr = Array(val);
        for (let i = 0; i < val; i++) {
          tmpArr[i] = Array(width).fill(null);
        }
        
          setHeight ( Number(val))
          setHistory( [{
            squares: tmpArr,
            location: null
          }])
          setStepNumber (0)
          setXIsNext ( true)
        
      }
    }
    
      
      const current = history[stepNumber];
      const winner = calculateWinner(current.squares);
  
      let moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move + ' (' + step.location.x + ',' + step.location.y + ')' :
          'Go to game start';
        return (stepNumber === move) ? (
          <li key={move}>
            <button className="btn-bold" onClick={() => jumpTo(move)}>{desc}</button>
          </li>
        ) : (
          <li key={move}>
          <button onClick={() =>jumpTo(move)}>{desc}</button>
        </li>
        );
      });
      if (!isDescending) {
        moves = moves.reverse();
      }
  
      let status;
      if (winner) {
        status = 'Winner: ' + winner.val;
      } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
      }
  
      let arrow = isDescending ? '↓' : '↑';
      return (<div>
        <div class="content">
          <div className="game-config">
            <span className="fixed-size">Chiều rộng:</span><input type="number" placeholder="Chiều rộng" value={inputWidth} onChange={handleChangeWidth} />
            <br />
            <span className="fixed-size">Chiều cao:</span><input type="number" placeholder="Chiều cao" value={inputHeight} onChange={handleChangeHeight} />
          </div>
          <div className="game">
            <div className="game-board">
              <Board
                squares={current.squares}
                onClick={(i, j) => handleClick(i, j)}
                winner={winner}
              />
            </div>
            <div className="game-info">
              <div>
                <button onClick={sort}>Thứ tự bước {arrow}</button>
              </div>
              <div>{status}</div>
              <ol>{moves}</ol>
            </div>
          </div>
        </div>
      </div>)
      }
ReactDOM.render(
  <Game1 />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  let win;
  for (let i = 0; i < squares.length; i++) {
    for (let j = 0; j < squares[i].length; j++) {
      //Kiểm trang NSquareToWin ô liên tiếp từ ô xuất phát sang phải, xuống góc phải dưới, xuống góc trái dưới
      //Nếu có NSquareToWin - 1 cặp liên tiếp giống nhau thì thắng
      //Direction: ToRight, ToRightDown, ToDown, ToLeftDown
      if (!squares[i][j]) continue;
      if (j <= squares[i].length - nSquareToWin) {
        win = true;
        for (let k = 0; k < nSquareToWin - 1; k++) {
          if (squares[i][j + k] !== squares[i][j + k + 1]) {
            win = false
          }
        }
        if (win) return {val: squares[i][j], x: j, y: i, direction: 'ToRight'};
      }
      if (i <= squares.length - nSquareToWin) {
        win = true;
        for (let k = 0; k < nSquareToWin - 1; k++) {
          if (squares[i + k][j] !== squares[i + k + 1][j]) {
            win = false
          }
        }
        if (win) return {val: squares[i][j], x: j, y: i, direction: 'ToDown'};
      }
      if (j <= squares[i].length - nSquareToWin && i <= squares.length - nSquareToWin) {
        win = true;
        for (let k = 0; k < nSquareToWin - 1; k++) {
          if (squares[i + k][j + k] !== squares[i + k + 1][j + k + 1]) {
            win = false
          }
        }
        if (win) return {val: squares[i][j], x: j, y: i, direction: 'ToRightDown'};
      }
      if (i <= squares.length - nSquareToWin && j >= nSquareToWin - 1) {
        win = true;
        for (let k = 0; k < nSquareToWin - 1; k++) {
          if (squares[i + k][j - k] !== squares[i + k + 1][j - k - 1]) {
            win = false
          }
        }
        if (win) return {val: squares[i][j], x: j, y: i, direction: 'ToLeftDown'};
      }
    }
  }

  return null;
}
}
export default Game;