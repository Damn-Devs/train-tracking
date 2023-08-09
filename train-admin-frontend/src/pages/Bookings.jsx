import React, { useEffect, useState } from "react";
import "../styles/bookings.css";
import TrainItem from "../components/UI/TrainItem";
import { GET, request } from "../api/ApiAdapter";
import { over } from "stompjs";
import SockJS from "sockjs-client";

var stompClient = null;
const Bookings = () => {
  const [trainData, setTrainData] = useState([]);
  const trainRevenueData = async () => {
    const res = await request(`train/revenue/all`, GET);
    if (!res.error) {
      setTrainData(res);
    }
  };

  const connect = () => {
    let Sock = new SockJS(`http://localhost:39388/tracker/ws`);
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, () => {
      console.error("fail");
    });
  };

  const onConnected = () => {
    stompClient.subscribe("/dashboard/booking/change", onBookingChange);
    stompClient.subscribe("/dashboard/train/change", onBookingChange);
  };

  const onBookingChange = (payload) => {
    trainRevenueData();
  };

  useEffect(() => {
    connect();
    trainRevenueData();
  }, []);

  return (
    <div className="bookings">
      <div className="booking__wrapper">
        <h2 className="booking__title">Train Revenue</h2>

        <div className="booking__train-list">
          {trainData?.map((item) => (
            <TrainItem item={item} key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
