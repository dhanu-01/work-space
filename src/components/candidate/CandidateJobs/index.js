import React, { useEffect } from 'react'
import { collection, query, setDoc, doc,getDocs,where,getDoc} from "firebase/firestore";
import { db } from '../../../firebaseConfig';
import { useState } from 'react';
import spinner from '../../../assests/spinner.gif'
import CandidateJobCard from './CandidateJobCard';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '../../../utils/Notification';


const CandidateJobs = () => {
    const [loading, setLoading] = useState(true);
    const [allJobs, setallJobs] = useState(null);
    let candidate_id = JSON.parse(localStorage.getItem('user')).uid;


    const getJobs = async () => {
        const q =  query(collection(db, "jobs"));

        const querySnapshot = await getDocs(q);
        let jobs = []
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            jobs.push(doc.data())
        });
        setallJobs(jobs);
        setLoading(false);
    }

    const applyonJob = async (job) => {

        let application_id = uuidv4();

        //fetch all the applications of this user  with candiate_Id
        //If job_id is already present in the applications then show a noitifcation that you have already applied

        const allApplications = await getDocs(query(collection(db, "applications"), where("candidate_id", "==", candidate_id)))

        const alreadyApplied = allApplications.docs.find((doc)=>{
            return doc.data().job_id === job.job_id
        })

        if(alreadyApplied){
            Notification({
                message:"You have already applied for this job",
                type:"error"
            })
            return
        }else{

            //FETCH the candidate info from the candiate collection
            const candidate = await getDoc(doc(db,'userInfo', candidate_id))
            console.log(candidate.data())
            let candidate_resume =  candidate.data().resume;
            let candidate_exp = candidate.data().jobExperience;
            let candidate_name = candidate.data().name;

            await setDoc(doc(db,'applications',application_id),{
                application_id: application_id,
                candidate_resume : candidate_resume,
                candidate_exp : candidate_exp,
                candidate_name : candidate_name,
                candidate_id : candidate_id,
                employer_id : job.employer_id,
                job_id : job.job_id,
                companyName : job.company_name,
                jobTitle : job.jobTitle,
                createdAt : new Date(),
                status : "Applied"
            })
            Notification({
                message:"Applied successfully"
            })
        }
    }

    useEffect(() => {
        //fetch all the jobs from the firebase
        //filter the jobs based on candidate skills
        getJobs();

    }, [])

    return (
        <>
            {allJobs && allJobs.length === 0 ?
                (
                    <div>
                        <h1>No jobs Found</h1>
                    </div>
                ) : allJobs && allJobs.length > 0 ? (
                    <div>
                    {allJobs.map((job) => {
                      return <CandidateJobCard job={job} applyonJob={applyonJob} />;
                    })}
                  </div>
                ) : (
                    <div>
                        <img
                            src={spinner}
                            alt="imgNotFound"
                        />
                    </div>
                )

            }
        </>

    )
}

export default CandidateJobs