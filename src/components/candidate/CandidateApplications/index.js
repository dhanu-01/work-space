import React, { useEffect, useState } from 'react'
import { doc, setDoc, getDocs, query, collection, where } from "firebase/firestore";
import { db, storage } from '../../../firebaseConfig';
import { Notification } from '../../../utils/Notification';
import spinner from '../../../assests/spinner.gif';
import CommonTable from '../../common/CommonTable';

const columns = [
   {
    title:"Company Name",
    dataIndex: "companyName"
   },
   {
     title: "Job Title",
     dataIndex : "jobTitle",
   },
   {
    title : "Interest shown on",
    dataIndex: "createdAt",
    type: "date",
   },
   {
    title:"Status",
    dataIndex:"status",
   }
]

const CandidateApplications = () => {
  let candidate_id = JSON.parse(localStorage.getItem("user")).uid;
  const [applications, setApplications] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    //get call to firestore to get all  the applications where candidate id is equal to the user_id
    
    // console.log(candidate_id)
    try {
      const q = await query(collection(db, "applications"),where("candidate_id", "==", candidate_id))
      const querySnapshot = await getDocs(q);
      let allApplications = []
      querySnapshot.forEach((doc)=>{
          allApplications.push(doc.data());
      })
      setApplications(allApplications)
    } catch (err) {
      Notification({ message: "Error can't get the applications" })
    }
     setLoading(false);

  }

  useEffect(() => {
    fetch()
  }, [])

  return (
    <>
      {
        applications && applications.length === 0 ? (<h1>No applications</h1>) : 
        applications && applications.length>0 ? (

                     <CommonTable
                      data={applications}
                      columns={columns}
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

export default CandidateApplications