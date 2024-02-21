import { useState } from "react";

export default function Player({ initialName, symbol, isActive, handleEditClick, isEditing, setTemp }) {

    const [playerName, setPlayerName] = useState(initialName);

    function handleChange(event) {
        setPlayerName(event.target.value);
        setTemp(event.target.value);
    }

    let editablePlayerName = <span className="player-name">{playerName}</span>;

    if(isEditing) {
        editablePlayerName = <input type="text" required value={playerName} onChange={handleChange} />;
    }

    return (
        <li className={isActive ? 'active' : undefined}>
          <span className="player">
            {editablePlayerName}
            <span className="player-symbol">{symbol}</span>
          </span>
          <button onClick={() => handleEditClick(symbol, playerName)}>{isEditing ? 'Save' : 'Edit'}</button>
        </li>
    );
}