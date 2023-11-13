import React, { useEffect, useRef, useState } from 'react'
import { Button, Grid, TextField } from '@mui/material'
import './JobForm.css'
import CustomDropDown from '../../../../common/CustomDropDown'
import {
  jobTitle,
  jobType,
  jobLocation,
  jobExperience,
  SkillsDownlist
} from '../../../../../constants';
import SearchDropDown from '../../../../common/SearchDropDown';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { currencyDropDownList } from '../../../../../constants';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '../../../../../utils/Notification';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../../firebaseConfig';
import RTE from '../../../../common/RTE';

const JobForm = ({ selectedJob, setMobileSectionState }) => {


  const initialValues = {
    jobTitle: "",
    jobType: "",
    jobLocation: "",
    jobExperience: "",
    salary: {
      currency: "",
      min: "",
      max: ""
    },
    jobDescription: "",
    skills: [],
  }
  const [jobData, setJobData] = useState({
    ...initialValues
  })


  useEffect(() => {
    if (selectedJob) {
      setJobData({ ...selectedJob })
    } else {
      setJobData({ ...initialValues })
    }
  }, [selectedJob])

  const handleSkillsInput = (data) => {
    if (!jobData.skills.includes(data)) {
      setJobData({ ...jobData, skills: [...jobData.skills, data] });
    }
  }

  const submitJob = async (e) => {
    e.preventDefault();
    let job_id = uuidv4();
    let userInfo = JSON.parse(localStorage.getItem("user"));
    let employer_id = userInfo.uid;


    try {
      // setDoc(docRef,data)
      // docRef(databaseRef, collection,document id)

      if (selectedJob) {
        await setDoc(doc(db, "jobs", selectedJob.job_id), {
          ...jobData,
          createdAt: new Date()
        }, {
          merge: true
        })
        Notification({ message: 'Job Updated Successfully', type: "success" })
      } else {

        let companyInfo = await getDoc(doc(db, "userInfo", employer_id))

        companyInfo = companyInfo.data();
        await setDoc(doc(db, "jobs", job_id), {
          job_id,
          employer_id,
          company_name: companyInfo.companyName,
          company_logo: companyInfo.logo,
          companyTagline: companyInfo.companyTagline,
          ...jobData,
          createdAt: new Date()
        })
        setJobData({ ...initialValues })
        Notification({ message: 'Job Posted Successfully', type: "success" })
      }
    }
    catch (err) {
      console.log(err);
      Notification({ message: "error", type: "error" })
    }
  }

  return (
    <div>
      <Button onClick={() => setMobileSectionState("sidebar")}
        sx={
          {
            display: { md: "none", xs: "block" }
          }
        }
      >
        Back
      </Button>
      <form
        onSubmit={(e) => submitJob(e)}
      >
        <Grid className='form-container' container>
          <Grid item xs={12} md={6}>
            <label className='text-label'>Job Title</label>

            <CustomDropDown
              required={true}
              dropDownList={jobTitle}
              value={jobData.jobTitle}
              onChange={(data) => setJobData({ ...jobData, jobTitle: data })}
            />

          </Grid>
          <Grid item xs={12} md={6}>
            <label className='text-label'>Job Type</label>

            <CustomDropDown
              required={true}
              dropDownList={jobType}
              value={jobData.jobType}
              onChange={(data) => setJobData({ ...jobData, jobType: data })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className='text-label'>Job Location</label>

            <CustomDropDown
              required={true}
              dropDownList={jobLocation}
              value={jobData.jobLocation}
              onChange={(data) => setJobData({ ...jobData, jobLocation: data })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className='text-label'>Job Experience</label>

            <CustomDropDown
              required={true}
              dropDownList={jobExperience}
              value={jobData.jobExperience}
              onChange={(data) => setJobData({ ...jobData, jobExperience: data })}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className='text-label'>Salary</label>
            <Grid container spacing={2}>
              <Grid item xs={12}>

                <CustomDropDown
                  required={true}
                  dropDownList={currencyDropDownList}
                  value={jobData.salary.currency}
                  onChange={(data) => setJobData({ ...jobData, salary: { ...jobData.salary, currency: data } })}
                />

              </Grid>

              <Grid item xs={6}>
                <TextField
                  required={true}
                  placeholder='min'
                  value={jobData.salary.min}
                  onChange={(e) => setJobData({
                    ...jobData,
                    salary: { ...jobData.salary, min: e.target.value },
                  })}

                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  required={true}
                  placeholder='max'
                  value={jobData.salary.max}
                  onChange={(e) => setJobData({
                    ...jobData,
                    salary: { ...jobData.salary, max: e.target.value },
                  })}

                />
              </Grid>

            </Grid>

          </Grid>

          <Grid item xs={12} md={6}>
            <label className='text-label'>Skills</label>


            <SearchDropDown
              required={true}
              dropDownList={SkillsDownlist}
              onChange={(data) => handleSkillsInput(data)}
            />



            <div className='skills-container'>
              {jobData.skills.length > 0 && jobData.skills.map((skill, index) => {
                return (
                  <div key={index}>
                    <p>{skill}</p>
                    <CancelOutlinedIcon
                      color="error"
                      sx={{
                        fontSize: "12px"
                      }}
                      onClick={() =>
                        setJobData({
                          ...jobData,
                          skills: jobData.skills.filter((item) => item !== skill)
                        })
                      }
                    />

                  </div>
                )
              })
              }

            </div>

          </Grid>

          <Grid item xs={12} sx={{
            margin: '15px'
          }}>
            <RTE
              content={jobData.jobDescription}
              setContent={(data) => {
                setJobData({ ...jobData, jobDescription: data })
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <button className='pbh-container'
              type='submit'
            >
              {selectedJob ? "update" : "publish"}
            </button>

          </Grid>

        </Grid>
      </form>


    </div>
  )
}

export default JobForm


//salary 3 input fields (currency ,min ,max)
//job description
// skills multi select