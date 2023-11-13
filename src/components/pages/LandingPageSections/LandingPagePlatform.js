import React from 'react';
import SolutionCard from '../../common/SolutionCard';
import './Landingpage.css';
import { Grid } from '@mui/material';
import icon from '../../../assests/spinner.gif'
import CampaignIcon from '@mui/icons-material/Campaign';

const dataList = [
  {
    title: 'Marketing & Communication',
    description :'237 Jobs Available',
    icon : icon
  },
  {
    title: 'Design & Development',
    description :'237 Jobs Available',
    icon : icon//need to add icons here
  },
  {
    title: 'Human Research & Development',
    description :'237 Jobs Available',
    icon : icon
  },
  {
    title: 'Finance Managment',
    description :'237 Jobs Available',
    icon : icon
  },
  {
    title: 'Government Jobs',
    description :'237 Jobs Available',
    icon : icon
  },
  {
    title: 'Business & Consulting',
    description :'237 Jobs Available',
    icon : icon
  },
  {
    title: 'Customer Support Care',
    description :'237 Jobs Available',
    icon : icon
  },
  {
    title: 'Project Management',
    description :'237 Jobs Available',
    icon : icon
  },
]


const LandingPagePlatform = () => {
  return (
    <div className='onePlatform-container'>
      <h1>One Platform many <span>Solution</span></h1>
      <Grid container
      spacing={2}
      sx={{
         display:"flex",
         justifyContent:"center",
         alignItems:"center",
         marginTop:"50px"
      }}
      >
      {
        dataList.map((e,i)=>(
          <SolutionCard
          title={e.title}
          description = {e.description}
          icon= {e.icon}
          key={i} />
        ))
      }
      </Grid>
    </div>
  )
}

export default LandingPagePlatform