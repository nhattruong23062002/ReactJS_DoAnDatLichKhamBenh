import React, { useState, useEffect } from "react";
import "./DoctorSchedule.scss";
import moment from "moment";
import localization from "moment/locale/vi";
import { BsCalendarDateFill } from "react-icons/bs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { getTokenFromLocalStorage } from "../../utils/tokenUtils";
import { BASE_URL } from "./../../utils/apiConfig";

const DoctorSchedule = (id) => {
  const [timeSchedule, setTimeSchedule] = useState(null);
  const [filteredTimeSchedule, setFilteredTimeSchedule] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [role, setRole] = useState("");
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 3600000);

    return () => clearInterval(timer);
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const token = getTokenFromLocalStorage();
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        const { roleId } = decodedToken;
        setRole(roleId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  let arrDate = [];
  for (let i = 0; i < 7; i++) {
    let object = {};
    if (i === 0) {
      let labelVi2 = moment(new Date()).format("DD/MM");
      let today = `Hôm nay - ${labelVi2}`;
      object.label = today;
    } else {
      let labelVi = moment(new Date()).add(i, "days").format("dddd - DD/MM");
      object.label = capitalizeFirstLetter(labelVi);
    }
    object.value = moment(new Date()).add(i, "days").startOf("day").valueOf();
    arrDate.push(object);
  }

  const handleScheduleToday = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/schedule?doctorId=${id.doctorId}&date=${arrDate[0].value}`
      );
      setTimeSchedule(response.data.payload);
      setCurrentDate(arrDate[0].value);
    } catch (error) {
      console.error("Error", error);
    }
  };
  useEffect(() => {
    handleScheduleToday();
  }, []);

  useEffect(() => {
    if (timeSchedule && currentDate) {
      const filtered = timeSchedule.filter((t) => {
        const isFull = t.currentNumber >= t.maxNumber;
        const [startTime, endTime] = t.timeTypeData.valueVi
          .split(" - ")
          .map((time) => parseInt(time.split(":")[0]));
        const isHidden =
          currentHour >= endTime &&
          currentHour >= startTime &&
          arrDate[0].value == currentDate;
        return !isHidden;
      });
      setFilteredTimeSchedule(filtered);
    }
  }, [timeSchedule, currentDate, currentHour]);

  const handleChangeOption = async (event) => {
    try {
      let date = event.target.value;
      const response = await axios.get(
        `${BASE_URL}/schedule?doctorId=${id.doctorId}&date=${date}`
      );
      setTimeSchedule(response.data.payload);
      setCurrentDate(date);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleClick = async (data) => {
    if (role === "R3") {
      navigate(`/booking/${data.id}`);
    } else {
      navigate(`/login`);
    }
  };

  return (
    <div>
      <select
        className="select-day-schedule"
        onChange={(event) => handleChangeOption(event)}
      >
        {arrDate &&
          arrDate.length > 0 &&
          arrDate.map((a, index) => (
            <option key={index} value={a.value}>
              {a.label}
            </option>
          ))}
      </select>
      <div className="icon-calender">
        <BsCalendarDateFill /> Lịch khám
      </div>
      <div className="list-day-schedule">
        <ul>
          {filteredTimeSchedule && filteredTimeSchedule.length > 0 ? (
            filteredTimeSchedule.map((t) => {
              const isFull = t.currentNumber >= t.maxNumber;
              return (
                <li
                  key={t.id}
                  onClick={() => !isFull && handleClick(t)}
                  className={isFull ? "disabledTimeSchedule" : ""}
                >
                  {t.timeTypeData.valueVi}
                </li>
              );
            })
          ) : (
            <p>
              Không có lịch hẹn trong thời gian này, vui lòng chọn thời gian
              khác.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DoctorSchedule;
