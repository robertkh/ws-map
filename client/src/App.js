import UserButton from "./new-user/UserButton";
import "bootstrap/dist/css/bootstrap.css";
import "antd/dist/antd.css";
import { LngContextProvider } from "./new-user/context/LngContext";
import { NameContextProvider } from "./new-user/context/NameContext";
import SwichMap from "./map/SwichMap.js";

function App() {
  return (
    <div>
      <LngContextProvider>
        <NameContextProvider>
          <UserButton />
        </NameContextProvider>
      </LngContextProvider>
      <SwichMap />
    </div>
  );
}

export default App;
