import React, { useState, useEffect } from "react";
import { Container, Row, Col, Toast } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import TrainItem from "../components/UI/TrainItem";
// import trainData from "../assets/data/trainData";
import { request, POST } from "../api/ApiAdapter";
import { useParams } from "react-router-dom";
import "../styles/find-train-form.css";
import FindTrainForm from "../components/UI/FindTrainForm";
import { toast } from "react-toastify";

const TrainListing = () => {
  const { clas, st, end, count, date } = useParams();
  const [trains, setTrains] = useState([]);

  const getFindTrains = async () => {
    console.log(date);
    let fromD = new Date(date);
    fromD.setHours(0);
    fromD.setMinutes(0);
    fromD.setSeconds(0);
    fromD.setMilliseconds(0);
    console.log(fromD);
    let toD = new Date(fromD);
    toD.setDate(toD.getDate() + 1);
    toD.setMilliseconds(toD.getMilliseconds() - 1);
    console.log(toD);
    fromD = fromD.toISOString();
    toD = toD.toISOString();
    const res = await request(`/schedule/find/train`, POST, {
      fromStation: st,
      toStation: end,
      fromDate: fromD,
      toDate: toD,
      train_class: clas,
      passengerCount: count,
    });
    if (!res.error) {
      setTrains(res);
      if (res?.length == 0) {
        toast.info("No schedules found for given information");
      }
    }
  };

  useEffect(() => {
    getFindTrains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log(clas);
  return (
    <Helmet title="Trains">
      <CommonSection title="Train Listing" />
      <div>
        <Container>
          <Row className="form__row">
            <Col lg="4" md="4">
              <div className="find__trains-left">
                <h2>Find your Train here</h2>
              </div>
            </Col>

            <Col lg="8" md="8" sm="12">
              <FindTrainForm />
            </Col>
          </Row>
        </Container>
      </div>
      <section>
        <Container>
          <Row>
            {trains.map((item) => (
              <TrainItem
                item={item}
                key={item.id}
                clas={clas}
                start={st}
                end={end}
                count={count}
                date={date}
              />
            ))}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default TrainListing;
