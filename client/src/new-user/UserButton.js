//?
import { useEffect } from "react";
import { Avatar, Popover } from "antd";
import { useNameContext } from "./context/NameContext";
import { UserOutlined } from "@ant-design/icons";
import Users from "./Users";

//?
const avatarStyle = {
  backgroundColor: "#87d068",
  position: "fixed",
  top: "5vh",
  right: "3vw",
  cursor: "pointer",
  zIndex: 100,
};

// todo
export default function UserButton() {
  //
  const [name, setName] = useNameContext();

  useEffect(() => {
    fetch("/users/name")
      .then((response) => response.json())
      .then((result) => setName(result));
  }, [setName]);

  //
  return (
    <>
      <Popover placement="bottomRight" trigger="click" content={Users}>
        <Avatar key="main" style={avatarStyle} size={40}>
          {name ? (
            name[0]?.toUpperCase()
          ) : (
            <UserOutlined style={{ verticalAlign: 2 }} />
          )}
        </Avatar>
      </Popover>
    </>
  );
}
