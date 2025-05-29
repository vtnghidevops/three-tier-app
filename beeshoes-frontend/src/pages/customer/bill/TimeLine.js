import moment from "moment";
import { Timeline, TimelineEvent } from '@mailtop/horizontal-timeline'
import {  FaFileSignature} from "react-icons/fa";
import { BiSolidTruck} from "react-icons/bi";
import { MdPayment} from "react-icons/md";
import { AiFillCarryOut, AiFillFile} from "react-icons/ai";
import { GiReturnArrow} from "react-icons/gi";
import { BsFileEarmarkExcelFill} from "react-icons/bs";
import "./timeline.css";

function TimeLine({ listStatus, data, statusPresent }) {
  
  const showIcon = (statusBill) =>{
    if( statusBill === "TAO_HOA_DON"){
        return AiFillFile
    }
    else if(statusBill === "CHO_XAC_NHAN"){
      return FaFileSignature
    }
    else if(statusBill === "VAN_CHUYEN"){
      return BiSolidTruck
    } 
    else if(statusBill === "CHO_VAN_CHUYEN"){
      return BiSolidTruck
    } else if(statusBill === "DA_THANH_TOAN"){
      return MdPayment
    }else if(statusBill === "THANH_CONG"){
      return AiFillCarryOut
    }else if(statusBill === "TRA_HANG"){
      return GiReturnArrow
    }else{
      return BsFileEarmarkExcelFill
    }
  }
  return (
    <div className="container" style={{ width: "100%", margin: "10px",  }}>
      <Timeline minEvents={statusPresent != 7 ? 5: 1}  placeholder  >
       {
        data.filter((history) => history.statusBill !== null).map((item) => (
          <TimelineEvent
          color={ item.statusBill != "DA_HUY" ? "#0099FF" : "#FF0000"}
          icon={showIcon(item.statusBill )}
         
          title={
            item.statusBill === "TAO_HOA_DON"
              ? "Hóa đơn chờ "
              : item.statusBill === "CHO_XAC_NHAN"
              ? "Chờ xác nhận"
              : item.statusBill === "XAC_NHAN"
              ?  "Đã Xác nhận"
              : item.statusBill === "CHO_VAN_CHUYEN"
              ? "Chờ vận chuyển"
              : item.statusBill === "VAN_CHUYEN"
              ? "Đang vận chuyển"
              : item.statusBill === "DA_THANH_TOAN"
              ? "Đã thanh toán"
              : item.statusBill === "TRA_HANG"
              ? "Trả hàng"
              : item.statusBill === "THANH_CONG"
              ? "Thành công"
              : "Đã hủy"
          }
          subtitle={moment(item.createDate).format(" HH:mm:ss DD-MM-YYYY ")}
        />
        ))
       }
      </Timeline> 
      
    </div>
  );
}

export default TimeLine;
