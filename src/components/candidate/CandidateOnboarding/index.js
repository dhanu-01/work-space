import { Grid ,TextField,Button} from '@mui/material'
import React,{useState,useRef} from 'react'
import './CandidateOnboarding.css'
import {doc,setDoc} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Notification } from '../../../utils/Notification';
import { db, storage } from '../../../firebaseConfig';
import CustomDropDown from '../../common/CustomDropDown';
import { SkillsDownlist } from '../../../constants';
import { jobTitle } from '../../../constants';
import { jobExperience } from '../../../constants';
import SearchDropDown from '../../common/SearchDropDown';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import { useNavigate } from 'react-router-dom';

const CandidateOnboarding = () => {
  //  console.log("user",JSON.parse(localStorage.getItem("user")))
  const Navigate = useNavigate();
  const inputRef = useRef();
  const [loading,setUpLoading] = useState(0);
   const[values,setValues] = useState({
       name:JSON.parse(localStorage.getItem("user"))?.displayName || "",
       phoneNumber:"",
       email:JSON.parse(localStorage.getItem("user"))?.email,
       location:"",
       primaryRole:"",
       jobExperience:"",
       skills:[],
       resume:null,
   });

   const submit = async (e) => {
        e.preventDefault();
     const user = JSON.parse(localStorage.getItem("user"));
     const uid = user.uid;


     // Add a new document in collection "cities"
     //setDoc(docInfo,data)
     //docInfo = doc(database,collection name,docId)

      try{
        await setDoc(doc(db, "userInfo",uid), {
          ...values,
          type:"candidate"
        });
        Notification({message:"Profile created successfully"})
        Navigate("/candidate/profile")

      }catch{
        Notification({message:"something went wrong"})
      }


   }

   const uploadResume = (e) => {
     const file = e.target.files[0]


     const storageRef = ref(storage,"candidate-resume/"+ file.name);
     //uploadBytesResumable(StorageRef/file)
     const uploadTask = uploadBytesResumable(storageRef,file);

     uploadTask.on(
      "state_changed",
      (snapshot) => {
        //get task progress, including the number of bytes uploaded
        let progress =
        Math.round((snapshot.bytesTransferred/snapshot.totalBytes) * 100);
        console.log(progress)
        setUpLoading(progress);
      },
      (error) => {
        Notification({message:"something went wrong while uploading"});
      },

      ()=>{
        //upload completed succesfully
         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
          setValues({...values,resume:downloadURL});
          Notification({message:"file uploaded successfully"})
          setUpLoading(0)
        })
      }
     )

   }

  return (
    <div className='cd-onboarding-container'>
      <h2>Setup your profile</h2>
      <form onSubmit={submit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
          <label className='cd-feild-label'>Name*</label>
          <TextField
            fullWidth
            required
            size="small"
            value={values.name}
            onChange={(e)=>setValues({...values,name:e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
          <label className='cd-feild-label'>Phone Number*</label>
          <TextField
            fullWidth
            required
            size="small"
            value={values.phoneNumber}
            onChange={(e)=>setValues({...values,phoneNumber:e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
          <label className='cd-feild-label'>Email*</label>
          <TextField
            disabled= {true}
            fullWidth
            required
            size="small"
            value={values.email}
            onChange={(e)=>setValues({...values,email:e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
          <label className='cd-feild-label'>Primary Role</label>
              <CustomDropDown
                required={true}
                  dropDownList={jobTitle}
                  value={values.primaryRole}
                  onChange={(data) => setValues({ ...values,primaryRole: data })}
                />
          </Grid>
          <Grid item xs={12} sm={6}>
          <label className='cd-feild-label'>Experience</label>
          <CustomDropDown
                required={true}
                  dropDownList={jobExperience}
                  value={values.jobExperience}
                  onChange={(data) => setValues({ ...values, jobExperience: data })}
                />
          </Grid>
          <Grid item xs={12} sm={6}>
          <label className='cd-feild-label'>Skills</label>

          <SearchDropDown
              required={true}
              dropDownList={SkillsDownlist}
              onChange={(data) =>{
                 if(!values.skills.includes(data)){
                   setValues({...values, skills:[...values.skills, data]})
                 }
              }}
            />

            <div className='skills-container'>
              {
                values.skills.length>0 && values.skills.map((skill,index)=>{
                   return (
                      <div>
                        <p>{skill}</p>
                        <CancelOutlined
                         color="error"
                         sx={{
                          fontSize: "12px"
                        }}
                         onClick = {()=>
                          {
                            setValues({
                              ...values,
                              skills:values.skills.filter((item)=>item!==skill)
                            })
                          }
                        }
                        />
                      </div>
                   )

                })
              }

            </div>

          </Grid>
          <Grid item xs={12} sm={12}>
          <label className='cd-feild-label'>Resume</label>
          <div>
          {values?.resume && (
            <a href={values.resume} target="_blank" rel="noopener noreferrer">
               view resume
                </a>
          )}
          </div>
          { loading>0 && loading<=100 ? (<>Loading: {loading} % </>):
          (
          <>
          <input style={{display:"none"}} ref={inputRef}
            accept='application/pdf'
            type='file'
            name='resume'
            size="small"
            onChange={(e)=>uploadResume(e)}
            />
            <Button onClick={()=>inputRef.current.click()}>Upload Resume</Button></>
            )
            }
          </Grid>

          <div className='cd-btn-container'>
          <Button type="submit">Complete SetUp</Button>
          </div>

        </Grid>
      </form>
    </div>
  )
}

export default CandidateOnboarding