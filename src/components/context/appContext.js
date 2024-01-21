import { get, getDatabase, ref } from 'firebase/database';
import { getDownloadURL, getStorage, ref as refStorage } from 'firebase/storage';
import React, { createContext, useEffect, useState } from 'react'
import { FaUserCircle } from "react-icons/fa";
import "./appContext.css"


export const TaskContext=createContext(
    {
        formStyle:0,
        signInformStyle:0,
        signUpformStyle:0,
        loginIcon:0,
        openCreateForm:()=>{},
        cancleCreateForm:()=>{},
        openSignInForm:()=>{},
        closeSignInForm:()=>{},
        openSignUpForm:()=>{},
        closeSignUpForm:()=>{},
        switchToUser:()=>{},
        signout:()=>{},
    }
)


function TaskProvider({children}){
    let regID=null
    let [imageUrl, setimageUrl]= useState("")
    const [createTaskForm, setcreateTaskForm]=useState({display:"none"})
    function openCreateForm(){
        setcreateTaskForm({display:"flex"})
    }
    function cancleCreateForm(){
        setcreateTaskForm({display:"none"})
    }
    const [signInForm, setSignInForm]=useState({display:"none"})
    function openSignInForm(){
        setSignInForm({display:"flex"})
    }
    function closeSignInForm(){
        setSignInForm({display:"none"})
    }
    const [signUpForm, setSignUpForm]=useState({display:"none"})
    function openSignUpForm(){
        setSignUpForm({display:"flex"})
        setSignInForm({display:"none"})
    }
    function closeSignUpForm(){
        setSignUpForm({display:"none"})
    }


    const [loginIcon, setloginIcon]= useState(
        <div className="signin-signup-button">
          <div><FaUserCircle /></div>
          <button  onClick={openSignInForm}>Signin/Signup</button>
        </div>)

    let [userloggedin, setuserloggedin]=useState({})

    function storeuserid(id){
        regID=id
      }
    async function switchToUser(userid){
    
        storeuserid(userid)
        try{
          const data=await get(ref(getDatabase(), "users/"+userid))
          setuserloggedin(data.val())
          console.log(data.val().name.split(''))
          let fullnameAb=data.val().name.split('')
          fullnameAb.map((item, index)=>{
                if (item===' '){
                  if(fullnameAb[index+1]){
                    fullnameAb=`${fullnameAb[0]}. ${fullnameAb[index+1]}`.toLocaleUpperCase()
                    console.log(fullnameAb)
                  }
                }
            })
            
            const storage = getStorage();
            let picUrl=''
            
          await getDownloadURL(refStorage(storage, `passport/${data.val().id}`))
            .then((url) => {
              // `url` is the download URL for 'images/stars.jpg'
              setimageUrl(url)
              console.log(url)
              picUrl=url
              
            })
           
            localStorage.setItem('teachMateloggedinUser', JSON.stringify({...data.val(), imageaddress:imageUrl}))
            setloginIcon(
              <div className="login-container">
              <img src={picUrl} width="20px" height="20px" alt='user pic'/>
              <p className='login-name-on-navbar'>{fullnameAb}</p>
              <button onClick={signout}>Signout</button>
            </div>)
        }catch(error){
          alert(error.message)
        }
      }

      useEffect(() => {
        // useffect calls a keepuserloggedin() function to keep use signed in when the browser reloads
        keepuserloggedin()
        }, []);
    
      async function keepuserloggedin(){
        let ur=""
        if (localStorage.getItem('teachMateloggedinUser') !== null){
        await getDownloadURL(refStorage(getStorage(), `passport/${JSON.parse(localStorage.getItem('teachMateloggedinUser')).id}`))
                .then((url) => {
                  ur=url
                }).catch(error=>{alert(error)})
        }       
        let fullnameAb=''
        if (localStorage.getItem('teachMateloggedinUser') !== null){
        let userDataFromLocalStorage=JSON.parse(localStorage.getItem('teachMateloggedinUser'))
        setuserloggedin(userDataFromLocalStorage)
          let username= userDataFromLocalStorage.name
          username.split('').map((item, index)=>{
              if (item===' '){
                  fullnameAb=(username[0]+'.'+username[index+1]).toLocaleUpperCase()
              }
          })
              
            
        setloginIcon(
          <div className="login-container">
            <img src={ur} width="20px" height="20px" alt='user pic'/> 
           
            <p className='login-name-on-navbar'> {fullnameAb}</p>
            <button onClick={signout}>Signout</button>
          </div>)
        }
      }
    

    function signout(){
        setuserloggedin({})
        setloginIcon(
          <div className="signin-signup-button">
            <div><FaUserCircle /></div>
            <button  onClick={openSignInForm}>Signin/Signup</button>
          </div>)
        localStorage.removeItem('teachMateloggedinUser')
      }



    const contextValue={
        formStyle:createTaskForm,
        signInformStyle: signInForm,
        signUpformStyle: signUpForm,
        loginIcon:loginIcon,
        openCreateForm,
        cancleCreateForm,
        openSignInForm,
        closeSignInForm,
        openSignUpForm,
        closeSignUpForm,
        switchToUser,
        signout,
    }

    return(
        <TaskContext.Provider value={contextValue}>
            {children}
        </TaskContext.Provider>
    )
}
export default TaskProvider
