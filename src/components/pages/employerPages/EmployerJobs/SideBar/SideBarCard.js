import React from 'react'
import './SideBar.css'

const SideBarCard = ({jobs,selectedJob,setSelectedJob}) => {
  const {createdAt,jobTitle,jobLocation} = jobs;
  return (
    <div  
     onClick={()=>setSelectedJob(jobs)}
     className={`sidebar-card-container ${jobs.job_id==selectedJob?.job_id && `sidebar-card-container-selected`}`}>
        <div>{createdAt?.toDate().toDateString()}</div>
        <div>{jobTitle}</div>
        <div>{jobLocation}</div>
        <hr></hr>
    </div>
  )
}

export default SideBarCard