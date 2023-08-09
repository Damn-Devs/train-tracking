import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { request, GET } from "../api/ApiAdapter";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { format } from "date-fns";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 6.2442,
  lng: 80.0591,
};

const styles = {
  hide: [
    {
      featureType: "poi",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
  ],
};
var stompClient = null;
const Locate = () => {
  const [libraries] = useState(["places"]);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY,
    componentRestrictions: { country: "ca" },
    libraries,
  });

  const [map, setMap] = useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const [trainData, setTrainData] = useState([]);

  // const trainData = [
  //   {
  //     id: 1,
  //     name: "Ruhunu Kumari",
  //     latitude: 6.0333,
  //     longitude: 80.2144,
  //     // description: "",
  //   },

  //   // Add more train data as needed
  // ];

  const loadAllScheduleData = async () => {
    let from = new Date();
    from.setHours(0);
    from.setMinutes(0);
    from.setSeconds(0);
    from.setMilliseconds(0);
    console.log(from);
    let to = new Date(from);
    to.setDate(to.getDate() + 1);
    to.setMilliseconds(to.getMilliseconds() - 1);
    console.log(to);
    from = from.toISOString();
    to = to.toISOString();

    const res = await request(
      `schedule/getschstation/all/trainloc/${from}/${to}`,
      GET
    );
    if (!res.error) {
      setTrainData(res);
    }
    // else navigate("/page/unauthorized/access");
  };

  const connect = () => {
    let Sock = new SockJS(`http://localhost:39388/tracker/ws`);
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, () => {
      console.error("fail");
    });
  };

  const onConnected = () => {
    stompClient.subscribe("/dashboard/schedule/change", onScheduleChange);
  };

  const onScheduleChange = () => {
    loadAllScheduleData();
  };

  useEffect(() => {
    loadAllScheduleData();
    connect();
  }, []);

  useEffect(() => {
    if (trainData.length > 0 && map) {
      const bounds = new window.google.maps.LatLngBounds();
      trainData.forEach((train) => {
        bounds.extend(
          new window.google.maps.LatLng(train.latitude, train.longitude)
        );
      });
      map.fitBounds(bounds);
    }
  }, [trainData, map]);

  const [activeTrain, setActiveTrain] = useState(null);

  return isLoaded ? (
    <div className="settings h-full">
      <div className="settings__wrapper h-full">
        <h2 className="settings__title">Train Tracking</h2>
        <div>
          {/* <div className="w-full mb-2 flex justify-end space-x-2">tsst</div> */}
          <div className="h-[75vh] w-full overflow-hidden relative">
            <GoogleMap
              mapContainerStyle={containerStyle}
              defaultCenter={center}
              onLoad={onLoad}
              options={{
                styles: styles.hide,
                fullscreenControl: false,
                clickableIcons: false,
                mapTypeControl: false,
                streetViewControl: false,
                maxZoom: 17,
              }}
            >
              {trainData.map((train) => (
                <Marker
                  key={train.id}
                  position={{ lat: train.latitude, lng: train.longitude }}
                  onClick={() => setActiveTrain(train)}
                />
              ))}

              {/* Render the InfoWindow conditionally based on the activeTrain */}
              {activeTrain && (
                <InfoWindow
                  position={{
                    lat: activeTrain.latitude,
                    lng: activeTrain.longitude,
                  }}
                  onCloseClick={() => setActiveTrain(null)}
                >
                  {/* Content for InfoWindow */}
                  <div className="p-3">
                    <h3>Train Name - {activeTrain.name}</h3>
                    <p>{activeTrain.description}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
export default Locate;
