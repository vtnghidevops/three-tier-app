import { Button, Result } from "antd";
import "./NotFound.css";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const nav = useNavigate();
  const handleClick = () => {
    nav(`/home`);
  };
  return (
    <>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => handleClick()}>
            Back Home
          </Button>
        }
      />
    </>
  );
}
