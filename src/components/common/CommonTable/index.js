import React from 'react';
import './commonTable.css';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';

const CommonTable = ({ data, columns ,handleClick}) => {
   

  return (
    <div>
      <div className='table-head'>
        {columns.map((column, i) => {
          return (
            <div key={i}
            style={{
               width:column.width?column.width:"25%"
            }}
            >
              {column.title}
            </div>
          )
        })
        }
      </div>
      {
        data.map((row, index) => {
          return (
            <div className='table-row'>
              {
                columns.map((column, i) => {
                  if (column.type === "date") {
                    return (
                      <div>
                        {row[column.dataIndex].toDate().toDateString()}
                      </div>
                    )
                  } else if (column.dataIndex === 'status') {
                    if (row[column.dataIndex] === 'Accepted') {
                      return (
                        <div>
                          <ThumbUpOffAltIcon 
                          sx={{
                            color:"green"
                          }}
                          />
                        </div>)
                    } else if (row[column.dataIndex] === 'Rejected') {
                      return (<div>
                        <ThumbDownOffAltIcon 
                        sx={{
                          color:"red"
                        }}
                        />
                      </div>)
                    } else {
                      return (
                        <div>
                          <HourglassEmptyIcon
                          sx={{
                            color:"blue"
                          }}
                          
                          />
                        </div>)
                    }
                  }else if(column.type === 'file') {
                     return (
                       <a
                       href={row[column.dataIndex]}
                       target='__blank'
                       > 
                       View Resume
                       </a>
                     )
                  }else if(column.type==='action'){
                     return(
                        <div 
                        style={{
                          display:"flex",
                          alignItems:"center",
                          gap:"10px"
                        }}
                        >
                          { 
                            column.childrenAction.map((item,i)=>{
                              return (
                                    <button
                                     disabled= {row['status']==='Accepted' ? true :false}
                                    onClick = {()=>handleClick(item.action,row)}
                                    >
                                      {item.label}
                                    </button>
                              )
                            })
                          }
                        </div>
                     )
                  }
                  else {
                    return (
                      <div
                      style={{
                        width:column.width?column.width:"25%",
                        textAlign:"center"
                     }}
                      >
                        {row[column.dataIndex]}
                      </div>
                    )
                  }
                })

              }
            </div>
          )
        })
      }

    </div>
  )
}

export default CommonTable