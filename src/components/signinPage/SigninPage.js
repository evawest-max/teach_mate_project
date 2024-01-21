import React, { useContext, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { auth, provider } from '../firebase config/firebaseConfig'
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from 'firebase/storage'
import { getAuth, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
// import Task from '../tasks/task'
import { TaskContext } from '../context/appContext'
import { getDatabase, ref, update } from 'firebase/database'
import {FcGoogle} from "react-icons/fc"
import "./signin.css"
import { FaWindowClose } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function SigninPage() {
    const task= useContext(TaskContext)
    const emailRef= useRef()
    const passwardRef=useRef()
    
    const [loginAlert, setloginAlert]=useState()
    const [alertcolor, setalertcolor]=useState({})
    const [emailbordercolor, setemailbordercolor]=useState({border: "1px solid darkorange"})
    const [passwordbordercolor, setpasswordbordercolor]=useState({border: "1px solid darkorange"})
    const [buttonState, setButtonState]=useState("SIGN IN")

    function validateEmail(){
        if (!emailRef.current.value.includes("@")&& !emailRef.current.value.includes(".")){
          setemailbordercolor({border: "2px solid red"})
          setalertcolor({color:"red"})
          setloginAlert("Email must include '@'")
        }
        if (emailRef.current.value.includes("@")&& emailRef.current.value.includes(".")){
          setemailbordercolor({border: "none"})
          setalertcolor({color:"red"})
          setloginAlert("")
        }
    }
    
    const [signinsuccessful, setsigninsuccessful]=useState(false)
//   const storage= getStorage()

  async function submitloginWithGoogle(){
    try{
      const userCredential=await signInWithPopup(auth, provider)
      console.log(userCredential)
      const user=userCredential.user
      
      if (user.emailVerified){
        setemailbordercolor({border: "none"})
        setpasswordbordercolor({border: "none"})
        setalertcolor({color:"green"})
        const serverimageref= storageRef(getStorage(), `passport/${user.uid}`)
        await getDownloadURL(serverimageref)
        .then(url=>{console.log(url.exist())})   
        .catch(()=>{
          fetch(user.photoURL).then(res => {
            return res.blob();
          }).then(blob => {
              //uploading blob to firebase storage
               uploadBytes(serverimageref, blob).then((snapshot) => {
                  console.log('Uploaded a blob or file!');
                }).catch((error)=>{console.log(error)});
          }).catch(error=>{
            alert("the image was not uploaded.")
          })

        })
        await update(ref(getDatabase(), "users/"+ user.uid),{
          last_login:new Date().toLocaleString(),
          email:user.email,
          id:user.uid,
          name:user.displayName,
          passport:`customer passport/ ${user.uid}`,
        }).then(()=>{
          task.switchToUser(user.uid)
        })
        
        setloginAlert("Sign in successfull!")
        console.log("login successfull")
       
      }else{
        setalertcolor({color:"red"})
        setloginAlert(<p>account not verified<button>resend verification link</button></p>)
      }
    }catch(error){
      setalertcolor({color:"red"})
      setloginAlert(error.message)
      
    }
  }

  async function submitlogin(){
    setButtonState(<AiOutlineLoading3Quarters />)
    try{
      const userCredential=await signInWithEmailAndPassword(auth, emailRef.current.value, passwardRef.current.value)
      console.log(userCredential)
      const user=userCredential.user
      if (user.emailVerified===true){
        setemailbordercolor({border: "none"})
        setpasswordbordercolor({border: "none"})
        setalertcolor({color:"green"})
        await update(ref(getDatabase(), "users/"+ userCredential.uid),{
          last_login:new Date().toLocaleString(),
        })
        task.switchToUser(user.uid)
        setloginAlert("Sign in successfull!")
        setButtonState("SIGN IN")
        console.log("login successfull")
      }else{
        setalertcolor({color:"red"})
        setloginAlert(<p>account not verified<button onClick={resendVerificationLink}>resend verification link</button></p>)
        setButtonState("SIGN IN")
      }
    }catch(error){
      setemailbordercolor({border: "2px solid red"})
      setalertcolor({color:"red"})
      setloginAlert(error.message)
      setButtonState("SIGN IN")
    }
  }
  function resendVerificationLink(){
    const auth = getAuth();
    sendEmailVerification(auth.currentUser)
      .then(() => {
        setalertcolor({color:"green"})
        setloginAlert("Verification link sent")
      })
      .catch((error)=>{
        setalertcolor({color:"red"})
        setloginAlert("Verification link not sent"+error.message)
      });
  }

  function closeSignIn(){
    task.closeSignInForm()
  }
  function openSignUpPage(){
    // Task.closeSignInForm()
    task.openSignUpForm()
  }

  return (
    <div style={task.signInformStyle} className='login'>
        
      <div id='login-Form-container'>
    <p><FaWindowClose onClick={closeSignIn}/></p>
        <h3 className='login-title'>SIGN IN</h3>
        <p style={alertcolor} className='signinalert'>{loginAlert}</p>
        <div className='loginFormAndButton'>
          <form className='login-form'>
            <label>E-mail</label>
            <input onBlur={validateEmail} style={emailbordercolor} ref={emailRef} type='email' placeholder='example@yahoo.com'/><br/>
            <label>Password</label>
            <input style={passwordbordercolor} ref={passwardRef} type='password' placeholder='********'/>
          </form>
          <p className='login-forgot-password'><Link to="/reset-profile">Forgot password?</Link></p>
          <Link onClick={submitlogin} to={signinsuccessful && '/user-profile'}><button className='login-button'><strong>{buttonState}</strong></button></Link>
        </div>
        
        <p className='login-options'>Or sign in using</p>
        <div className='login-option-picture' onClick={submitloginWithGoogle}><FcGoogle/></div>
        
        <h5 className='sign-up-button'>
          <p>I dont Have an account?</p>
          <div onClick={openSignUpPage}>SIGN UP</div>
        </h5>
      </div>
    </div>
  )
}

export default SigninPage