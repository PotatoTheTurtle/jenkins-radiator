import React, { useState, useEffect, useRef } from 'react'
import "./css/radiator-cell.css"

const Job = (props) => {
  const refCellWidth = useRef(null);
  const [amountOfSquares, setAmountOfSquares] = useState(0)

  useEffect ( () => {
    setAmountOfSquares(refCellWidth.current.offsetWidth / 34);
  }, [refCellWidth]);

  const StatusBoxes = () =>{
    let boxes = []
    for (let i = 0; i < amountOfSquares; i++) {
      boxes = boxes.concat(<div className={"status-box"} style={{background: props.status || "gray"}}/>)
    }
    return boxes
  }

  return(
    <div className={"cell"} style={{background: props.color || "blue", margin: 5, flexGrow: props.grow || 1, order: props.order}}>
      <h2 className={"title"}>{props.text}</h2>
      <div className={"status-box-container"} ref={refCellWidth}>
        <StatusBoxes/>
      </div>
    </div>
  )
}

export default Job;