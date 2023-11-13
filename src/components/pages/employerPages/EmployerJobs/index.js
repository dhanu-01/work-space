import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import JobForm from './JobForm'
import SideBar from './SideBar'

const EmployerJobs = () => {

  const [mobileSectionState, setMobileSectionState] = useState("sidebar");
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(()=>{
    console.log(selectedJob)
  },[selectedJob])

  return (
      <Grid container>
        <Grid item xs={12} md={4}
          sx={{
            display: { xs: mobileSectionState === 'sidebar' ? 'block' : 'none', md: "block" }
          }}
        >
          <SideBar setMobileSectionState={setMobileSectionState}
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
          />
        </Grid>
        <Grid item xs={12} md={8}
          sx={{ display: { xs: mobileSectionState === 'jobform' ? 'block' : 'none', md: "block" } }}
        >
          <JobForm selectedJob={selectedJob} setMobileSectionState={setMobileSectionState} />
        </Grid>
      </Grid>
    )
   
}

export default EmployerJobs