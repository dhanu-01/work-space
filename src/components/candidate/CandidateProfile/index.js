import { Grid, TextField, Button } from '@mui/material'
import React, { useState, useRef, useEffect } from 'react'
import './CandidateProfile.css'
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Notification } from '../../../utils/Notification';
import { db,auth, storage } from '../../../firebaseConfig';
import CustomDropDown from '../../common/CustomDropDown';
import { SkillsDownlist } from '../../../constants';
import { jobTitle } from '../../../constants';
import { jobExperience } from '../../../constants';
import SearchDropDown from '../../common/SearchDropDown';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import { useNavigate } from 'react-router-dom';
import spinner from '../../../assests/spinner.gif'

const CandidateProfile = () => {
    //  console.log("user",JSON.parse(localStorage.getItem("user")))
    const Navigate = useNavigate();
    const inputRef = useRef();
    const user = JSON.parse(localStorage.getItem("user"));
    const uid = user.uid;


    const [loading, setLoading] = useState(false);

    const [uploading, setUpLoading] = useState(0);
    const [disabled, setDisabled] = useState(true);

    const [values, setValues] = useState({
        name: "",
        phoneNumber: "",
        email: "",
        location: "",
        primaryRole: "",
        jobExperience: "",
        skills: [],
        resume: " ",
    });

    const submit = async (e) => {
        e.preventDefault()
        //  console.log("vl")
        // Add a new document in collection "cities"
        //setDoc(docInfo,data)
        //docInfo = doc(database,collection name,docId)

        try {
            await setDoc(doc(db, "userInfo", uid), {
                ...values,
                type: "candidate"
            },{
                merge:true
            });
            Notification({ message: "Profile created successfully" })

        } catch {
            Notification({ message: "something went wrong" })
        }


    }

    const uploadResume = (e) => {
        const file = e.target.files[0]

        const storageRef = ref(storage, "candidate-resume/" + file.name);
        //uploadBytesResumable(StorageRef/file)
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //get task progress, including the number of bytes uploaded
                let progress =
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log(progress)
                setUpLoading(progress);
            },
            (error) => {
                Notification({ message: "something went wrong while uploading the resume" });
            },

            () => {
                //upload completed succesfully
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setValues({ ...values,  resume: downloadURL });
                    Notification({ message: "Resume uploaded successfully" })
                    setUpLoading(0)
                })
            }
        )

    }

    useEffect( () => {
        setLoading(true)
        console.log("setloading true")
        const user = JSON.parse(localStorage.getItem("user"));
        const uid = user.uid;
        let docRef = doc(db, "userInfo", uid);
        getDoc(docRef)
            .then((doc) => {
                if (doc.exists()) {
                    console.log(doc.data())
                    setValues(doc.data());
                } else {
                    console.log("No data");
                }
                setLoading(false)
            })

    }, [])

    const makeEditable = () => {
        if (disabled) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }

    const logout = () => {
        auth.signOut();
        localStorage.clear();
        Navigate('/candidate/auth');
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
            ) : (
                <div className='cd-onboarding-container'>
                    <form onSubmit={submit}>
                        <Grid container spacing={2}>

                            <Grid item xs={12} md={6}>
                                <div className='btn-container'>
                                    <Button type= {disabled? "submit" : "button"} onClick={makeEditable}> {disabled ? 'Edit' : 'Save'} </Button>
                                    <Button
                                    onClick={logout}
                                    > Logout </Button>
                                </div>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <label className='cd-feild-label'>Name*</label>
                                <TextField
                                    disabled={disabled}
                                    fullWidth
                                    required
                                    size="small"
                                    value={values.name}
                                    onChange={(e) => setValues({ ...values, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <label className='cd-feild-label'>Phone Number*</label>
                                <TextField
                                    disabled={disabled}
                                    fullWidth
                                    required
                                    size="small"
                                    value={values.phoneNumber}
                                    onChange={(e) => setValues({ ...values, phoneNumber: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <label className='cd-feild-label'>Email*</label>
                                <TextField
                                    disabled={true}
                                    fullWidth
                                    required
                                    size="small"
                                    value={values.email}
                                    onChange={(e) => setValues({ ...values, email: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <label className='cd-feild-label'>Primary Role</label>
                                <CustomDropDown
                                    disabled={disabled}
                                    required={true}
                                    dropDownList={jobTitle}
                                    value={values.primaryRole}
                                    onChange={(data) => setValues({ ...values, primaryRole: data })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <label className='cd-feild-label'>Experience</label>
                                <CustomDropDown
                                    disabled={disabled}
                                    required={true}
                                    dropDownList={jobExperience}
                                    value={values.jobExperience}
                                    onChange={(data) => setValues({ ...values, jobExperience: data })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <label className='cd-feild-label'>Skills</label>

                                <SearchDropDown
                                    disabled={disabled}
                                    required={true}
                                    dropDownList={SkillsDownlist}

                                    onChange={(data) => {
                                        if (!values.skills.includes(data)) {
                                            setValues({ ...values, skills: [...values.skills, data] })
                                        }
                                    }}
                                />

                                <div className='skills-container'>
                                    {
                                        values.skills.length > 0 && values.skills.map((skill, index) => {
                                            return (
                                                <div>
                                                    <p>{skill}</p>
                                                    {disabled ? (<CancelOutlined

                                                        sx={{
                                                            fontSize: "12px"
                                                        }}

                                                    />) : (
                                                        < CancelOutlined

                                                        color="error"
                                                    sx={{
                                                        fontSize: "12px"
                                                    }}
                                                    onClick={() => {
                                                        setValues({
                                                            ...values,
                                                            skills: values.skills.filter((item) => item !== skill)
                                                        })
                                                    }
                                                    }
                                                    />)}
                                                </div>
                                            )

                                        })
                                    }

                                </div>

                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <label className='cd-feild-label'>Resume</label>
                                {/* <div>
                                {values?.resume && (
                                <a href={values.resume} target="_blank" rel="noopener noreferrer">
                                view resume
                                </a>
                                )}
                                 </div> */}

                                {uploading > 0 && uploading <= 100 ? (<>Loading: {uploading} % </>) :
                                    (
                                        <>
                                            <input style={{ display: "none" }} ref={inputRef}
                                                accept='.pdf'
                                                type='file'
                                                name='resume'
                                                size="small"
                                                onChange={(e) => uploadResume(e)}
                                            />
                                            <Button disabled={disabled} onClick={() => inputRef.current.click()}>Upload Resume</Button></>)}
                            </Grid>

                        </Grid>
                    </form>
                </div>
            )}
        </>
    )
}

export default CandidateProfile
