const SelectFirstTurn=()=>{
    const randomInt = Math.floor(Math.random()*2)
    const firstTurn = randomInt===0?"AI":"Player"

    return firstTurn;
}

export default SelectFirstTurn;