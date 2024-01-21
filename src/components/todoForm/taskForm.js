import React, { useContext, useRef } from 'react'
import "./taskForm.css"
import { TaskContext } from '../context/appContext'
import { child, getDatabase, push, ref, set, update } from 'firebase/database'
import { FaPooStorm } from 'react-icons/fa'
export default function TaskForm() {
  const task=useContext(TaskContext)
  function closeCreateForm(){
    task.cancleCreateForm()
  }
  const titleRef=useRef()
  const dateRef=useRef()
  const discriptionRef=useRef()

  function submitTask(){
    // if(localStorage.getItem('teachMateloggedinUser')!==null){
    //   console.log("postdata")
      // const newPostKey = push(child(ref(getDatabase()), "users/task"));
      // let postdata={
      //   title:titleRef.current.value,
      //   date: dateRef.current.value,
      //   discription:discriptionRef.current.value,
      //   post_id:newPostKey
      // }
    if(localStorage.getItem('teachMateloggedinUser')!==null){
      let obj=JSON.parse(localStorage.getItem('teachMateloggedinUser'))
      console.log(obj.id)
      const db = getDatabase();
      const newPostKey = push(child(ref(db), 'posts')).key;
      set(ref(db, 'users/' + `${obj.id}`+"/task/"+ newPostKey), {
        title:titleRef.current.value,
        date: dateRef.current.value,
        discription:discriptionRef.current.value,
        pending:true,
        post_id:newPostKey
      })

      // set(ref(getDatabase(),"users/"+JSON.parse(localStorage.getItem('teachMateloggedinUser').id))+`/tasks/${newPostKey}`, postdata)
      .then(()=>{
        alert("Your new task has been saved")
      }).catch((error)=>{
        alert(error)
      })
    }else{
      alert("Please Sign-in to create a task" )
    }
  
  }

  return (
    <div style={task.formStyle} className='task-form-container'>
      <form>
        <input ref={titleRef} type='text' required autoFocus placeholder='Title' className='task-title-input'/>
        <input ref={dateRef} type='date' required min="01-20-2024" className='date-input'/>
        <textarea ref={discriptionRef} autoCorrect='on' autoComplete='on' required placeholder='Description' maxlength="200" className=' discription-input'/>
      </form>
      <div className='task-form-button-container'>
        <button onClick={submitTask} className='create-task-button'>Create</button>
        <button className='cancle-task-button' onClick={closeCreateForm}>Cancel</button>
      </div>
    </div>
  )
}
