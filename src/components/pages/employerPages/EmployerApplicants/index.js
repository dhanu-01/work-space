import React from 'react'
import { useEffect } from 'react';
import {query, collection, where, onSnapshot,setDoc } from "firebase/firestore";
import { db } from '../../../../firebaseConfig';
import { useState } from 'react';
import spinner from '../../../../assests/spinner.gif';
import CommonTable from '../../../common/CommonTable';
import { doc, deleteDoc } from "firebase/firestore";
import { Notification } from '../../../../utils/Notification';
import { v4 as uuidv4 } from 'uuid';


const columns = [
  {
   title:"Candidate Name",
   dataIndex: "candidate_name",
   width:"10%"
  },
  {
    title: "Job Title",
    dataIndex : "jobTitle",
    width:"15%"
  },
  {
   title : "Interest shown on",
   dataIndex: "createdAt",
   type: "date",
   width:"15%"
  },
  {
   title:"Experience",
   dataIndex:"candidate_exp",
   width:"10%"
  },
  {
   title:"Resume",
   dataIndex:"candidate_resume",
   type:"file",
   width:"10%"
  },
  {
   title: "Status",
   dataIndex:"status",
   width:"10%"
  },
  {
   title:"Action",
   type :"action",
   width:"20%",
   childrenAction: [
     {action:"accept",label:"Accept"},
     {action: "reject",label:"Reject"},
   ]
  }
]

const EmployerApplicants = () => {

   const employer_id = JSON.parse(localStorage.getItem('user')).uid;
   const[loading,setLoading] = useState(true);
   const[applicants,setApplicants] = useState(null);

   const fetch = async () => {
        // console.log(candidate_id)
    try {
      const q = query(collection(db, "applications"),where("employer_id", "==", employer_id))
       const unsubscribe = onSnapshot(q,(QuerySnapshot)=>{
         let docs = []
          QuerySnapshot.forEach((doc)=>{
            docs.push(doc.data())
          })

          setApplicants(docs)
       })

    } catch (err) {
      Notification({ message: "Error can't get the applications" })
    }
     setLoading(false);
   }

   const handleClick = async (action,data) => {
       if(action === 'accept'){
        await setDoc(doc(db,'applications',data.application_id),{
          status : "Accepted"
        },
      {
        merge:true
      })

      //Initialize a conversation between the employer and the candidate

      //1.Initialize last message in the last_message collection
      // hey (candidate name) we  have accepted your application for the job(job title)

      //2.Initialize the conversation in the conversations collections
      // hey (candidate name) we  have accepted your application for the job(job title)

        let conversation_id = uuidv4();
        let conversation_doc_id = uuidv4();
        let last_message_id = uuidv4();

        let last_message = `Hey ${data.candidate_name}, we have accepted your application for the ${data.jobTitle} role`;

        await setDoc(doc(db,"last_message", last_message_id),{
            last_message,
            last_message_id,
            createdAt: new Date(),
            conversation_id: conversation_id,
            employer_id: employer_id,
            candidate_id: data.candidate_id,
            company_name: data.companyName,
            candidate_name: data.candidate_name,
            jobTitle: data.jobTitle,
        })

        await setDoc(doc(db,"conversations", conversation_doc_id),{
           conversation_id,
           message:last_message,
           createdAt: new Date(),
           by: "employer",
           user_id : employer_id,
           conversation_doc_id
        })

        Notification({ message: "Accepted the Application" })

       }else if(action === 'reject'){
          try{
            console.log(data)
            await deleteDoc(doc(db, "applications", data.application_id));
          }catch(err){
             console.log(err);
          }
       }
   }


  useEffect(()=>{
    fetch()
  },[])

  return (
    <>
    {
      applicants && applicants.length === 0 ? (<h1>No applications</h1>) :
      applicants && applicants.length>0 ? (

                   <CommonTable
                    data={applicants}
                    columns={columns}
                    handleClick={handleClick}
                   />
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

export default EmployerApplicants