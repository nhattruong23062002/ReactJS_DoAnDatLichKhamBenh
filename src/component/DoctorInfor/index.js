import React from 'react'
import './DoctorInfor.scss';

const DoctorInfor = (doctor) => {
  return (
    <div className='infor-doctor container'>
    <div className='content-left'>
      <img src={`http://localhost:3333/${doctor.doctor.image}`} />
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