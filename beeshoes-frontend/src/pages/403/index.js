import { Button } from "antd";
import { useNavigate } from "react-router";
import "./403.css";
const NotAuthorized = () => {
  const nav = useNavigate();

  const handleClick = () => {
    nav(`/login-management`);
  };
  return (
    <>
      <div>
        <section class="page_404">
          <div class="container">
            <div class="row">
              <div class="col-sm-12 ">
                <div class="col-sm-10 col-sm-offset-1  text-center">
                  <div class="four_zero_four_bg">
                    <h1 class="text-center" style={{ textAlign: "center" }}>
                      403
                    </h1>
                  </div>

                  <div
                    class="contant_box_404"
                    style={{ marginTop: "10px", justifyContent: "center" }}
                  >
                    <h3
                      class="h2"
                      style={{
                        marginBottom: "15px",
                      }}
                    >
                      Looks like you don't have access
                    </h3>

                    <Button
                      class="link_404"
                      style={{
                        borderRadius: "10px",
                        backgroundColor: "#39ac31",
                        color: "white",
                        width: "200px",
                        height: "40px",
                      }}
                      onClick={() => handleClick()}
                    >
                      <span style={{ fontWeight: "bold" }}> Go to Home</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default NotAuthorized;
