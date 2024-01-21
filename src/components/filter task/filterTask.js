import React, { useState } from 'react'
import "./filterTask.css"

export default function FilterTask() {
    const [completedTaskBackgound, setCompletedTaskBackgound]=useState({backgroundColor:"rgb(32, 0, 128)", color:"white"})
    const [pendingTaskBackgound, setPendingTaskBackgound]=useState({backgroundColor:"transparent", color:"black"})
    function filterByCompletedTask(){
        setCompletedTaskBackgound({backgroundColor:"rgb(32, 0, 128)", color:"white"})
        setPendingTaskBackgound({backgroundColor:"transparent", color:"black"})
    }   
    function filterBYPendingTask(){
        setCompletedTaskBackgound({backgroundColor:"transparent", color:"black"})
        setPendingTaskBackgound({backgroundColor:"rgb(32, 0, 128)", color:"white"})

    }
  return (
    <div className='filter-container'>
        <button className='completed-task' style={completedTaskBackgound} onClick={filterByCompletedTask}>completed task</button>
        <button className='pending-task' style={pendingTaskBackgound} onClick={filterBYPendingTask}>pending task</button>
    </div>
  )
}
