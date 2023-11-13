import React,{useContext} from 'react'
import { auth,db } from '../../../firebaseConfig'
import { useNavigate } from 'react-router-dom'
import './AuthenticationPage.css'
import googleIcon from '../../../assests/google.jpg'
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { userContext } from '../../../context/userContext';
import { getDoc,doc } from 'firebase/firestore';
import { Notification } from '../../../utils/Notification'

const AuthenticationPage = ({ type }) => {

   const [state,dispatch] = useContext(userContext);

   const Navigate = useNavigate();

   const signIn =  () => {

      const provider = new GoogleAuthProvider();

      signInWithPopup(auth, provider)
         .then(async (result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;

            //The signed-in user info.
            const user = result.user;

            dispatch({type:'LOGIN',payload:user})

            //make a fetch call to  firebase uid and check if user exits or not
            //if user exits put user data in context and redirect to profile page

            let firebaseUser = await getDoc(doc(db,"userInfo", user.uid));
            if(firebaseUser.exists()){
                dispatch({type:'SET_USER_INFO', payload: firebaseUser.data()})
            }
            else{
               firebaseUser = null;
            }

            if(type==='candidate'){
               //user exist
               //?user exist as candidate
               //!user exist as employer
               if(firebaseUser){
                 if(firebaseUser.data().type==='candidate'){
                   //user exist as candidate
                   //redirect to candidate profile page
                   Navigate('/candidate/profile')
                 }
                 else{
                   //user exist as employer
                   //show him error message
                   Notification({
                     message:'you are trying to signIn as candidate but you are already exist as employer',
                     type:'error'
                   })
                 }
               }
               else{
                 //user not exist--> redirect to candidate onboarding page
                 Navigate('/candidate/onboarding')
               }


             }

             else{
               //user exist
               //?user exist as employer
               //!user exist as candidate
               if(firebaseUser){
                 if(firebaseUser.data().type==='employer'){
                   //user exist as employer
                   //redirect to employer profile page
                   Navigate('/employer/profile')
                 }
                 else{
                   //user exist as candidate
                   //show him error message
                   Notification({
                     message:'you are trying to signIn as employer but you are already exist as candidate',
                     type:'error'
                   })
                 }
               }
               else{
                 //user not exist--> redirect to employer onboarding page
                 Navigate('/employer/onboarding')
               }
             }
             console.log(result,'result');
           })
           .catch((error) => {
             console.log(error);
           })

         }

   return (
      <div className='auth-container'>
         <h1>Welcome {type}</h1>
         <h2>SignIn</h2>
         <button onClick={signIn}><img alt="icon" src={googleIcon} /> <div>Sign In With Google </div></button>
      </div>
   )
}

export default AuthenticationPage

//If user is candidate and exists  redirect to the candidate page
//If user is candidate and not exists redirect to the candidate authentication page
//if user is employer and exists redirect to the employer page
//If user is employer and not exists redirect to the employer authentication page

//if user is candidate and exists trying to sigin as an employer show him an error message
//is user is emplyer and exists trying to sigin as a candidate show him an error message