import React,{useState,useEffect} from 'react'
import './DoctorSchedule.scss'
import moment from 'moment';
import localization from 'moment/locale/vi';
import { BsCalendarDateFill } from "react-icons/bs";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import { getTokenFromLocalStorage } from "../../utils/tokenUtils";


const DoctorSchedule = (id) => {
  const [timeSchedule, setTimeSchedule] = useState(null);
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = getTokenFromLocalStorage();
    if (token) {
      try {
        // Giải mã token để lấy thông tin customerId
        const decodedToken = jwt_decode(token);
        const { roleId: roleId} = decodedToken;
        setRole(roleId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);



  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  let arrDate = []
  for(let i = 0;i < 7; i++){
    let object = {};
    if(i===0){
      let labelVi2 = moment(new Date()).format('DD/MM');
      let today = `Hôm nay - ${labelVi2}`
      object.label = today
    }else{
      let labelVi = moment(new Date()).add(i, 'days').format('dddd - DD/MM');
      object.label = capitalizeFirstLetter(labelVi);
    }
    object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
    arrDate.push(object);
  }
  console.log('««««« arrDate »»»»»', arrDate);
  const handleScheduleToday = async () => {
    try {
      const response = await axios.get(`http://localhost:3333/schedule?doctorId=${id.doctorId}&date=${arrDate[0].value}`);
      setTimeSchedule(response.data.payload);
    } catch (error) {
    console.error("Error", error);
  }
};
  useEffect(() => {
    handleScheduleToday();
  }, []);

  
  const handleChangeOption = async (event) => {
    try {
      let date = event.target.value;
      console.log('««««« date »»»»»', date);
      const response = await axios.get(`http://localhost:3333/schedule?doctorId=${id.doctorId}&date=${date}`);
      setTimeSchedule(response.data.payload);
      console.log('««««« response.data.payload »»»»»', response.data.payload);
    } catch (error) {
    console.error("Error", error);
  }
 };

 const handleClick = async (data) => {
  if(role === 'R3'){
    navigate(`/booking/${data.id}`);
  }else{
    navigate(`/login`);
  }
};

  return (
    <div>
      <select className='select-day-schedule'onChange={(event) => handleChangeOption(event)}>
      {arrDate && arrDate.length > 0 && arrDate.map((a,index) => (
        <option key={index} value={a.value}>{a.label}</option>
        ))}
      </select>
      <div className='icon-calender'><BsCalendarDateFill/> Lịch khám</div>
      <div className='list-day-schedule'>
        <ul>
        {timeSchedule && timeSchedule.length > 0 ? timeSchedule.map((t) => (
            <li key={t.id} onClick={() => handleClick(t)}>{t.timeTypeData.valueVi}</li>
            )):(
              <p>Không có lịch hẹn trong thời gian này, vui lòng chọn thời gian khác.</p>
            )}
        </ul>
      </div>
    </div>
  )
}

export default DoctorSchedule
