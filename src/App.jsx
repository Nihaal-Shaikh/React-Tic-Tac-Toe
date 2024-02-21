import { useState } from "react"
import GameBoard from "./components/GameBoard"
import Player from "./components/Player"
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./winning-combinations";
import GameOver from "./components/GameOver";

const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2'
}

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

function deriveActivePlayer(gameTurns) {

  return gameTurns.length > 0 && gameTurns[0].player === 'X' ? 'O' : 'X';
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map(array => [...array])];

  for (const turn of gameTurns) {
      const { square, player } = turn;
      const { row, col } = square;
      
      gameBoard[row][col] = player;
  }

  return gameBoard;
}

function deriveWinner(gameBoard, players) {
  let winner;

  for (const combination of WINNING_COMBINATIONS) {

    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].col];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].col];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].col];

    if(firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol) {
      winner = players[firstSquareSymbol];
    }
  }

  return winner;
}

function App() {

  const [players, setPlayers] = useState(PLAYERS)
  const [gameTurns, setGameTurns] = useState([]);
  const activePlayer = deriveActivePlayer(gameTurns);
  const [currPlayerName, setCurrPlayerName] = useState();

  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;
  const [isEditing, setIsEditing] = useState(false);

  function handleEditClick(symbol, playerName) {
    setIsEditing(editing => !editing);

    if (isEditing) {
      handlePlayerNameChange(symbol, playerName);
    }
  }

  function handleSelectSquare(rowIndex, colIndex) {
    const currPlayer = deriveActivePlayer(gameTurns);
    const updatedTurns = [{ square: { row: rowIndex, col: colIndex }, player: currPlayer }, ...gameTurns];
    setGameTurns(updatedTurns);
  
    if (isEditing) {
      handleEditClick(updatedTurns[0].player, currPlayerName);
    }
  }
  

  function handleRestart() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers(prevPlayers => ({ ...prevPlayers, [symbol]: newName }));
  }

  return (
    <main>
      <div id="game-container">
      <ol id="players" className="highlight-player">
          {['X', 'O'].map(symbol => (
            <Player
              key={symbol}
              initialName={PLAYERS[symbol]}
              symbol={symbol}
              isActive={activePlayer === symbol}
              handleEditClick={activePlayer === symbol ? handleEditClick : undefined}
              isEditing={activePlayer === symbol ? isEditing : undefined}
              setTemp={activePlayer === symbol ? setCurrPlayerName : undefined}
            />
          ))}
        </ol>
        {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart} />}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  )
}

export default App
