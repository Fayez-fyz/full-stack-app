import Head from "next/head";
import Image from "next/image";
import axios from "axios";
import jsPDF from "jspdf";
import { renderToString } from "react-dom/server";
import { useEffect, useState } from "react";
// import styles from '../styles/Home.module.css'
import pdfService from "./pdfservice";
import { useQuery } from "react-query";

export default function Home() {
  const [orderAmount, setOrderAmount] = useState(0);
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState([]);

  const doc = new jsPDF();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/api/list-orders");
     console.log(data);
     setOrder(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

 const {data,isLoading,isError} = useQuery("orders",fetchOrders);

 if(isLoading) return <p>Loading...</p>;
  if(isError) return <p>Error</p>;
  if(data) return <p>{data}</p>;

  // useEffect(() => {
  //   fetchOrders();
  // }, []);

  // const downloadPDF = async () => {
  //   try {
  //     const data = await axios.post("http://localhost:5000/api/getpdf", {
  //       weburl: "https://news.ycombinator.com/",
  //     });
  //     const blob = new Blob([data], { type: "application/pdf" });
  //     const anchorlink = document.createElement("a");
  //     anchorlink.href = window.URL.createObjectURL(blob);
  //     anchorlink.setAttribute("download", "test.pdf");
  //     anchorlink.click();
  //   } catch (error) {
  //     console.log(error);
  //   }

  // fetch("http://localhost:5000/api/getpdf", {
  //   data: {
  //     weburl: "http://localhost:3000/",
  //   },
  //   method: "POST",
  // }).then((res) => {
  //   return res
  //     .arrayBuffer()
  //     .then((res) => {
  //       const blob = new Blob([res], { type: "application/pdf" });
  //       saveAs(blob, "invoice.pdf");
  //     })
  //     .catch((e) => alert(e));
  // });

  // const downloadPdfer = async () => {
  //   try {
  //     const data = axios.get("http://localhost:5000/api/getpdf", {
  //       responseType: "blob",
  //       headers: {
  //         Accept: "application/pdf",
  //       },
  //     });

  //     const filename = "order.pdf";
  //     const file = new Blob([data], { type: "application/pdf" });
  //     const fileURL = URL.createObjectURL(file);
  //     const link = document.createElement("a");
  //     link.href = fileURL;
  //     link.setAttribute("download", filename);
  //     document.body.appendChild(link);
  //     link.click();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  //     // const link = document.createElement("a");
  //     // link.href = window.URL.createObjectURL(data.data);
  //     // link.setAttribute("download", filename);
  //     // document.body.appendChild(link);
  //     // link.click();

  //     // const file = new Blob([res.data], { type: "application/pdf" });
  //     // const anchorlink = document.createElement("a");
  //     // anchorlink.href = URL.createObjectURL(file);
  //     // anchorlink.setAttribute("download", filename);
  //     // anchorlink.click();

  const loadRazorpay = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onerror = () => {
      alert("Error in loading Razorpay");
    };
    console.log("Razorpay loaded");
    script.onload = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post(
          "http://localhost:5000/api/create-order",
          {
            amount: orderAmount + "00",
            currency: "INR",
          }
        );
        console.log(data)
        const { amount, id: order_id, currency } = data;
        const options = {
          key: "rzp_test_CC01jwR3Tg9LSK",
          amount: amount,
          currency: currency,
          name: "Razorpay",
          description: "Order #" + order_id,
          order_id: order_id,
          handler: async (response) => {
            try {
              const { data } = await axios.post(
                "http://localhost:5000/api/pay-order",
                {
                  amount: amount,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                }
              );
              alert(data.message);
              fetchOrders();
            } catch (error) {
              alert("Payment Failed");
              console.log(error);
            }
          },
          prefill: {
            name: "Razorpay",
            email: "fayez@shootup.in",
            contact: "8098838503",
          },
          notes: {
            address: "Hello World",
          },
          theme: {
            color: "#F37254",
          },
        };
        setLoading(false);
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        alert("Error in loading Razorpay");
        console.log(error);
        setLoading(false);
      }
    };
    document.body.appendChild(script);
  };

  // const Prints = () => {
  //  console.log(order)
  //  console.log(transaction)

  //  return (
  //   <div>
  //      <h1>ID : {id}</h1>
  //      <h1>Amount : {amnt}</h1>
  //      <h1>Paymentid : {paymentid}</h1>
  //     </div>
  //   )

  //  }

  const generatePDF = (id, amount, paymentid) => {
    console.log(id, amount, paymentid);
    const doc = new jsPDF("p", "mm", "a4");
    // doc.html(
    //   `<h6 class='display-5 fs-2' >ID : ${id}</h6>
    //   <h6>Amount : ${amount}</h6>
    //   <h6>Paymentid : ${paymentid}</h6>`,

    //   {
    //     callback: function (doc) {
    //       doc.save("Test.pdf");
    //     },
    //   }
    // );

    doc.setFontSize(20);
    doc.text(20, 20, "Order ID : " + id);
    doc.setFontSize(20);
    doc.text(20, 30, "Amount : " + amount);
    doc.setFontSize(20);
    doc.text(20, 40, "Payment ID : " + paymentid);

    doc.save("demo.pdf");
  };

  return (
    <>
      <div className="container">
        <div className="row mx-5 my-5">
          <div className="col-md-12 ">
            <div className="d-flex justify-content-center align-items-center">
              <div>
                <h1 className="display-4 fw-bold">DONATION APP</h1>

                <div className="d-flex flex-column align-items-center ">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Amount"
                    aria-label="Recipient's username"
                    aria-describedby="button-addon2"
                    value={orderAmount}
                    onChange={(e) => setOrderAmount(e.target.value)}
                  />
                  <button
                    className="btn btn-success my-2"
                    disabled={loading}
                    // type="button"
                    onClick={loadRazorpay}
                    id="button-addon2"
                  >
                    Submit
                  </button>
                </div>
              {console.log('hi order',order)}
                {loading && (
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                )}
              </div>
            </div>
            <div className="orders my-5">
              <div className="table-responsive">
                <table className="table">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">AMOUNT</th>
                      <th scope="col">PAID</th>
                      <th scope="col">RAZORPAY</th>
                      <th scope="col">Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.map((item) => (
                      <tr key={item._id}>
                        <th scope="row">{item._id}</th>
                        <td>{item.amount / 100}</td>
                        <td>{item.isPaid ? "Yes" : "No"}</td>
                        <td>{item.razorPay.paymentId}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() =>
                              generatePDF(
                                item._id,
                                item.amount / 100,
                                item.razorPay.paymentId
                              )
                            }
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

