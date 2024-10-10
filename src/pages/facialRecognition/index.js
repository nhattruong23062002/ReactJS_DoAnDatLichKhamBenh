import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import styles from "../facialRecognition/facialRecognition.module.css";

const FaceRecognition = () => {
  const videoRef = useRef(null);
  const [expressions, setExpressions] = useState({});
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log("Loading models...");
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        console.log("tinyFaceDetector loaded");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
        console.log("faceExpressionNet loaded");
        await faceapi.nets.ageGenderNet.loadFromUri("/models");
        console.log("ageGenderNet loaded");
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error("Error accessing webcam:", err));
    };

    loadModels().then(startVideo);
  }, []);

  const handleVideoPlay = async () => {
    const displaySize = {
      width: videoRef.current.width,
      height: videoRef.current.height,
    };
    faceapi.matchDimensions(videoRef.current, displaySize);

    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 320, 
            scoreThreshold: 0.4 
          })
        )
        .withFaceExpressions()
        .withAgeAndGender();

      console.log("Detections:", detections);
      if (detections.length > 0) {
        const { age, gender, expressions } = detections[0];
        setAge(Math.round(age));
        setGender(gender);
        setExpressions(expressions);
      } else {
        console.log("No faces detected.");
      }
    }, 1000);
  };

  return (
    <div style={{textAlign:"center", height:"800px"}}>
      <video
        ref={videoRef}
        width="720"
        height="560"
        autoPlay
        onPlay={handleVideoPlay}
      />
      <div>
        <h3>Age: {age}</h3>
        <h3>Gender: {gender}</h3>
        <h3>Expressions:</h3>
        <ul>
          {Object.entries(expressions).map(([expression, value]) => (
            <li key={expression}>
              {expression}: {Math.round(value * 100)}%
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FaceRecognition;
