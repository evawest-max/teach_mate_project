import { getDatabase, ref, set } from "firebase/database"
import "./signUp.css"
import React, { useContext, useRef, useState } from 'react'
import { getStorage } from "firebase/storage"
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { auth, provider } from "../firebase config/firebaseConfig"
import { Link } from "react-router-dom"
import { FaWindowClose } from "react-icons/fa";
import { TaskContext } from "../context/appContext"
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function SignUp() {
    const task= useContext(TaskContext)
    let nameref=useRef()
    let emailref=useRef()
    let createpasswordref=useRef()
    let confirmpasswordref=useRef()


    const [alerttext, setalerttext]=useState()
    const [alerttextcolor, setalerttextcolor]=useState()
    const [namebordercolor, setnamebordercolor]=useState()
    // const [phonenumberbordercolor, setphonenumberbordercolor]=useState()
    const [emailbordercolor, setemailbordercolor]=useState()
    const [createpasswordbordercolor, setcreatepasswordbordercolor]=useState()
    const [confirmpasswordbordercolor, setconfirmpasswordbordercolor]=useState()
    const [buttonState, setButtonState]=useState("SIGN UP")

    function validatename(){
        if (nameref.current.value.length<4){
            setalerttextcolor({color: "red"})
            setnamebordercolor({border: "2px solid red"})
            setalerttext("Fullname must be longer than 4 letters.")
        }else{
          setnamebordercolor({border: "2px solid green"})
          setalerttext("")
        }
      }
    
      function validateEmail(){
        if (!emailref.current.value.includes("@") ){
          setalerttextcolor({color: "red"})
          setemailbordercolor({border: "2px solid red"})
          setalerttext("email is incorrect 'include @'")
        }else{
          setemailbordercolor({border: "2px solid green"})
          setalerttext("")
        }
      }
      function validateCreatePassword(){
        if (createpasswordref.current.value.includes(",")||createpasswordref.current.value.includes("!") ||createpasswordref.current.value.includes("@") ||createpasswordref.current.value.includes("#") ||createpasswordref.current.value.includes("$")||createpasswordref.current.value.includes("%") && createpasswordref.current.value.length>=6){
          setcreatepasswordbordercolor({border: "2px solid green"})
          setalerttext("")
        }else{
          setalerttextcolor({color: "red"})
          setcreatepasswordbordercolor({border: "2px solid red"})
          setalerttext("password must include one of this symbols', @ ! # $ %' and longer than 6 characters")
        }
      }

   
    
    async function registerUser (){
        
        // const newPostKey = push(child(ref(db), 'users/')).key;
        
          if (nameref.current.value.length>4){ 
            if (emailref.current.value.includes("@")){
                // if (createpasswordref.current.value===confirmpasswordref.current.value && confirmpasswordref.current.value.length>=6){
                    // if (confirmpasswordref.current.value.includes(",")||confirmpasswordref.current.value.includes("!")||confirmpasswordref.current.value.includes("@") ||confirmpasswordref.current.value.includes("#") ||confirmpasswordref.current.value.includes("$")||confirmpasswordref.current.value.includes("%")){   
                        setButtonState(<AiOutlineLoading3Quarters />)
                        try{
                        const userCredential=await createUserWithEmailAndPassword(auth, emailref.current.value, createpasswordref.current.value)
                        console.log(userCredential)
                        const user = userCredential.user
                        const postData={
                            id:user.uid,
                            name:nameref.current.value,
                            email:emailref.current.value,
                        }
                        const db = ref(getDatabase(),"users/"+user.uid, );
                        await set(db, postData).then(() => {
                        })
                       
                            
                        await sendEmailVerification(auth.currentUser)
                        .then(() => {
                            // Email verification sent!
                            // ...
                        })
                        .catch((error)=>{
                            setalerttext("Email verification not sent."+error.message)
                        });
                        setnamebordercolor({border: "2px solid green"})
                        setemailbordercolor({border: "2px solid green"})
                        setcreatepasswordbordercolor({border: "2px solid green"})
                        setconfirmpasswordbordercolor({border: "2px solid green"})
                        setalerttextcolor({color: "lime"})
                        setalerttext("Sign up successfull! Email verification link has been sent to your mail.")
                        setButtonState("SIGN UP")
                        }catch (error){
                        setalerttextcolor({color: "red"})
                        setemailbordercolor({border: "2px solid red"})
                        setalerttext(error.message)
                        setButtonState("SIGN UP")
                        console.log(error.message)
                        }
                        
                    // }else {
                    //     setalerttextcolor({color: "red"})
                    //     setconfirmpasswordbordercolor({border: "2px solid red"})
                    //     setalerttext("password must include one of this symbols', @ ! # $ %'")
                    // }
                // }else{
                // setalerttextcolor({color: "red"})
                // setconfirmpasswordbordercolor({border: "2px solid red"})
                // setalerttext("password do not match or shorter than 6 characters")
                // }
            }else{
                setalerttextcolor({color: "red"})
                setemailbordercolor({border: "2px solid red"})
                setalerttext("email is incorrect it must include '@'")
            }
          }else{
            setalerttextcolor({color: "red"})
            setnamebordercolor({border: "2px solid red"})
            setalerttext("Fullname must be longer than 3 letters.")
          }
          
      }
    
      function closeSignup(){
        task.closeSignUpForm()
      }

  return (
    <div style={task.signUpformStyle} className="signup-container">
        <div id='signup-Form-container'>
            <p><FaWindowClose onClick={closeSignup}/></p>
            <h3 className='signup-title'>CREATE AN ACCOUNT</h3>
                <p style={alerttextcolor}>{alerttext}</p>
                <div className='inputAndButtondiv' >
                <form className='signup-form'>
                    <label>Full Name</label>
                    <input style={namebordercolor} onBlur={validatename} ref={nameref} type='text' placeholder='John Smith'/><br/>
                    <label>E-mail</label>
                    <input style={emailbordercolor}onBlur={validateEmail} ref={emailref} type='email' placeholder='example@yahoo.com'/><br/>
                    <label>Create Password</label>
                    <input style={createpasswordbordercolor}onBlur={validateCreatePassword} ref={createpasswordref} type='password' placeholder='********'/><br/>
                    <label>Confirm Password</label>
                    <input style={confirmpasswordbordercolor} ref={confirmpasswordref} type='password' placeholder='********'/><br/>
                    <p><input style={confirmpasswordbordercolor} ref={confirmpasswordref} required type='checkbox' placeholder='********'/>i have read and i accept all the <Link to="www.facebook.com">terms and conditions</Link> </p>

                </form>
                <button onClick={registerUser} className='signup-button'><strong>{buttonState}</strong></button>
                </div>

        </div>
    </div>
  )
}
