//?
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Form, FormGroup, Label } from "reactstrap";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import _ from "lodash";
import mapStyles from "./mapStyles";
import PuffLoader from "react-spinners/PuffLoader";
import { css } from "@emotion/react";
import { getDistance } from "geolib";
import customIcon from "./customMapIcon";
import { message, Switch } from "antd";
import { w3cwebsocket as W3CWebSocket } from "websocket";

//?
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};

//?
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

// heroku-i vra normala sa
const HOST =
  process.env.NODE_ENV === "production"
    ? window.location.origin.replace(/^http/, "ws")
    : "ws://localhost:8080";

// todo
export default function DriverMap() {
  const [markerS, setMarker] = useState({}); // null er
  const [sw, setSwitch] = useState(false);

  //📌 - spinner
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  //📌 - Refs
  const firstload = useRef(true);
  const mapRef = useRef(null);
  const idRef = useRef();
  const lpRef = useRef(null); // inqy object a
  const sRef = useRef(0);
  const dRef = useRef(0);
  const wsClientRef = useRef(null);

  //📌
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "your key ...",
  });

  //🔶
  const show = useCallback(() => {
    message.success("Գեոլոկացիան միացվեց։");

    idRef.current = navigator.geolocation.watchPosition(
      (watchPos) => {
        if (watchPos.coords.accuracy > 25) {
          setMarker({
            lat: watchPos.coords.latitude,
            lng: watchPos.coords.longitude,
            acc: watchPos.coords.accuracy,
          });

          mapRef.current.panTo({
            lat: watchPos.coords.latitude,
            lng: watchPos.coords.longitude,
          });
        } else if (!lpRef.current) {
          lpRef.current = {
            lat: watchPos.coords.latitude,
            lng: watchPos.coords.longitude,
            time: watchPos.timestamp,
          };

          wsClientRef.current.send(
            JSON.stringify({
              type: "from driver",
              data: {
                lat: watchPos.coords.latitude,
                lng: watchPos.coords.longitude,
                acc: watchPos.coords.accuracy,
                time: watchPos.timestamp,
                dist: +0,
              },
            })
          );

          setMarker({
            lat: watchPos.coords.latitude,
            lng: watchPos.coords.longitude,
            acc: watchPos.coords.accuracy,
          });

          mapRef.current.panTo({
            lat: watchPos.coords.latitude,
            lng: watchPos.coords.longitude,
          });
        } else if (lpRef.current) {
          // https://learn.javascript.ru/number#okruglenie
          // Метод toFixed(n) округляет число до n знаков после запятой
          // и возвращает строковое представление результата.
          //🔥
          if (watchPos.timestamp <= lpRef.current.time) {
            // message.error("Անթուլատրելի սխալ․․․", 0);
            return;
          }

          let d = +getDistance(
            { lat: lpRef.current.lat, lng: lpRef.current.lng },
            {
              lat: watchPos.coords.latitude,
              lng: watchPos.coords.longitude,
            },
            0.001
          ).toFixed(2);

          //🔥
          if (d < 0) {
            message.error("d < 0", 0);
            return;
          }

          if (d <= 3) return;

          if (d > 25 && ++dRef.current < 4) return;
          if (d > 25 && sRef.current === 0) {
            lpRef.current = null;
            return;
          }

          dRef.current = +0;

          sRef.current += d;

          lpRef.current = {
            lat: watchPos.coords.latitude,
            lng: watchPos.coords.longitude,
            time: watchPos.timestamp,
          };

          wsClientRef.current.send(
            JSON.stringify({
              type: "from driver",
              data: {
                lat: watchPos.coords.latitude,
                lng: watchPos.coords.longitude,
                acc: watchPos.coords.accuracy,
                time: watchPos.timestamp,
                dist: d,
              },
            })
          );

          setMarker({
            lat: watchPos.coords.latitude,
            lng: watchPos.coords.longitude,
            acc: watchPos.coords.accuracy,
          });
        }
      },
      (err) => {
        // message.error("Ինչոր բան այնպես չգնաց գեոլոկացիայի աշխատանքում ․․․", 0);
        console.log(`ERROR(${err.code}): ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  //🔶
  const hide = useCallback(() => {
    message.info("Գեոլոկացիան անջատվեց։");
    if (idRef.current) {
      navigator.geolocation.clearWatch(idRef.current);
      idRef.current = 0;
      lpRef.current = null;
    }

    setTimeout(() => {
      sRef.current = 0;
      setMarker(null);
      wsClientRef.current.send(null);
      message.success("Դուք կարող եք նորից օգտվել գեոլոկացիայից։");
    }, 6000);
  }, []);

  //🔶
  useEffect(() => {
    if (firstload.current) {
      firstload.current = false;
    } else {
      sw ? show() : hide();
    }
  }, [sw, show, hide]);

  //🔶
  useEffect(() => {
    wsClientRef.current = new W3CWebSocket(HOST);

    wsClientRef.current.onopen = () => {
      message.success("ws connection has opened");
    };

    wsClientRef.current.onerror = function () {
      message.error("ws connection error");
      console.log("Connection Error");
    };

    wsClientRef.current.onclose = (e) => {
      message.error(`ws closed. ${e.code}`, 0);
    };

    return () => wsClientRef.current.close();
  }, []);

  //🔶
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  //🔶
  if (loadError) return "Error";

  //
  return (
    <div>
      <PuffLoader color="green" loading={!isLoaded} css={override} size={150} />

      {isLoaded && (
        <div>
          <div
            style={{
              position: "absolute",
              top: "1rem",
              left: "1rem",
              margin: 0,
              padding: 0,
              zIndex: 10,
              color: "blue",
              width: "185px",
              height: "100px",
            }}
          >
            <Form className="bg-light p-3 rounded">
              <FormGroup size={40}>
                <Label style={{ width: "150px" }}>
                  <span className="font-weight-bold">Ճանապարհ:</span>{" "}
                  <span className="float-right">{sRef.current.toFixed(0)}</span>
                  <hr />
                </Label>

                <div>
                  <Switch
                    size="small"
                    defaultChecked={sw}
                    onClick={() => {
                      setSwitch(!sw);
                    }}
                  />{" "}
                  <span>Գեոլոկացիա</span>
                </div>
              </FormGroup>
            </Form>
          </div>

          <GoogleMap
            id="map"
            mapContainerStyle={mapContainerStyle}
            zoom={15}
            center={
              lpRef.current || {
                lat: 40.177536,
                lng: 44.512678,
              }
            }
            options={options}
            onLoad={onMapLoad}
          >
            {!_.isEmpty(markerS) && (
              <div>
                <Marker
                  position={{
                    lat: markerS.lat,
                    lng: markerS.lng,
                  }}
                  icon={customIcon(markerS.acc)}
                ></Marker>
              </div>
            )}
          </GoogleMap>
        </div>
      )}
    </div>
  );
}
