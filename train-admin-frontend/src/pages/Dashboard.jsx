import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import Singlecard from "../components/reuseable/SingleCard";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import RevenueChart from "../charts/RevenueChart";
// import RevenueStatsChart from "../charts/TrainStatsChart";
import TrainStatsChart from "../charts/TrainStatsChart";
import { GET, request } from "../api/ApiAdapter";

var stompClient = null;
const Dashboard = () => {
  const [trainObj, setTrainObj] = useState({
    title: "Total Trains",
    totalNumber: 0,
  });

  const [revenueObj, setRevenueObj] = useState({
    title: "All Revenue",
    totalNumber: 0,
  });

  const [ticketObj, setTicketObj] = useState({
    title: "All Ticket Sales",
    totalNumber: 0,
  });

  const [profitObj, setProfitObj] = useState({
    title: "Bookings",
    totalNumber: 0,
  });

  const connect = () => {
    let Sock = new SockJS(`http://localhost:39388/tracker/ws`);
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, () => {
      console.error("fail");
    });
  };

  const onConnected = () => {
    stompClient.subscribe("/dashboard/booking/change", onBookingChange);
    stompClient.subscribe("/dashboard/payment/change", onPaymentChange);
    stompClient.subscribe("/dashboard/reservation/change", onReservationChange);
    stompClient.subscribe("/dashboard/train/change", onTrainChange);
  };

  const trainCount = async () => {
    const res = await request(`train/count`, GET);
    if (!res.error) {
      console.log(res);
      setTrainObj({ ...trainObj, totalNumber: res });
    }
  };

  const allRevenue = async () => {
    const res = await request(`payment/total`, GET);
    if (!res.error) {
      console.log("revenue", res >= 0);
      setRevenueObj({ ...revenueObj, totalNumber: res });
    }
  };

  const allTicketSales = async () => {
    const res = await request(`reservation/ticket/sales/count`, GET);
    if (!res.error) {
      setTicketObj({ ...ticketObj, totalNumber: res });
    }
  };

  const allBookings = async () => {
    const res = await request(`booking/count`, GET);
    if (!res.error) {
      setProfitObj({ ...profitObj, totalNumber: res });
    }
  };

  const [chart, setChart] = useState([]);
  const [rev, setRev] = useState("");

  // <--------- Code for revenue train stats
  const colors = [
    "#FF5733",
    "#FF8C00",
    "#FFC300",
    "#F4D03F",
    "#F9E79F",
    "#FAD7A0",
    "#FDEBD0",
    "#E74C3C",
    "#E67E22",
    "#F39C12",
    "#F9690E",
    "#F39C12",
    "#D4AC0D",
    "#E5E8E8",
    "#ABB2B9",
    "#808B96",
    "#566573",
    "#1F618D",
    "#2874A6",
    "#3498DB",
    "#2E86C1",
    "#5DADE2",
    "#85C1E9",
    "#AED6F1",
    "#D4E6F1",
    "#1B4F72",
    "#2E86C1",
    "#A9DFBF",
    "#196F3D",
    "#28B463",
    "#82E0AA",
    "#58D68D",
    "#27AE60",
    "#52BE80",
    "#229954",
    "#145A32",
    "#7DCEA0",
    "#186A3B",
    "#4CAF50",
    "#8BC34A",
    "#27AE60",
    "#68C3A3",
    "#1F618D",
    "#5499C7",
    "#3498DB",
    "#85C1E9",
    "#2874A6",
    "#1A5276",
    "#2E86C1",
    "#2471A3",
  ];

  const revenueData = async () => {
    const res = await request(`payment/chart/revenue/all`, GET);
    if (!res.error) {
      setChart(res);
    }
  };
  const labels = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const trainRevenueData = async () => {
    const res = await request(`booking/chart/train/statics`, GET);
    if (!res.error) {
      const trainStaticsData = {
        labels,
        datasets: [
          ...res.map((train, i) => ({
            label: train?.label,
            data: [...train?.data],
            backgroundColor: colors[i],
            borderColor: colors[i],
          })),
        ],
      };
      console.log("train stat", trainStaticsData);
      setRev(trainStaticsData);
    }
  };

  const onTrainChange = (payload) => {
    console.log("hit with ws train");
    trainCount();
  };

  const onBookingChange = (payload) => {
    allBookings();
  };

  const onReservationChange = (payload) => {
    allTicketSales();
  };

  const onPaymentChange = (payload) => {
    allRevenue();
    revenueData();
    trainRevenueData();
  };

  useEffect(() => {
    connect();
    trainCount();
    allRevenue();
    allTicketSales();
    allBookings();
    revenueData();
    trainRevenueData();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard__wrapper">
        <div className="dashboard__trainds">
          <Singlecard item={trainObj} />
          <Singlecard item={revenueObj} />
          <Singlecard item={ticketObj} />
          <Singlecard item={profitObj} />
        </div>

        <div className="statics">
          <div className="stats">
            <h3 className="stats__title">Revenue Statistics</h3>
            <RevenueChart data={chart} />
          </div>

          <div className="stats">
            <h3 className="stats__title">Train Statistics</h3>
            {rev !== "" && <TrainStatsChart data={rev} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
