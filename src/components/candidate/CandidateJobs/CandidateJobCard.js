import React from 'react'
import { Grid } from '@mui/material'
import './CandidateJobs.css';

const CandidateJobCard = ({ job,applyonJob }) => {
    console.log(job)
    const { company_logo, company_name, companyTagline,jobTitle, jobLocation, salary, createdAt} = job
    return (
        <div className='jobCard'>
            <Grid container>
        <Grid item xs={3}>
          <img
            width="70%"
            style={{ maxWidth: "110px" }}
            src={company_logo}
            alt="company logo"
          />
        </Grid>
        <Grid sx={{ textAlign: "left" }} item xs={9}>
          <h1>{company_name}</h1>
          <h2>{companyTagline}</h2>
        </Grid>
      </Grid>

      <Grid className="jobCard_details" container spacing={1}>
        <Grid item xs={12} md={2}>
          {jobTitle}
        </Grid>
        <Grid item xs={2}>
          {jobLocation}
        </Grid>
        <Grid item xs={6} md={3}>
          {salary.currency} {salary.min} - {salary.max}
        </Grid>
        <Grid item xs={3} md={3}>
          {createdAt.toDate().toDateString()}
        </Grid>
        <Grid item xs={12} md={2}>
          <button
          onClick={()=>{applyonJob(job)}}
          className="apply-btn">Apply</button>
        </Grid>
      </Grid>
        </div>
    )
}

export default CandidateJobCard
