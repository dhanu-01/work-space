import React, { useEffect, useState } from 'react'
import { TextField } from '@mui/material'
import './SideBar.css'
import SearchIcon from '@mui/icons-material/Search';
import SideBarCard from './SideBarCard';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from '../../../../../firebaseConfig';



const SideBar = ({ setMobileSectionState,selectedJob,setSelectedJob }) => {
  let [jobs,setJobs] = useState(null);
  let [search,setSearch] = useState(null);
  let [jobSearch,setJobsearch] = useState(null);


  useEffect(() => {
    //fetch the jobs with employer _id = login user id
    //subscribe to the jobs collection where employer id = login user id
    //so that frontend is updated when a new job is added or an existing job is updated
   
    //query(collection ref, where condition)
    //collection ref(database ref, collection name)
    //onSnapshot (query, callback)
    let userInfo = JSON.parse(localStorage.getItem("user"));
    let employer_id = userInfo.uid;
    const q = query(collection(db, "jobs"), where("employer_id", "==", employer_id));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const jobs = [];
      querySnapshot.forEach((doc) => {
        jobs.push(doc.data());
      });
      // console.log("jobs",jobs)
       setJobs(jobs);
       setJobsearch(jobs);
    });

  }, []);

  useEffect(()=>{
    if(search){
      let filterdJobs = jobs.filter((job)=>job.jobTitle.toLowerCase().includes(search.toLowerCase()) || job.jobLocation.toLowerCase().includes(search.toLowerCase()))
      setJobsearch(filterdJobs);
    }else{
      setJobsearch(jobs);
    }
  },[search])

  return (
    <div
      className='sidebar-container'
    >
      <div
        style={{
          position: 'sticky',
          top: '0',
          zIndex: '2',
          padding: '5px',
          background: '#ffffff',
        }}
      >
        <button onClick={() => {setMobileSectionState("jobform");setSelectedJob(null)}}
          className='post-job-btn'
          sx={
            {
              display: { md: "none", xs: "block" }
            }
          }
        >
          Post a job
          <p>Post your requirements and hire candidates</p>
        </button>

        <TextField
          sx={
            {
              marginTop: "10px",
              "div": {
                boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)',
                borderRadius: "45px"
              }
            }
          }
          fullWidth
          placeholder='Search Jobs'
          InputProps={{
            endAdornment: <SearchIcon />
          }}
          size="small"
          onChange={(e)=>setSearch(e.target.value)}
        />

      </div>


      {jobSearch && jobSearch.length === 0 ? (
        <div> No Job</div>) : jobSearch && jobSearch.length > 0 ? (
                 <div>
                  {
                    jobSearch.map((job,i)=>{
                      return(
                        <SideBarCard
                          jobs={job}
                          selectedJob={selectedJob}
                          setSelectedJob={setSelectedJob}
                          key = {i}
                        />
                      );
                    })
                  }
                  </div>
                ) : (
                 <div> Loading </div>
              )
      }


    </div>
  )
}

export default SideBar