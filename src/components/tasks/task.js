import React, { useRef, useState } from 'react'
import "./task.css"
import { getDatabase, ref, remove, update } from 'firebase/database'
import { IoMdDoneAll } from "react-icons/io";
import { FcUndo } from "react-icons/fc";
import { FaUndoAlt } from "react-icons/fa";

export default function Task(props) {
  const [editFormStyle, setEditFormStyle]=useState({display:"none"})
  const []=useState()
  function closeEditForm(){
    setEditFormStyle({display:"none"})
  }
  function openEditForm(){
    setEditFormStyle({display:"flex"})
  }

  const titleRef=useRef()
  const dateRef=useRef()
  const discriptionRef=useRef()
  function editTask(){
    let user=JSON.parse(localStorage.getItem('teachMateloggedinUser'))
    const db=ref(getDatabase(),"users/"+user.id+"/task/"+props.id) 
    let postData={
      title:titleRef.current.value,
      date: dateRef.current.value,
      discription:discriptionRef.current.value,
    }
    update(db, postData)
    .then(()=>{
      alert("task update successfull")
    }).catch((error)=>{
      alert(error)
    })
  }

  function markAsCompleted(){
    let user=JSON.parse(localStorage.getItem('teachMateloggedinUser'))
    const db=ref(getDatabase(),"users/"+user.id+"/task/"+props.id) 
    let postData={
      pending:false,
    }
    update(db, postData)
    .then(()=>{
      alert("congrats! task completed")
    }).catch((error)=>{
      alert(error)
    })
  }


  const [deletestate, setDeletestate]= useState("Delete task")
  function switchToDelete(){
    setDeletestate("Delete task")
  }
  function deleteTaskFromDatabase(){
    let user=JSON.parse(localStorage.getItem('teachMateloggedinUser'))
    const db=ref(getDatabase(),"users/"+user.id+"/task/"+props.id) 
    remove(db)
    .then(()=>{
      setDeletestate("Delete task")
      alert("Task has been deleted")
    })
    .catch(error=>{
      setDeletestate("Delete task")
      alert(error)
    })
    
  }
function undoStatus(){
  let user=JSON.parse(localStorage.getItem('teachMateloggedinUser'))
    const db=ref(getDatabase(),"users/"+user.id+"/task/"+props.id) 
    let postData={
      pending:true,
    }
    update(db, postData)
    .then(()=>{
      alert("Status has been reset to Pending")
    }).catch((error)=>{
      alert(error)
    })
}
 
  function deleteTask(){
    setDeletestate(<div>
      <h3>Are you sure?</h3>
      <div>
        <button onClick={deleteTaskFromDatabase}>yes</button>
        <button onClick={switchToDelete}>No</button>
      </div>
     </div>)
  }
  return (
    <div className='task-container'>
      <div className='task-title-duedate-container'>
        <h3 className='task-title'>{props.title}</h3>
        <div className='status-container'>
        <p className='task-duedate'><b>Due on:</b>  {props.date}</p>
        {props.pending? <p className='status'><b>Status:</b>pending</p> :<p className='status'><b>Status:</b> Completed</p>}
        </div>
      </div>
      <p className='task-discription'>{props.discription}</p>
      {props.pending===false?<div><button className='edit-task-button' onClick={deleteTask}>{deletestate}</button><button className='undo-buttton' onClick={undoStatus}><FaUndoAlt className='it'/></button></div>:<button className='edit-task-button' onClick={openEditForm}>Edit</button>}
      {props.pending&&<button className='complete-task-button' onClick={markAsCompleted} ><IoMdDoneAll /></button>}
      

      <div style={editFormStyle} className='edit-task-form-container'>
        <p>Edit task</p>
      <form>
        <input ref={titleRef} type='text' required autoFocus placeholder='Title' className='edit-task-title-input'/>
        <input ref={dateRef} type='date' required min="01-20-2024" className='edit-date-input'/>
        <textarea ref={discriptionRef} autoCorrect='on' autoComplete='on' required placeholder='Description' maxlength="200" className=' edit-discription-input'/>
      </form>
      <div className='edit-task-form-button-container'>
        <button className='edit-create-task-button' onClick={editTask}>Create</button>
        <button className='edit-cancle-task-button' onClick={closeEditForm}>Cancel</button>
      </div>
    </div>
    </div>
  )
}
