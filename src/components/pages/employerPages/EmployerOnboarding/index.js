import React, { useState,useRef } from 'react';
import { Grid, TextField } from '@mui/material/';
import Button from '@mui/material/Button';
import './EmployerOnboarding.css'
import {doc,setDoc} from "firebase/firestore";
import {db} from "./../../../../firebaseConfig"
import { Notification } from '../../../../utils/Notification';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from './../../../../firebaseConfig';
import {useNavigate } from 'react-router-dom';


const EmployerOnboarding = () => {
  const Navigate = useNavigate();
  const inputRef = useRef(0)
  const [uploading,setUpLoading] = useState(0);
  const [values, setValues] = useState({
     companyName : JSON.parse(localStorage.getItem('user'))?.displayName || "",
     industryType:"",
     noOfEmployee:"",
     companyWebsite:"",
     companyEmail: JSON.parse(localStorage.getItem('user'))?.email || " ",
     companyPhone:"",
     companyLocation:"",
     companyTagline:"",
     companyDescription:"",
     logo:""
  })

   const submit = async(e) => {
    e.preventDefault()
    //  console.log("vl")
     const user = JSON.parse(localStorage.getItem("user"));
     const uid = user.uid;

     // Add a new document in collection "cities"
     //setDoc(docInfo,data)
     //docInfo = doc(database,collection name,docId)

      try{
        await setDoc(doc(db, "userInfo",uid), {
          ...values,
          type:"employer"
        });
        Notification({message:"Profile created successfully and now you can signIn"})
        Navigate('/employer/profile')

      }catch(err){
        Notification({message:"something went wrong"})
      }
  }

  const uploadLogo = (e) => {
    let file = e.target.files[0];
     console.log(file)
     //ref(storage,'path tofile',filename)
     const storageRef = ref(storage,"company-logo/"+ file.name);
     //uploadBytesResumable(StorageRef/file)
     const uploadTask = uploadBytesResumable(storageRef,file);

     uploadTask.on(
      "state_changed",
      (snapshot) => {
        //get task progress, including the number of bytes uploaded
        const progress =
        Math.round((snapshot.bytesTransferred/snapshot.totalBytes) * 100);
        // console.log(progress)
        setUpLoading(progress);
      },
      (error) => {
        Notification({message:"something went wrong while uploading"});
      },

      ()=>{
        //upload completed succesfully
         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
          setValues({...values,logo:downloadURL});
          Notification({message:"file uploaded successfully"})
          setUpLoading(0)
        })
      }
     )
  }
  return (
    <div className = 'onboarding-container'>
      <h2>SetUp your employerProfile</h2>

      <form onSubmit={submit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <label className='feild-label'>Company Name*</label>
            <TextField
            fullWidth
            required
            size="small"
            value={values.companyName}
            onChange={(e)=>setValues({...values,companyName:e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <label className='feild-label'>CompanyPhone</label>
            <TextField
            fullWidth
            required
            size="small"
            value={values.companyPhone}
            onChange={(e)=>setValues({...values,companyPhone:e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <label className='feild-label'>companyEmail</label>
            <TextField
            disabled={true}
            fullWidth
            required
            size="small"
            value={values.companyEmail}
            type="email"
            onChange={(e)=>setValues({...values,companyEmail:e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <label className='feild-label'>companyLocation</label>
            <TextField
            fullWidth
            size="small"
            value={values.companyLocation}
            onChange={(e)=>setValues({...values,companyLocation:e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <label className='feild-label'>companyWebsite</label>
            <TextField
            fullWidth
            size="small"
            value={values.companyWebsite}
            onChange={(e)=>setValues({...values,companyWebsite:e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <label className='feild-label'>IndustryType</label>
            <TextField
            fullWidth
            size="small"
            value={values.industryType}
            onChange={(e)=>setValues({...values,industryType:e.target.value})}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <label className='feild-label'>companyTagline</label>
            <TextField
            fullWidth
            size="small"
            value={values.companyTagline}
            onChange={(e)=>setValues({...values,companyTagline:e.target.value})}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <label className='feild-label'>No of Employees</label>
            <TextField
            fullWidth
            size="small"
            value={values.noOfEmployee}
            onChange={(e)=>setValues({...values,noOfEmployee:e.target.value})}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <label className='feild-label'>companyDescription</label>
            <TextField
            fullWidth
            multiline
            minRows={5}
            value={values.companyDescription}

            onChange={(e)=>setValues({...values,companyDescription:e.target.value})}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <label className='feild-label'>companyLogo</label>
            {uploading>0 && uploading<=100 ? ( <div> Loading: {uploading} %</div>) :
            (
            <>
            <input style={{display:'none'}}
            accept='image/*'
            ref={inputRef}
            type='file'
            value={values.companyLogo}
            onChange={(e)=>uploadLogo(e)}
            />


            <Button onClick={()=>inputRef.current.click()}>Upload file</Button> </>)}
            {values.logo && <img alt="logo" src={values.logo}/>}
          </Grid>


          <div className='btn-container'>
          <Button type="submit">Complete SetUp</Button>
          </div>

        </Grid>

      </form>
    </div>
  )
}

export default EmployerOnboarding

