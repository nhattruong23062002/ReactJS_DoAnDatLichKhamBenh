import React from 'react'
import './DoctorInfor.scss';
import { BASE_URL } from "./../../utils/apiConfig";

const DoctorInfor = (doctor) => {
  return (
    <div className='infor-doctor container'>
    <div className='content-left'>
      <img src={`${BASE_URL}/${doctor.doctor.image}`} />
    </div>
    {doctor && doctor.doctor.Markdown &&
    <div className='content-right'>
        <h3>{doctor.doctor.positionData.valueVi}  {doctor.doctor.firstName} {doctor.doctor.lastName}</h3>
        <p>{doctor.doctor.Markdown.description}</p>
    </div>
      }
</div>
  )
}

export default DoctorInfor