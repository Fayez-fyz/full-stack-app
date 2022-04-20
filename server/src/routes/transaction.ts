import express, { Router, Request, Response } from "express";
import Razorpay from "razorpay";
import * as dotenv from "dotenv";
import Transaction from "../models/transaction";
import puppeteer from "puppeteer";
const pdfctrl = require('../controllers/transaction');

const router: Router = express.Router();

// router.get("/", (req, res) => {
//   res.send({ key: process.env.RAZORPAY_KEY });
// });

// router.get('/getpdf', async(req: any, res: any) => {
// try {
//    await pdfctrl.createPdf(req, res);
// } catch (error) {
//     console.log(error);
// }
// })

// router.post('/getpdf', pdfctrl.createPDF);

router.post("/create-order", async (req: Request, res: Response) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    const order = await razorpay.orders.create({
      amount: parseInt(req.body.amount) + parseInt(req.body.amount) * 0.12,
      currency: "INR",
      //   receipt: "order_rcptid_11",
      //   payment_capture: 1,
    });
    if (!order) return res.status(400).send({ message: "Some error occured" });
    res.send(order);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
// acc_JCt5DnHDFpE1Hv

router.post("/pay-order", async (req: Request, res: Response) => {
  try {
    const { amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
      req.body;
    const newOrder = await Transaction.create({
      isPaid: true,
      amount,
      razorPay: {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        razorPaySignature: razorpaySignature,
      },
    });
    await newOrder.save();
    res.send({ message: "Order paid successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
// AIzaSyBp4uT_cfpln0QEivt3wDe2oauvProTJPA
router.get("/list-orders", async (req: Request, res: Response) => {
  try {
    const orders = await Transaction.find();
    res.send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// router.post("/intiate-pay", async (req: Request, res: Response) => {
//   try {
//     const razorpay = new Razorpay({
//       key_id: process.env.RAZORPAY_KEY,
//       key_secret: process.env.RAZORPAY_SECRET,
//     });
//     // console.log("I am working")

//     const order = await razorpay.orders.create({
//       amount: parseInt(req.body.amount) + parseInt(req.body.amount) * 0.12,
//       currency: "INR",
//       //   receipt: "order_rcptid_11",
//       //   payment_capture: 1,
//     });
//     if (!order) return res.status(400).send({ message: "Some error occured" });
//     res.send(order);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error);
//   }
// });


// router.post("/get-refund", async (req: Request, res: Response) => {
//   const {paymentId}=req.body
//  try {
//   const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY,
//     key_secret: process.env.RAZORPAY_SECRET,
// });
//   const order = await razorpay.payments.transfer(paymentId,{
//     "transfers": [
//       {
//         "account": "acc_JCt5DnHDFpE1Hv",
//         "amount": 900,
//         "currency": "INR",
//         "notes": {
//           "branch": "Acme Corp Bangalore North",
//           "name": "Gaurav Kumar"
//         },
//         "linked_account_notes": [
//           "branch"
//         ],
//         "on_hold": 1,
//         "on_hold_until": 1671222870
//       },
//       {
//         "account": "acc_JCtRw8u84dxw7E",
//         "amount": 100,
//         "currency": "INR",
//         "notes": {
//           "branch": "Acme Corp Bangalore South",
//           "name": "Saurav Kumar"
//         },
//         "linked_account_notes": [
//           "branch"
//         ],
//         "on_hold": 0
//       }
//     ]
//   })

//   console.log(order)
//   res.send(order);

//  } catch (error) {
//     console.log(error);
//     res.status(500).send(error);
//  } 
// });



module.exports = router;
