import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom";
import Select from "react-select";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "moment/locale/vi";
import { getTokenFromLocalStorage } from "../../../utils/tokenUtils";
import jwt_decode from "jwt-decode";

const ManageSchedule = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [doctor, setDoctor] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [times, setTIMES] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const token = getTokenFromLocalStorage();
  const [activeTimes, setActiveTimes] = useState([]);
  const [role, setRole] = useState("");
  const [selectKey, setSelectKey] = useState(Date.now()); 

  startDate.setHours(0, 0, 0, 0);
  const formattedStartDate = new Date(startDate).getTime();

  useEffect(() => {
    const token = getTokenFromLocalStorage();
    if (token) {
      try {
        // Giải mã token để lấy thông tin customerId
        const decodedToken = jwt_decode(token);
        const {id:id, roleId: roleId } = decodedToken;
        setDoctorId(id)
        setRole(roleId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const getAllDoctor = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3333/users/getall-doctor?name="
      );
      setDoctor(response.data.payload);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const getAllTime = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3333/allcode/?type=TIME"
      );
      setTIMES(response.data.payload);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const allName = () => {
    const result = [];
    if (doctor && doctor.length > 0) {
      doctor.map((item, index) => {
        let object = {};
        let allName = `${item.firstName} ${item.lastName}`;
        object.value = item.id;
        object.label = allName;
        result.push(object);
      });
      return result;
    }
  };

  const options = allName();

  useEffect(() => {
    getAllDoctor();
    getAllTime();
  }, []);

  const handleTimeClick = (timeId) => {
    // Kiểm tra xem thời gian đã được kích hoạt chưa
    const isActive = activeTimes.includes(timeId);

    if (isActive) {
      // Nếu đã kích hoạt, hãy loại bỏ nó khỏi danh sách kích hoạt
      setActiveTimes(activeTimes.filter((keyMap) => keyMap !== timeId));
    } else {
      // Nếu chưa kích hoạt, hãy thêm nó vào danh sách kích hoạt
      setActiveTimes([...activeTimes, timeId]);
    }
  };
  
  
  const handleSubmit = async () => {
    try {
      let result = [];
      if (activeTimes && activeTimes.length > 0) {
        activeTimes.map((time) => {
          let object = {};
          object.doctorId = role === 'R1'? selectedOption.value : doctorId;
          object.date = formattedStartDate;
          object.timeType = time;
          object.maxNumber = 10;
          result.push(object);
        });
      }
      
      const response = await axios.post("http://localhost:3333/schedule", {
        result,
        doctorId: role === 'R1'? selectedOption.value : doctorId,
        date: formattedStartDate,
      });
      if (response.data.payload.length > 0) {
        alert("Tạo lịch thành công");
        setActiveTimes([]);
        setSelectedOption(null);
        setSelectKey(Date.now()); 
      } else {
        alert("Lịch đã tạo trước đó");
      }
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  return (
    <div className="container">
      <h3 className="doctor-title">Quản lý kế hoạch khám bệnh cho bác sĩ</h3>
      <div className="schedule-wrapTop ">
        {role && role === 'R1' ? (
        <>
          <div className="schedule-name">
            <h6>Chọn bác sĩ</h6>
            <Select
              key={selectKey} 
              defaultValue={selectedOption}
              onChange={setSelectedOption}
              options={options}
              className="schedule-select-doctor"
            />
          </div>
          <div className="schedule-date">
            <h6>Chọn ngày</h6>
            <DatePicker
              className="datepicker"
              selected={startDate}
              minDate={new Date()}
              onChange={(date) => setStartDate(date)}
            />
          </div>
          </>       
        ):(
          <div className="schedule-date">
          <h6>Chọn ngày</h6>
          <DatePicker
            className="datepicker"
            selected={startDate}
            minDate={new Date()}
            onChange={(date) => setStartDate(date)}
          />
        </div>
        )}
      </div>
      <div className="schedule-wrapBottom">
        {times &&
          times.map((p) => (
            <span
              onClick={() => handleTimeClick(p.keyMap)}
              className={activeTimes.includes(p.keyMap) ? "time-active" : ""}
              key={p.id}
            >
              {p.valueVi}
            </span>
          ))}
      </div>
      <button className="btn-manageDoctor" onClick={handleSubmit}>
        Lưu lại
      </button>
    </div>
  );
};

export default ManageSchedule;
