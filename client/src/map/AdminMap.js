//📌
import React, { useRef, useState, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Polyline,
} from "@react-google-maps/api";
import { message } from "antd";
import { note1 } from "./Notification.js";
import { FaClock } from "react-icons/fa";
import { findNearest } from "geolib";
import customIcon from "./customMapIcon";
import { w3cwebsocket as W3CWebSocket } from "websocket";
// import _ from "lodash";
import mapStyles from "./mapStyles";
import PuffLoader from "react-spinners/PuffLoader";
import { css } from "@emotion/react";
import moment from "moment";
import "moment/min/locales";
moment.locale("hy-am");

//📌
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};

//📌
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

//📌 heroku-i vra normala sa
const HOST =
  process.env.NODE_ENV === "production"
    ? window.location.origin.replace(/^http/, "ws")
    : "ws://localhost:8080";

// todo
export default function AdminMap() {
  const [markersInf, setMarkersInf] = useState([]);
  const [selected, setSelected] = useState();
  const [mapCenter, setMapCenter] = useState({
    lat: 40.177536,
    lng: 44.512678,
  });
  const [rigthCl, setRigthCl] = useState(false);
  const [polyline, setPolyline] = useState({ id: "", polData: [] });
  // console.log(polyline);
  console.log(markersInf);

  //📌
  const mapRef = useRef();
  const wsAdminRef = useRef(null);
  const sRef = useRef(+0);

  //🔶
  function time(e) {
    let p = 0;

    let point = findNearest(
      { lat: e.latLng.lat(), lng: e.latLng.lng() },
      polyline.polData
    );
    p = polyline.polData.findIndex((item) => point.time === item.time);

    for (let i = 0; i <= p; i++) {
      sRef.current += polyline.polData[i].dist;
    }

    note1(
      <FaClock size={18} color="blue" />,
      "Ժամը " +
        moment(polyline.polData[p].time).format("LT") +
        "    s = " +
        sRef.current.toFixed(0)
    );

    sRef.current = 0;
  }

  //📌
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "your key ...",
  });

  //📌 - spinner
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  //📌
  const plOptions = {
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 4,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
    clickable: true,
    draggable: false,
    editable: false,
    radius: 30000,
    zIndex: 1,
  };

  //🔶
  useEffect(() => {
    wsAdminRef.current = new W3CWebSocket(HOST);

    wsAdminRef.current.onopen = () => {
      console.log("ws connection has opened");
    };

    wsAdminRef.current.onerror = function () {
      console.log("Connection Error");
    };

    wsAdminRef.current.onclose = () => {
      console.log("ws admin has closed");
    };

    wsAdminRef.current.onmessage = (e) => {
      const wssData = JSON.parse(e.data);
      console.log(wssData);

      if (wssData.type === "polyline") {
        setPolyline({ id: wssData.id, polData: wssData.polData });
        return;
      }

      if (wssData.data === null) {
        setRigthCl(false);
      }

      if (markersInf.length) {
        let i = markersInf.findIndex((item, index) => {
          return item.id === wssData.id;
        });

        if (i !== -1) {
          markersInf[i] = wssData;
        } else {
          markersInf.push(wssData);
        }
      } else {
        markersInf[0] = wssData;
      }

      setMarkersInf([...markersInf]);
    };

    return () => {
      wsAdminRef.current.close();
      console.log("ws closed");
    };
  }, [markersInf]);

  //🔶
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  //
  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  //
  return (
    <div>
      <PuffLoader color="green" loading={!isLoaded} css={override} size={150} />

      {isLoaded && (
        <GoogleMap
          id="map"
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={mapCenter}
          options={options}
          onLoad={onMapLoad}
        >
          {markersInf.map((item) => {
            return (
              <>
                {/* {polyline.id === item?.id && rigthCl && (	)} */}
                <Polyline
                  path={polyline.polData}
                  options={plOptions}
                  visible={polyline.id === item?.id && rigthCl}
                  onMouseOver={time}
                />

                <Marker
                  key={item.id}
                  position={{
                    lat: +item.data?.lat,
                    lng: +item.data?.lng,
                  }}
                  onClick={() => {
                    setSelected(item?.id);
                  }}
                  onRightClick={() => {
                    if (!rigthCl) {
                      wsAdminRef.current.send(
                        JSON.stringify({
                          type: "polyline",
                          id: item?.id,
                        })
                      );
                    } else {
                      setPolyline({
                        id: "",
                        polData: [],
                      });
                    }

                    setRigthCl(!rigthCl);
                  }}
                  icon={customIcon(item.data?.acc)}
                >
                  {item.data && selected === item?.id && (
                    <InfoWindow
                      position={{
                        lat: +item.data?.lat,
                        lng: +item.data?.lng,
                      }}
                      onCloseClick={() => {
                        setSelected("");
                      }}
                    >
                      <div>
                        <h6 className="text-primary">{item.name}</h6>
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              </>
            );
          })}
        </GoogleMap>
      )}
    </div>
  );
}
