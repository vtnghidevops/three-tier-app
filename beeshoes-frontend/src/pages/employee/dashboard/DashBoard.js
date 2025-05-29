import React, { useState, useEffect } from "react";
import { Input, Row, Col, Table, Card, Tooltip, Button } from "antd";
import "../dashboard/style-dashboard.css";
import { StatisticalApi } from "../../../api/employee/statistical/statistical.api";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5percent from "@amcharts/amcharts5/percent";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faArrowUpRightDots,
  faArrowDownWideShort,
  faDownload,
  faFileExcel,
  faCircle,
  faCircleDown,
  faDownLong,
} from "@fortawesome/free-solid-svg-icons";
import {
  DownloadOutlined,
  VerticalAlignBottomOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

const DashBoard = () => {
  const [totalBillMonth, setTotalBillMonth] = useState(0);
  const [totalBillAmoutMonth, setTotalBillAmoutMonth] = useState(0);
  const [totalProductMonth, setTotalProductMonth] = useState(0);
  const [totalBillAmoutYear, setTotalBillAmoutYear] = useState(0);
  const [totalBillDay, setTotalBillDay] = useState(0);
  const [totalBillAmountDay, setTotalBillAmoutDay] = useState(0);
  const [growthAmountDay, setGrowthAmoutDay] = useState(0);
  const [growthAmoutMonth, setGrowthAmoutMonth] = useState(0);
  const [growthAmoutYear, setGrowthAmoutYear] = useState(0);
  const [growthProductMonth, setGrowthProductMonth] = useState(0);
  const [growthBillMonth, setGrowthBillMonth] = useState(0);
  const [growthBillDay, setGrowthBillDay] = useState(0);
  const [listSellingProduct, setListSellingProduct] = useState([]);
  const [listStockProduct, setListStockProduct] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateProduct, setStartDateProduct] = useState(null);
  const [endDateProduct, setEndDateProduct] = useState(null);
  const [activeButton, setActiveButton] = useState(3);
  const [typeFormat, setTypeFormat] = useState("month");
  const [nameTable, setNameTable] = useState("Tháng Này");

  const loadData = () => {
    StatisticalApi.fetchAllStatisticalMonth().then(
      (res) => {
        const data = res.data.data[0];
        setTotalBillMonth(data.totalBill);
        setTotalBillAmoutMonth(formatCurrency(data.totalBillAmount));
        setTotalProductMonth(data.totalProduct);
      },
      (err) => {
        console.log(err);
      }
    );
    StatisticalApi.fetchAllStatisticalDay().then(
      (res) => {
        const data = res.data.data[0];
        setTotalBillDay(data.totalBillToday);
        setTotalBillAmoutDay(formatCurrency(data.totalBillAmountToday));
      },
      (err) => {
        console.log(err);
      }
    );

    StatisticalApi.fetchAllStatisticalBestSellingProduct().then(
      (res) => {
        const data = res.data.data.map((dataBestSell, index) => ({
          ...dataBestSell,
          stt: index + 1,
        }));
        setListSellingProduct(data);
      },
      (err) => {
        console.log(err);
      }
    );
    StatisticalApi.fetchAllStatisticalStatusBill().then(
      (res) => {
        const data = res.data.data;
        console.log(data);
        const statusMapping = {
          TAO_HOA_DON: "Hóa đơn chờ",
          CHO_XAC_NHAN: "Chờ xác nhận",
          CHO_VAN_CHUYEN: "Chờ vận chuyển",
          VAN_CHUYEN: "Vận chuyển",
          DA_THANH_TOAN: "Đã thanh toán",
          THANH_CONG: "Thành công",
          TRA_HANG: "Trả hàng",
          DA_HUY: "Đã Hủy",
          XAC_NHAN: "Xác nhận",
        };

        const statusColors = {
          TAO_HOA_DON: "#E46651",
          CHO_XAC_NHAN: "#00D8FF",
          CHO_VAN_CHUYEN: "#FFCE56",
          VAN_CHUYEN: "#9C27B0",
          DA_THANH_TOAN: "#41B883",
          THANH_CONG: "#4CAF50",
          TRA_HANG: "##FF5733",
          DA_HUY: "#DD1B16",
          XAC_NHAN: "#DD1B00",
        };

        const newDataPie = data.map((item) => ({
          category: statusMapping[item.statusBill] || item.statusBill,
          value: item.totalStatusBill,
          color: statusColors[item.statusBill] || item.statusBill,
        }));
        drawChartPie(newDataPie);
      },
      (err) => {
        console.log(err);
      }
    );

    StatisticalApi.fetchBillByDate().then(
      (res) => {
        const dataBill = res.data.dataBill;
        const dataProduct = res.data.dataProduct;
        const dateBillList = [];
        const dateProductList = [];
        const groupBill = new Map();
        const groupProduct = new Map();
        dataBill.forEach((item) => {
          const date = new Date(Number(item.billDate));
          const formattedDate = `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`;
          dateBillList.push({
            totalBillDate: item.totalBillDate,
            billDate: formattedDate,
          });
        });
        dataProduct.forEach((item) => {
          const date = new Date(Number(item.billDate));
          const formattedDate = `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`;
          dateProductList.push({
            totalProductDate: item.totalProductDate,
            billDate: formattedDate,
          });
        });

        dateProductList.forEach((item) => {
          const { totalProductDate, billDate } = item;
          if (groupProduct.has(billDate)) {
            const existingItem = groupProduct.get(billDate);
            existingItem.totalProductDate += totalProductDate;
          } else {
            groupProduct.set(billDate, { totalProductDate, billDate });
          }
        });

        dateBillList.forEach((item) => {
          const { totalBillDate, billDate } = item;
          if (groupBill.has(billDate)) {
            const existingItem = groupBill.get(billDate);
            existingItem.totalBillDate += totalBillDate;
          } else {
            groupBill.set(billDate, { totalBillDate, billDate });
          }
        });
        drawChart(
          Array.from(groupBill.values()),
          Array.from(groupProduct.values())
        );
      },
      (err) => {
        console.log(err);
      }
    );

    StatisticalApi.fetchAllStatisticalGrowth().then(
      (res) => {
        const data = res.data;
        let dataGrowthDay = 0;
        let dataGrowthMonth = 0;
        let dataGrowthyear = 0;
        let dataGrowthBillMonth = 0;
        let dataGrowthProductMonth = 0;
        let dataGrowthBillDay = 0;
        let dataDay = data.listDay[0].totalBillAmountToday;
        let dataDayPrevious = data.listDayPrevious[0].totalBillAmountToday;
        let dataMonth = data.listMonth[0].totalBillAmount;
        let dataMonthPrevious = data.listMonthPrevious[0].totalBillAmount;
        let dataYear = data.listYear[0].totalBillAmount;
        let dataYearPrevious = data.listYearPrevious[0].totalBillAmount;

        let dataProductMonth = data.listMonth[0].totalProduct;
        let dataProductMonthPrevious = data.listMonthPrevious[0].totalProduct;

        let dataBillDay = data.listDay[0].totalBillToday;
        let dataBillDayPrevious = data.listDayPrevious[0].totalBillToday;

        let dataBillMonth = data.listMonth[0].totalBill;
        let dataBillMonthPrevious = data.listMonthPrevious[0].totalBill;

        if (dataDayPrevious != null) {
          dataGrowthDay = ((dataDay - dataDayPrevious) / dataDayPrevious) * 100;
        }
        if (dataMonthPrevious != null) {
          dataGrowthMonth =
            ((dataMonth - dataMonthPrevious) / dataMonthPrevious) * 100;
        }
        if (dataYearPrevious != null) {
          dataGrowthyear =
            ((dataYear - dataYearPrevious) / dataYearPrevious) * 100;
        }
        if (dataProductMonthPrevious != null && dataProductMonthPrevious != 0) {
          dataGrowthProductMonth =
            ((dataProductMonth - dataProductMonthPrevious) /
              dataProductMonthPrevious) *
            100;
        }
        if (dataBillMonthPrevious != null && dataBillMonthPrevious != 0) {
          dataGrowthBillMonth =
            ((dataBillMonth - dataBillMonthPrevious) / dataBillMonthPrevious) *
            100;
        }
        if (dataBillDayPrevious != null && dataBillDayPrevious != 0) {
          dataGrowthBillDay =
            ((dataBillDay - dataBillDayPrevious) / dataBillDayPrevious) * 100;
        }

        setTotalBillAmoutYear(formatCurrency(dataYear));
        setGrowthAmoutDay(formattedPercentage(dataGrowthDay));
        setGrowthAmoutMonth(formattedPercentage(dataGrowthMonth));
        setGrowthAmoutYear(formattedPercentage(dataGrowthyear));
        setGrowthProductMonth(formattedPercentage(dataGrowthProductMonth));
        setGrowthBillMonth(formattedPercentage(dataGrowthBillMonth));
        setGrowthBillDay(formattedPercentage(dataGrowthBillDay));
      },
      (err) => {
        console.log(err);
      }
    );
    StatisticalApi.fetchAllStatisticalStock().then(
      (res) => {
        setListStockProduct(res.data.data);
      },
      (err) => {
        console.log(err);
      }
    );
  };
  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code",
    });
    return formatter.format(value);
  };

  const formattedPercentage = (number) => {
    const roundedNumber = Math.round(number * 100) / 100;
    return `${roundedNumber} %`;
  };

  const drawChartPie = (data) => {
    am5.array.each(am5.registry.rootElements, function (root) {
      if (root) {
        if (root.dom.id == "chartdivPie") {
          root.dispose();
        }
      }
    });
    let element = document.getElementById("chartdivPie");
    if (element != null) {
      let root = am5.Root.new("chartdivPie");
      root.setThemes([am5themes_Animated.new(root)]);

      root._logo.dispose();

      // Create chart
      var chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          layout: root.verticalLayout,
        })
      );

      // Create series
      var series = chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: "value",
          categoryField: "category",
        })
      );

      // Gán dữ liệu đã được cập nhật cho series
      series.data.setAll(data);

      // Create legend
      var legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.percent(50),
          x: am5.percent(50),
          marginTop: 15,
          marginBottom: 15,
        })
      );

      legend.data.setAll(series.dataItems);

      // Play initial series animation
      series.appear(1000, 100);
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      sorter: (a, b) => a.stt - b.stt,
      width: 50,
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src={text}
            alt="Ảnh sản phẩm"
            style={{ width: "90px", borderRadius: "10%", height: "90px" }}
          />
        </div>
      ),
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "nameProduct",
      key: "nameProduct",
      sorter: (a, b) => a.nameProduct.localeCompare(b.nameProduct),
    },
    {
      title: "Giá Bán",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (text) => formatCurrency(text),
    },
    {
      title: "Số lượng đã bán",
      dataIndex: "sold",
      key: "sold",
      sorter: (a, b) => a.sold - b.sold,
      align: "center",
      // width: 60
      width: 190,
    },
  ];

  const columnsStock = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      sorter: (a, b) => a.stt - b.stt,
      width: 50,
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src={text}
            alt="Ảnh sản phẩm"
            style={{ width: "90px", borderRadius: "10%", height: "90px" }}
          />
        </div>
      ),
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "nameProduct",
      key: "nameProduct",
      sorter: (a, b) => a.nameProduct.localeCompare(b.nameProduct),
    },
    {
      title: "Giá Bán",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (text) => formatCurrency(text),
    },
    {
      title: "Số lượng còn lại",
      dataIndex: "sold",
      key: "sold",
      sorter: (a, b) => a.sold - b.sold,
      align: "center",
      // width: 60
      width: 190,
    },
  ];

  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? "even-row" : "odd-row";
  };

  const handleStartDateProduct = (event) => {
    const startDate = event.target.value + " 00:00:00";
    const startDateLong = new Date(startDate).getTime();
    setStartDateProduct(startDateLong);
    loadDataProductSelling(startDateLong, endDateProduct);
    loadDataChartColumn(startDateLong, endDateProduct);
    loadDataStatusBill(startDateLong, endDateProduct);
    let endDate = "";
    if (endDateProduct == null) {
      endDate = new Date();
    } else {
      endDate = new Date(endDateProduct);
    }
    setNameTable(
      "Từ " +
        event.target.value +
        " Đến " +
        moment(endDate).format("YYYY-MM-DD")
    );
  };

  const handleEndDateProduct = (event) => {
    const endDate = event.target.value + " 23:59:59";
    const endDateLong = new Date(endDate).getTime();
    setEndDateProduct(endDateLong);
    loadDataProductSelling(startDateProduct, endDateLong);
    loadDataChartColumn(startDateProduct, endDateLong);
    loadDataStatusBill(startDateProduct, endDateLong);
    let startDate = "";
    if (startDateProduct == null) {
      startDate = new Date();
    } else {
      startDate = new Date(startDateProduct);
    }
    setNameTable(
      "Từ " +
        moment(startDate).format("YYYY-MM-DD") +
        " Đến " +
        event.target.value
    );
  };

  const loadDataProductSelling = (startDate, endDate) => {
    StatisticalApi.fetchAllStatisticalBestSellingProduct(
      startDate,
      endDate
    ).then(
      (res) => {
        const data = res.data.data.map((dataBestSell, index) => ({
          ...dataBestSell,
          stt: index + 1,
        }));
        setListSellingProduct(data);
      },
      (err) => {
        console.log(err);
      }
    );
  };
  const loadDataStatusBill = (startDate, endDate) => {
    StatisticalApi.fetchAllStatisticalStatusBill(startDate, endDate).then(
      (res) => {
        const data = res.data.data;
        const statusMapping = {
          TAO_HOA_DON: "Hóa đơn chờ",
          CHO_XAC_NHAN: "Chờ xác nhận",
          CHO_VAN_CHUYEN: "Chờ vận chuyển",
          VAN_CHUYEN: "Vận chuyển",
          DA_THANH_TOAN: "Đã thanh toán",
          THANH_CONG: "Thành công",
          TRA_HANG: "Trả hàng",
          DA_HUY: "Đã Hủy",
          XAC_NHAN: "Xác nhận",
        };

        const statusColors = {
          TAO_HOA_DON: "#E46651",
          CHO_XAC_NHAN: "#00D8FF",
          CHO_VAN_CHUYEN: "#FFCE56",
          VAN_CHUYEN: "#9C27B0",
          DA_THANH_TOAN: "#41B883",
          THANH_CONG: "#4CAF50",
          TRA_HANG: "##FF5733",
          DA_HUY: "#DD1B16",
          XAC_NHAN: "#DD1B00",
        };

        const newDataPie = data.map((item) => ({
          category: statusMapping[item.statusBill] || item.statusBill,
          value: item.totalStatusBill,
          color: statusColors[item.statusBill] || item.statusBill,
        }));
        drawChartPie(newDataPie);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const loadDataChartColumn = (startDate, endDate) => {
    StatisticalApi.fetchBillByDate(startDate, endDate).then(
      (res) => {
        const dataBill = res.data.dataBill;
        const dataProduct = res.data.dataProduct;
        const dateBillList = [];
        const dateProductList = [];
        const groupBill = new Map();
        const groupProduct = new Map();
        dataBill.forEach((item) => {
          const date = new Date(Number(item.billDate));
          const formattedDate = `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`;
          dateBillList.push({
            totalBillDate: item.totalBillDate,
            billDate: formattedDate,
          });
        });
        dataProduct.forEach((item) => {
          const date = new Date(Number(item.billDate));
          const formattedDate = `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`;
          dateProductList.push({
            totalProductDate: item.totalProductDate,
            billDate: formattedDate,
          });
        });

        dateProductList.forEach((item) => {
          const { totalProductDate, billDate } = item;
          if (groupProduct.has(billDate)) {
            const existingItem = groupProduct.get(billDate);
            existingItem.totalProductDate += totalProductDate;
          } else {
            groupProduct.set(billDate, { totalProductDate, billDate });
          }
        });

        dateBillList.forEach((item) => {
          const { totalBillDate, billDate } = item;
          if (groupBill.has(billDate)) {
            const existingItem = groupBill.get(billDate);
            existingItem.totalBillDate += totalBillDate;
          } else {
            groupBill.set(billDate, { totalBillDate, billDate });
          }
        });
        drawChart(
          Array.from(groupBill.values()),
          Array.from(groupProduct.values())
        );
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const drawChart = (dataBill, dataProduct) => {
    var colorsSES11 = "";
    var colorsSES21 = "";

    colorsSES21 = 0xf37021;
    colorsSES11 = 0xffd4a6;

    am5.array.each(am5.registry.rootElements, function (root) {
      if (root) {
        if (root.dom.id == "chartdivChart") {
          root.dispose();
        }
      }
    });
    let element = document.getElementById("chartdivChart");
    if (element != null) {
      am5.ready(function () {
        let root = am5.Root.new("chartdivChart");
        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element

        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([am5themes_Animated.new(root)]);

        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        let chart = root.container.children.push(
          am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "panX",
            wheelY: "zoomX",
            layout: root.verticalLayout,
          })
        );

        root._logo.dispose();

        // Add scrollbar
        // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
        chart.set(
          "scrollbarX",
          am5.Scrollbar.new(root, {
            orientation: "horizontal",
          })
        );
        let scrollbarX = chart.get("scrollbarX");

        scrollbarX.thumb.setAll({
          fill: am5.color(0x550000),
          fillOpacity: 0.1,
        });

        scrollbarX.startGrip.setAll({
          visible: true,
        });

        scrollbarX.endGrip.setAll({
          visible: true,
        });

        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/

        let xRenderer = am5xy.AxisRendererX.new(root, {
          minGridDistance: 10,
          cellStartLocation: 0.2,
          cellEndLocation: 0.8,
        });

        xRenderer.labels.template.setAll({
          rotation: -70,
          paddingTop: -20,
          paddingRight: 10,
          fontSize: 10,
        });

        let xAxis = chart.xAxes.push(
          am5xy.CategoryAxis.new(root, {
            categoryField: "billDate",
            maxDeviation: 0,
            renderer: xRenderer,
            tooltip: am5.Tooltip.new(root, {}),
          })
        );
        let xAxis2 = chart.xAxes.push(
          am5xy.CategoryAxis.new(root, {
            categoryField: "billDate",
            maxDeviation: 0,
            renderer: xRenderer,
            tooltip: am5.Tooltip.new(root, {}),
          })
        );
        var nameComp = "Hóa đơn";
        var nameNow = "Sản phẩm";

        xAxis.data.setAll(dataBill);
        xAxis2.data.setAll(dataProduct);

        let yRenderer = am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0.1,
        });

        let yAxis = chart.yAxes.push(
          am5xy.ValueAxis.new(root, {
            maxDeviation: 1,
            min: 0,
            renderer: yRenderer,
          })
        );
        yAxis.children.moveValue(
          am5.Label.new(root, {
            text: `Số lượng`,
            rotation: -90,
            y: am5.p50,
            centerX: am5.p50,
          }),
          0
        );
        var series1 = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: nameComp,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "totalBillDate",
            categoryXField: "billDate",
            tooltip: am5.Tooltip.new(root, {
              pointerOrientation: "horizontal",
              labelText: "Hóa đơn: {valueY}",
            }),
            fill: am5.color(colorsSES11),
          })
        );

        yRenderer.grid.template.set("strokeOpacity", 0.05);
        yRenderer.labels.template.set("fill", series1.get("fill"));
        yRenderer.setAll({
          stroke: series1.get("fill"),
          strokeOpacity: 1,
          opacity: 1,
        });

        series1.columns.template.setAll({
          width: am5.percent(40),
          tooltipY: am5.percent(30),
          templateField: "columnSettings",
          dx: -25,
        });

        series1.columns.template.set(
          "fillGradient",
          am5.LinearGradient.new(root, {
            stops: [
              {
                color: am5.color(0x297373),
                offset: 0.7,
              },
              {
                color: am5.color(0x946b49),
              },
            ],
            rotation: 90,
          })
        );

        series1.data.setAll(dataBill);

        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/

        var series2 = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: nameNow,
            xAxis: xAxis2,
            yAxis: yAxis,
            valueYField: "totalProductDate",
            categoryXField: "billDate",
            clustered: false,
            tooltip: am5.Tooltip.new(root, {
              labelText: "Sản phẩm: {valueY}",
            }),
            fill: am5.color(colorsSES21),
          })
        );

        series2.columns.template.setAll({
          width: am5.percent(35),
          templateField: "columnSettings",
          dx: 0,
        });

        series2.columns.template.set(
          "fillGradient",
          am5.LinearGradient.new(root, {
            stops: [
              {
                color: am5.color(0xff621f),
              },
              {
                color: am5.color(0x946b49),
              },
            ],
            rotation: 90,
          })
        );

        series2.data.setAll(dataProduct);

        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        let cursor = chart.set(
          "cursor",
          am5xy.XYCursor.new(root, {
            behavior: "zoomX",
          })
        );
        cursor.lineY.set("visible", false);

        // Add legend
        // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
        let legend = chart.children.push(
          am5.Legend.new(root, {
            centerX: am5.p50,
            x: am5.p50,
          })
        );
        legend.data.setAll(chart.series.values);

        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        chart.appear(1000, 100);
        series1.appear();

        // xAxis.events.once("datavalidated", function (ev) {
        //   ev.target.zoomToIndexes(dataBill.length - 20, dataProduct.length);
        // });
      });
    }
  };

  const onChangeValueOption = async (option) => {
    setActiveButton(option);
    const date = new Date();
    let startDate = "";
    let endDate = "";
    let fromTime = "";
    let toTime = "";
    if (option == 1) {
      setNameTable("Hôm Nay");
      setTypeFormat("date");
      startDate = moment(new Date()).format("YYYY-MM-DD") + " 00:00:00";
      endDate = moment(new Date()).format("YYYY-MM-DD") + " 23:59:59";
      fromTime = new Date(startDate).getTime();
      toTime = new Date(endDate).getTime();
    } else if (option == 2) {
      date.setDate(date.getDate() - 7);
      startDate = moment(date).format("YYYY-MM-DD") + " 00:00:00";
      endDate = moment(new Date()).format("YYYY-MM-DD") + " 23:59:59";
      fromTime = new Date(startDate).getTime();
      toTime = new Date(endDate).getTime();
      setNameTable("Trong 7 Ngày ");
      setTypeFormat("week");
    } else if (option == 3) {
      setNameTable("Trong Tháng Này");
      setTypeFormat("month");
    } else if (option == 4) {
      setNameTable("Trong Năm Nay");
      startDate = moment(new Date()).format("YYYY") + "-01-01" + " 00:00:00";
      endDate = moment(new Date()).format("YYYY") + "-12-31" + " 23:59:59";
      fromTime = new Date(startDate).getTime();
      toTime = new Date(endDate).getTime();
    } else {
      startDate = moment(date).format("YYYY-MM-DD");
      endDate = moment(new Date()).format("YYYY-MM-DD");
      setTypeFormat("date");
      setNameTable("Từ " + startDate + " Đến " + endDate);
    }
    loadDataProductSelling(fromTime, toTime);
    loadDataChartColumn(fromTime, toTime);
    loadDataStatusBill(fromTime, toTime);
  };

  const handleImportFile = () => {
    StatisticalApi.downloadExcel_xlsx()
      .then((res) => {
        toast.success("Tải về thành công");
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        let createDate = moment(new Date()).format("YYYY-MM-DD_HH:mm:ss");
        console.log("createDate", createDate);
        link.href = url;
        link.download = "BaoCaoThongKeDoanhThuHoaDonSanPham_" + createDate + ".xlsx"; // Tên file tải về
        link.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        toast.error("Lỗi", err);
      });
  };

  return (
    <div>
      <div
        className="content-wrapper"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: "25px",
            fontWeight: "bold",
            marginTop: "10px",
            marginBottom: "20px",
          }}
        >
          THỐNG KÊ
        </span>
      </div>
      <div>
        <Row className="row-header">
          <Col span={7} className="col-header">
            <div className="content-header">
              <h2 className="color-text-topic">Doanh số tháng này</h2>
              <h3 className="color-text-content">
                {totalBillMonth} đơn hàng / {totalBillAmoutMonth}
              </h3>
            </div>
          </Col>

          <Col span={7} className="col-header">
            <div className="content-header">
              <h2 className="color-text-topic">Doanh số hôm nay</h2>
              <h3 className="color-text-content">
                {totalBillDay} đơn hàng / {totalBillAmountDay}
              </h3>
            </div>
          </Col>

          <Col span={7} className="col-header">
            <div className="content-header">
              <h2 className="color-text-topic">Hàng bán được tháng này</h2>
              <h3 className="color-text-content">
                {totalProductMonth} sản phẩm
              </h3>
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: "30px", marginRight: "1%" }}>
          <Col span={24}>
            <div class="header-date">
              <br />
              <div style={{ position: "relative" }}>
                <div className="option-time">
                  <Tooltip title="Download Excel Thống kê">
                    <Button
                      onClick={handleImportFile}
                      style={{
                        height: "38px",
                        backgroundColor: "ButtonShadow",
                      }}
                    >
                      <span>
                        {" "}
                        <VerticalAlignBottomOutlined />
                      </span>
                      <span style={{ marginLeft: "10px" }}>
                        {" "}
                        <FontAwesomeIcon
                          icon={faFileExcel}
                          style={{
                            backgroundColor: "white",
                            marginRight: "3px",
                          }}
                        />
                      </span>
                      <span> Excel</span>
                    </Button>
                  </Tooltip>
                  <button className="button-time" disabled>
                    Bộ lọc
                  </button>
                  <button
                    className={
                      activeButton === 1 ? "button-time" : "button-time-block"
                    }
                    onClick={() => onChangeValueOption(1)}
                  >
                    Ngày
                  </button>
                  <button
                    className={
                      activeButton === 2 ? "button-time" : "button-time-block"
                    }
                    onClick={() => onChangeValueOption(2)}
                  >
                    7 Ngày
                  </button>
                  <button
                    className={
                      activeButton === 3 ? "button-time" : "button-time-block"
                    }
                    onClick={() => onChangeValueOption(3)}
                  >
                    Tháng
                  </button>
                  <button
                    className={
                      activeButton === 4 ? "button-time" : "button-time-block"
                    }
                    onClick={() => onChangeValueOption(4)}
                  >
                    Năm
                  </button>
                  <button
                    className={
                      activeButton === 5 ? "button-time" : "button-time-block"
                    }
                    onClick={() => onChangeValueOption(5)}
                  >
                    Tùy chỉnh
                  </button>

                  {activeButton === 5 && (
                    <>
                      <Input
                        className="button-time-from"
                        type="date"
                        //  value={new Date().toISOString().split('T')[0]}
                        max={new Date().toISOString().split("T")[0]}
                        onChange={handleStartDateProduct}
                      />

                      <Input
                        className="button-time-to"
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        onChange={handleEndDateProduct}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="row-body" justify={"center"}>
          <h2 style={{ marginLeft: 108 }}>
            Biểu Đồ Thống Kê Hóa Đơn Và Sản Phẩm {nameTable}
          </h2>
          <Row justify={"center"}>
            <Col>
              <div className="row-body-container">
                <div>
                  <div id="chartdivChart"></div>
                </div>
              </div>
            </Col>
          </Row>
        </Row>
        <Row className="row-footer">
          <Col className="row-footer-left">
            <h2 style={{ textAlign: "center", margin: " 1%" }}>
              Top Sản Phẩm Bán Chạy {nameTable}
            </h2>

            <Table
              style={{ marginTop: "10px", height: "500px" }}
              dataSource={listSellingProduct}
              rowKey="stt"
              columns={columns}
              pagination={{ pageSize: 3 }}
              scroll={{ y: 685 }}
              rowClassName={getRowClassName}
            />
            <h2 style={{ textAlign: "center", margin: " 2%" }}>
              Sản phẩm sắp hết hàng
            </h2>
            <Table
              style={{ marginTop: "10px" }}
              dataSource={listStockProduct}
              rowKey="stt"
              columns={columnsStock}
              pagination={{ pageSize: 3 }}
              scroll={{ y: 685 }}
              rowClassName={getRowClassName}
            />
          </Col>
          <Col className="row-footer-right">
            <Row className="content-1">
              <Col style={{ width: "800px" }}>
                <h2 style={{ textAlign: "center", margin: " 3%" }}>
                  Trạng Thái Đơn Hàng {nameTable}
                </h2>
                <div id="chartdivPie"></div>
              </Col>
            </Row>

            <Row className="content-2">
              <Col style={{ width: "800px" }}>
                <h2
                  style={{ textAlign: "center", margin: " 3%", color: "black" }}
                >
                  Tốc Độ Tăng Trưởng Cửa Hàng
                </h2>

                <Row className="content-child">
                  <FontAwesomeIcon icon={faCalendarDay} className="icon" />
                  <h1 className="title">Doanh thu ngày</h1>
                  <h1 className="content-x">{totalBillAmountDay}</h1>
                  {growthAmountDay < formattedPercentage(0) ? (
                    <>
                      <h1 className="content-y">
                        <FontAwesomeIcon
                          icon={faArrowDownWideShort}
                          style={{ color: "#FF0000" }}
                        />
                      </h1>
                      <h1 className="content-z" style={{ color: "#FF0000" }}>
                        {" "}
                        {growthAmountDay}
                      </h1>
                    </>
                  ) : (
                    <>
                      <h1 className="content-y" style={{ color: "#00DD00" }}>
                        {" "}
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                      </h1>
                      <h1 className="content-z" style={{ color: "#00DD00" }}>
                        {" "}
                        {growthAmountDay}
                      </h1>
                    </>
                  )}
                </Row>
                <Row className="content-child">
                  <FontAwesomeIcon icon={faCalendarDay} className="icon" />
                  <h1 className="title">Doanh thu tháng</h1>
                  <h1 className="content-x">{totalBillAmoutMonth}</h1>
                  {growthAmoutMonth < formattedPercentage(0) ? (
                    <>
                      <h1 className="content-y">
                        <FontAwesomeIcon
                          icon={faArrowDownWideShort}
                          style={{ color: "#FF0000" }}
                        />
                      </h1>
                      <h1 className="content-z" style={{ color: "#FF0000" }}>
                        {" "}
                        {growthAmoutMonth}
                      </h1>
                    </>
                  ) : (
                    <>
                      <h1 className="content-y" style={{ color: "#00DD00" }}>
                        {" "}
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                      </h1>
                      <h1 className="content-z" style={{ color: "#00DD00" }}>
                        {" "}
                        {growthAmoutMonth}
                      </h1>
                    </>
                  )}
                </Row>
                <Row className="content-child">
                  <FontAwesomeIcon icon={faCalendarDay} className="icon" />
                  <h1 className="title">Doanh thu năm</h1>
                  <h1 className="content-x">{totalBillAmoutYear}</h1>
                  {growthAmoutYear < formattedPercentage(0) ? (
                    <>
                      <h1 className="content-y">
                        <FontAwesomeIcon
                          icon={faArrowDownWideShort}
                          style={{ color: "#FF0000" }}
                        />
                      </h1>
                      <h1 className="content-z" style={{ color: "#FF0000" }}>
                        {" "}
                        {growthAmoutYear}
                      </h1>
                    </>
                  ) : (
                    <>
                      <h1 className="content-y" style={{ color: "#00DD00" }}>
                        {" "}
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                      </h1>
                      <h1 className="content-z" style={{ color: "#00DD00" }}>
                        {" "}
                        {growthAmoutYear}
                      </h1>
                    </>
                  )}
                </Row>
                <Row className="content-child">
                  <FontAwesomeIcon icon={faCalendarDay} className="icon" />
                  <h1 className="title">Sản phẩm tháng</h1>
                  <h1 className="content-x">{totalProductMonth} Sản phẩm</h1>
                  {growthProductMonth < formattedPercentage(0) ? (
                    <>
                      <h1 className="content-y">
                        <FontAwesomeIcon
                          icon={faArrowDownWideShort}
                          style={{ color: "#FF0000" }}
                        />
                      </h1>
                      <h1 className="content-z" style={{ color: "#FF0000" }}>
                        {" "}
                        {growthProductMonth}
                      </h1>
                    </>
                  ) : (
                    <>
                      <h1 className="content-y" style={{ color: "#00DD00" }}>
                        {" "}
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                      </h1>
                      <h1 className="content-z" style={{ color: "#00DD00" }}>
                        {" "}
                        {growthProductMonth}
                      </h1>
                    </>
                  )}
                </Row>
                <Row className="content-child">
                  <FontAwesomeIcon icon={faCalendarDay} className="icon" />
                  <h1 className="title">Hóa đơn ngày</h1>
                  <h1 className="content-x">{totalBillDay} Hóa đơn</h1>
                  {growthBillDay < formattedPercentage(0) ? (
                    <>
                      <h1 className="content-y">
                        <FontAwesomeIcon
                          icon={faArrowDownWideShort}
                          style={{ color: "#FF0000" }}
                        />
                      </h1>
                      <h1 className="content-z" style={{ color: "#FF0000" }}>
                        {" "}
                        {growthBillDay}
                      </h1>
                    </>
                  ) : (
                    <>
                      <h1 className="content-y" style={{ color: "#00DD00" }}>
                        {" "}
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                      </h1>
                      <h1 className="content-z" style={{ color: "#00DD00" }}>
                        {" "}
                        {growthBillDay}
                      </h1>
                    </>
                  )}
                </Row>
                <Row className="content-child">
                  <FontAwesomeIcon icon={faCalendarDay} className="icon" />
                  <h1 className="title">Hóa đơn tháng</h1>
                  <h1 className="content-x">{totalBillMonth} Hóa đơn</h1>
                  {growthBillMonth < formattedPercentage(0) ? (
                    <>
                      <h1 className="content-y">
                        <FontAwesomeIcon
                          icon={faArrowDownWideShort}
                          style={{ color: "#FF0000" }}
                        />
                      </h1>
                      <h1 className="content-z" style={{ color: "#FF0000" }}>
                        {" "}
                        {growthBillMonth}
                      </h1>
                    </>
                  ) : (
                    <>
                      <h1 className="content-y" style={{ color: "#00DD00" }}>
                        {" "}
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                      </h1>
                      <h1 className="content-z" style={{ color: "#00DD00" }}>
                        {" "}
                        {growthBillMonth}
                      </h1>
                    </>
                  )}
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DashBoard;
