import React, { useState, useRef, useEffect } from 'react';
import { Grid, TextField } from '@mui/material/';
import Button from '@mui/material/Button';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db,auth } from "./../../../../firebaseConfig"
import { Notification } from '../../../../utils/Notification';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from './../../../../firebaseConfig';
import './EmployerProfile.css';
import spinner from '../../../../assests/spinner.gif'
import { useNavigate } from 'react-router-dom';


const EmployerProfile = () => {

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const uid = user.uid;
  const Navigate = useNavigate();

  const inputRef = useRef()
  const [uploading, setUpLoading] = useState(null);
  const [values, setValues] = useState({
    companyName: "",
    industryType: "",
    noOfEmployee: "",
    companyWebsite: "",
    companyEmail: "",
    companyPhone: "",
    companyLocation: "",
    companyTagline: "",
    companyDescription: "",
    logo: ""
  })

  useEffect(() => {
    setLoading(true)
    console.log("setloading true")
    let docRef = doc(db, "userInfo", uid);
    getDoc(docRef)
      .then((doc) => {
        if (doc.exists()) {
          setValues(doc.data());
        } else {
          console.log("No data");
        }
        setLoading(false)
        console.log("setLoaing false")
      })

  }, [])

  const logout = () => {
    auth.signOut();
    localStorage.clear();
    Navigate('/candidate/auth');
}


  const uploadLogo = (e) => {

    let file = e.target.files[0];
    console.log(file)
    //ref(storage,'path tofile',filename)
    const storageRef = ref(storage, "company-logo/" + file.name);
    //uploadBytesResumable(StorageRef/file)
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //get task progress, including the number of bytes uploaded
        const progress =
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        // console.log(progress)
        setUpLoading(progress);
      },
      (error) => {
        Notification({ message: "something went wrong while uploading" });
      },

      () => {
        //upload completed succesfully
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setValues({ ...values, logo: downloadURL });
          Notification({ message: "file uploaded successfully" })
          setUpLoading(0)
        })
      }
    )
  }

  const makeEditable = async () => {
    if (disabled) {
      setDisabled(false)
    } else {
      setDisabled(true)

      //call firebase function to update employer profile
      try {
        await setDoc(doc(db, "userInfo", uid), {
          ...values
        }, { merge: true });
        Notification({ message: "profile updated successful" })
      } catch (err) {
        Notification({ message: "Something went wrong" })
      }
    }
  }
  return (
    <>
      {loading ? (
        <div>
        <img
            style={{ width: "inherit", maxWidth: "100%" }}
            src={spinner}
            alt="loading"
        />
    </div>
      ) :
        (
          <div className='onboarding-container'>

            <form >


              <Grid container spacing={2}>

                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={2}>
                      <div className='upload-btn-container'>

                        {uploading > 0 && uploading <= 100 ? (<div> Loading: {uploading} %</div>) :
                          (
                            <>
                              <input style={{ display: 'none' }}
                                accept='image/*'
                                ref={inputRef}
                                type={"file"}
                                value={""}
                                onChange={(e) => uploadLogo(e)}
                              />


                              <Button
                                sx={{ display: disabled ? "none" : "block" }}
                                disabled={disabled}
                                onClick={() => inputRef.current.click()}>
                                Upload file
                              </Button>

                              </>)}
                            </div>
                            {values.logo && <img alt="logo" src={values.logo} height="100px" width="100px" />}

                    </Grid>

                    <Grid item xs={12} md={8}>
                      <TextField
                        fullWidth
                        disabled={disabled}
                        required
                        size="small"
                        value={values.companyName}
                        onChange={(e) => setValues({ ...values, companyName: e.target.value })}
                      />

                      <TextField
                        disabled={disabled}
                        fullWidth
                        size="small"
                        value={values.companyTagline}
                        onChange={(e) => setValues({ ...values, companyTagline: e.target.value })}
                      />

                    </Grid>

                    <Grid item xs={12} md={2}>
                      <div className='btn-container'>
                        <Button onClick={makeEditable}> {disabled ? 'Edit' : 'Save'} </Button>
                        <Button
                         onClick={logout}
                        > Logout </Button>
                      </div>
                    </Grid>

                  </Grid>

                </Grid>


                <Grid item xs={12} sm={6}>
                  <label className='feild-label'>CompanyPhone</label>
                  <TextField
                    disabled={disabled}
                    fullWidth
                    required
                    size="small"
                    value={values.companyPhone}
                    onChange={(e) => setValues({ ...values, companyPhone: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <label className='feild-label'>companyEmail</label>
                  <TextField
                    disabled={disabled}
                    fullWidth
                    required
                    size="small"
                    value={values.companyEmail}
                    type="email"
                    onChange={(e) => setValues({ ...values, companyEmail: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <label className='feild-label'>companyLocation</label>
                  <TextField
                    disabled={disabled}
                    fullWidth
                    size="small"
                    value={values.companyLocation}
                    onChange={(e) => setValues({ ...values, companyLocation: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <label className='feild-label'>companyWebsite</label>
                  <TextField
                    disabled={disabled}
                    fullWidth
                    size="small"
                    value={values.companyWebsite}
                    onChange={(e) => setValues({ ...values, companyWebsite: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <label className='feild-label'>IndustryType</label>
                  <TextField
                    disabled={disabled}
                    fullWidth
                    size="small"
                    value={values.industryType}
                    onChange={(e) => setValues({ ...values, industryType: e.target.value })}
                  />
                </Grid>


                <Grid item xs={12} sm={6}>
                  <label className='feild-label'>No of Employees</label>
                  <TextField
                    fullWidth
                    disabled={disabled}
                    size="small"
                    value={values.noOfEmployee}
                    onChange={(e) => setValues({ ...values, noOfEmployee: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <label className='feild-label'>companyDescription</label>
                  <TextField
                    fullWidth
                    disabled={disabled}
                    multiline
                    minRows={5}
                    value={values.companyDescription}
                    onChange={(e) => setValues({ ...values, companyDescription: e.target.value })}
                  />
                </Grid>

              </Grid>

            </form>
          </div>
        )}
    </>
  );
}

export default EmployerProfile