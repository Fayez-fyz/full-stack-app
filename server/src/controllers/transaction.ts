// import puppeteer from "puppeteer";
// import { Buffer } from "buffer";
// const weburl = "https://news.ycombinator.com/";
// const optionsPdf = { width: 1024, height: 768 };

// async function puppeteerPdf(weburl: any, optionsPdf: any) {
//   const browser = await puppeteer.launch({
//     headless: false,
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   });
//   const page = await browser
 
// }

// export async function createPdf(req: any, res: any) {
//   const pdfbuffer = await puppeteerPdf(weburl, optionsPdf)
//     .then((pdfbuffer) => {
//       res.set("Content-Type", "application/pdf");
//       res.status(201).send((Buffer as any).from(pdfbuffer, "binary"));

//     //   res.send(pdfbuffer);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }


// module.exports = {
//     createPDF: async function(req:any, res:any, next:any) {
//         console.log(req.body);
//         const browser = await puppeteer.launch({ headless: false, 
//             args: ["--no-sandbox", "--disable-setuid-sandbox"],})
//         const page = await browser.newPage()
//         await page.goto(req.body.weburl, { waitUntil: "domcontentloaded" })
//         const buffer = await page.pdf({
//             printBackground: true,
//             margin: {
//                 left: '0px',
//                 top: '0px',
//                 right: '0px',
//                 bottom: '0px'
//             }
//         })
//         const pdfsave = await b
//         res.set("Content-Type", "application/pdf");
//         res.status(201).send((Buffer as any).from(buffer, "binary"));
//                 await browser.close()
//     }
// }