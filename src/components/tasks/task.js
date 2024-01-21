import React, { useRef, useState } from 'react'
import "./task.css"
import { getDatabase, ref, update } from 'firebase/database'

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
  return (
    <div className='task-container'>
      <div className='task-title-duedate-container'>
        <h3 className='task-title'>{props.title}</h3>
        <div className='status-container'>
        <p className='task-duedate'>Due on: {props.date}</p>
        {props.pending? <p className='status'> Status: pending</p> :<p className='status'>Status: Completed</p>}
        </div>
      </div>
      <p className='task-discription'>{props.discription}</p>
      <button className='edit-task-button' onClick={openEditForm}>Edit</button>
      <button className='edit-task-button' onClick={markAsCompleted} >completed?</button>
      

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
