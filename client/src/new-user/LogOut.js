//?
import { Button, message } from "antd";
import { useLngContext } from "./context/LngContext";
import { useNameContext } from "./context/NameContext";

// todo
export default function LogOut({ disp }) {
  //
  const strings = useLngContext();
  const [name, setName] = useNameContext();

  //
  async function clickHandler() {
    try {
      let response = await fetch("/users/logout");

      let result = await response.json();

      if (response.ok) {
        setName(result);
        message.success(strings.logout_3);

        disp({ type: "clearStates" });
        disp({ type: "showLogin" });
      } else {
        message.error(result);
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  //
  return (
    <div style={{ minWidth: "370px" }}>
      <h6 className="text-center mb-4">
        <span>{strings.logout_1} </span>{" "}
        <span className="text-danger">{name}</span>
      </h6>

      <Button type="primary" block onClick={clickHandler}>
        {strings.logout_2}
      </Button>
    </div>
  );
}
