import React, { useState, useEffect, useRef } from 'react'
import {getBuilds} from "../services/jenkinsProxy"
import "../css/radiator-cell.css"

const Job = (props) => {
  const refCellWidth = useRef(null);
  const [amountOfSquares, setAmountOfSquares] = useState(0)
  const [jenkinsBuilds, setJenkinsBuilds] = useState([])

  useEffect (() => {
    setAmountOfSquares(Math.round(refCellWidth.current.offsetWidth / 34));

    const handleResize = () =>{
      setAmountOfSquares(Math.round(refCellWidth.current.offsetWidth / 34))
    }

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)

  }, [refCellWidth]);

  useEffect(() => {
    if(amountOfSquares !== 0){
      getBuilds(props.jenkinsHost, props.jenkinsPort, `${props.jenkinsPath}/api/json?tree=allBuilds[url,result,id]{0,${amountOfSquares}}`, props.token)
        .then((response) => {
          if(response.allBuilds){
            setJenkinsBuilds(response.allBuilds)
          }
        })
    }
  },[amountOfSquares])

  let boxes = []
  const amountOfBoxes = Math.abs(amountOfSquares - (amountOfSquares - jenkinsBuilds.length))
  for (let i = amountOfBoxes - 1; i >= 0; i--) {
    if(typeof jenkinsBuilds[i] === "undefined"){
      break;
    }

    switch (jenkinsBuilds[i].result) {
      case "SUCCESS": {
        boxes = boxes.concat(<div key={i} className={"status-box"} style={{background: "royalblue"}}/>)
        break;
      }
      case "UNSTABLE":{
        boxes = boxes.concat(<div key={i} className={"status-box"} style={{background: "yellow"}}/>)
        break;
      }
      case "FAILURE":{
        boxes = boxes.concat(<div key={i} className={"status-box"} style={{background: "red"}}/>)
        break;
      }
      default:
        break;
    }
  }

  let latestStatusColor = null
  if(jenkinsBuilds.length !== 0){
    switch (jenkinsBuilds[0].result) {
      case "SUCCESS": {
        latestStatusColor = "blue"
        break;
      }
      case "UNSTABLE":{
        latestStatusColor = "orange"
        break;
      }
      case "FAILURE":{
        latestStatusColor = "firebrick"
        break;
      }
      default:
        latestStatusColor = "gray"
        break;
    }

  }

  if(props.draggable === undefined){
    return(
      <div className={"cell"} style={{background: latestStatusColor, margin: 5, flexGrow: props.grow || 1}}>
        <h2 className={"title"}>{props.name}</h2>
        <div className={"status-box-container"} ref={refCellWidth}>
          {boxes}
        </div>
      </div>
    )
  }

  return(
    <div ref={props.draggable.innerRef}
         {...props.draggable.draggableProps}
         {...props.draggable.dragHandleProps}
         className={"cell"}
         style={{background: latestStatusColor, margin: 5, flexGrow: props.grow || 1, ...props.draggable.draggableProps.style}}
    >
      <h2 className={"title"}>{props.name}</h2>
      <div className={"status-box-container"} ref={refCellWidth}>
        {boxes}
      </div>
    </div>
  )
}

export default Job;