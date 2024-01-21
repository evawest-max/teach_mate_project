import { Link } from "react-router-dom";
import Task from "../tasks/task";
import TaskForm from "../todoForm/taskForm";
import FilterTask from "../filter task/filterTask";
import { FaTasks } from "react-icons/fa";
import "./homePage.css"
import { useContext, useRef, useState } from "react";
import { TaskContext } from "../context/appContext";
import SigninPage from "../signinPage/SigninPage";
import SignUp from "../Sign-up/signUp";
import { getDatabase, onValue, ref as refDatabase } from "firebase/database";


function HomePage(){
    const task=useContext(TaskContext)
    function openCreateForms(){
        task.openCreateForm()
    }
    // function openSigninPage(){
    //     task.openSignInForm()
    // }
    let users=localStorage.getItem('teachMateloggedinUser')!==null&&JSON.parse(localStorage.getItem('teachMateloggedinUser'))
    let usersTasks=users.task
    let [itemsInDatabase, newItemsInDatabase]=useState(localStorage.getItem('teachMateloggedinUser')!==null&&Object.values(usersTasks).map((items, index)=>{ 
        // let star=items.star===1?<AiFillStar/>:items.star===2?<div><AiFillStar/><AiFillStar/></div>:items.star===3?<div><AiFillStar/><AiFillStar/><AiFillStar/></div>:items.star===4?<div><AiFillStar/><AiFillStar/><AiFillStar/><AiFillStar/></div>:items.star===5&&<div><AiFillStar/><AiFillStar/><AiFillStar/><AiFillStar/><AiFillStar/></div>
        return(
            <Task key={index}  id={items.post_id} discription={items.discription} title={items.title} date={items.date} />
        ) 
    }))

    let inputRef= useRef()
    function findTask(){
        const filtereditemsInDatabase= localStorage.getItem('teachMateloggedinUser')!==null&&Object.values(usersTasks).filter((items)=>{
            return items.title.toLocaleLowerCase().includes(inputRef.current.value.toLocaleLowerCase())
        })
        console.log(filtereditemsInDatabase)
        
        newItemsInDatabase(filtereditemsInDatabase.map((items, index)=>{
            console.log(index)
            return(
                <Task key={index}  id={items.post_id} discription={items.discription} title={items.title} date={items.date} />
            ) 
        }))
    }

    
   
    const [completedTaskBackgound, setCompletedTaskBackgound]=useState({backgroundColor:"rgb(32, 0, 128)", color:"white"})
    const [pendingTaskBackgound, setPendingTaskBackgound]=useState({backgroundColor:"transparent", color:"black"})
    function filterByCompletedTask(){
        setCompletedTaskBackgound({backgroundColor:"rgb(32, 0, 128)", color:"white"})
        setPendingTaskBackgound({backgroundColor:"transparent", color:"black"})
        newItemsInDatabase(localStorage.getItem('teachMateloggedinUser')!==null&&Object.values(usersTasks).map((items, index)=>{
            
            return items.pending===false&&<Task key={index}  id={items.post_id} discription={items.discription} title={items.title} date={items.date} />
        }))
    }   
    function filterBYPendingTask(){
        setCompletedTaskBackgound({backgroundColor:"transparent", color:"black"})
        setPendingTaskBackgound({backgroundColor:"rgb(32, 0, 128)", color:"white"})
        newItemsInDatabase(localStorage.getItem('teachMateloggedinUser')!==null&&Object.values(usersTasks).map((items, index)=>{
            
            return(
                items.pending===true&&<Task key={index}  id={items.post_id} discription={items.discription} title={items.title} date={items.date} />
            ) 
        }))
    }

    if (localStorage.getItem("teachMateloggedinUser")!==null){
        let loggedinuser=JSON.parse(localStorage.getItem('teachMateloggedinUser'))
        const db = getDatabase();
        const userRef = refDatabase(db, "users/"+ loggedinuser.id );
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          // console.log(data)
          localStorage.setItem("teachMateloggedinUser", JSON.stringify(data))
          // updateStarCount(postElement, data);
        });
      }

    return(
        <div className="dashboard">
            <div className="nav-container">
                <Link to="https://teachmateai.com/">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlEVD8Zewpor8xZWVLdHjAsqhKm3Ce8dFrow&usqp=CAU" alt="logo" height={50}/>
                </Link>
                {task.loginIcon}
                
            </div>
            <div className="title-and-search-create-intro-container">
                <div className="title-and-search-create-container">
                    <div className="icon-title-container">
                        <p><FaTasks /></p>
                        <h3 className="title">Task Management Dashboard</h3>
                    </div>
                    <input onChange={findTask} ref={inputRef} type="text" placeholder="search" className="search-input"/>
                    <button onClick={openCreateForms} className="start-create-task-button">Create Task</button>
                </div>
                <p className="intro-text">Get ready to tackle all task you are working on</p>
            </div> 
            <div className='filter-container'>
                <button className='completed-task' style={completedTaskBackgound} onClick={filterByCompletedTask}>completed task</button>
                <button className='pending-task' style={pendingTaskBackgound} onClick={filterBYPendingTask}>pending task</button>
            </div>
           <div id="task-container">
                {itemsInDatabase}
           </div>
           <TaskForm/>
           <SigninPage/>
           <SignUp/>
        </div>
    )
}

export default HomePage
