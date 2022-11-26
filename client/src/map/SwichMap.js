//?
import React, { useState, useEffect } from "react";
import GuestMap from "./GuestMap";
import DriverMap from "./DriverMap";
import AdminMap from "./AdminMap";

// todo
export default function SwichMap() {
  const [st, setSt] = useState();

  //
  async function fetchData() {
    try {
      let response = await fetch("/users/name");
      let result = await response.json();

      if (result === "") {
        return setSt(0);
      }

      let response2 = await fetch("/users/admin");
      if (response2.ok) {
        setSt(2);
      } else {
        setSt(1);
      }
    } catch {
      console.log("vat ban e exel");
    }
  }

  //
  useEffect(() => {
    fetchData();
  }, []);

  //
  return st === undefined ? null : st === 0 ? (
    <GuestMap />
  ) : st === 1 ? (
    <DriverMap />
  ) : (
    <AdminMap />
  );
}
