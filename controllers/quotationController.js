const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const Product = require("../models/Product")

const generateInvoicePDF = async (req, res) => {
    try {
        const productIds = req.body.productIds;
        const products = await Product.find({ _id: { $in: productIds } });

        const items = products.map(product => ({
            description: product.description,
            qty: req.body.quantities[product._id] || 1,
            rate: product.price,
            igst: 18,
            igstAmount: (product.price * (req.body.quantities[product._id] || 1) * 18) / 100,
            amount: product.price * (req.body.quantities[product._id] || 1)
        }));

        const subTotal = items.reduce((sum, item) => sum + item.amount, 0);
        const igstTotal = items.reduce((sum, item) => sum + item.igstAmount, 0);
        const totalAmount = subTotal + igstTotal;

        const invoiceData = {
            estimateNumber: req.body.estimateNumber,
            estimateDate: req.body.estimateDate,
            placeOfSupply: req.body.placeOfSupply,

            billTo: {
                name: req.body.billToName,
                address: req.body.billToAddress,
                phone: req.body.billToPhone
            },
            shipTo: {
                name: req.body.shipToName,
                address: req.body.shipToAddress,
                phone: req.body.shipToPhone
            },

            items: items,
            subTotal: subTotal,
            taxableAmount: subTotal,
            igstTotal: igstTotal,
            totalAmount: totalAmount,

            bankDetails: {
                bankName: req.body.bankName,
                accountNo: req.body.accountNo,
                ifscCode: req.body.ifscCode,
                accountHolder: req.body.accountHolder
            },
            terms: [
                "No warranty or Guarantee on Wear and Tear.",
                "No Warranty for Wood or Stone.",
                "50% advance and balance before dispatch of machine.",
                "Valid for 30 days from issuing.",
                "Goods once Sold cannot be taken back.",
                "Forwarding Charges extra, Delivery at Customers Risk.",
                "Motor and Gearbox warranty is up to the manufacturer.",
                "Technician charges extra for each visit.",
                "Rates quoted are subject to revision at any time.",
                "We are not responsible for any loss or damage in transit.",
                "Order once placed cannot be canceled by you under any circumstances.",
                "Our risk & responsibility ceases after dispatch of goods."
            ]
        };
        ejs.renderFile(
            path.join(__dirname, '../quotation-template/views/invoice.ejs'),
            { invoice: invoiceData },
            (err, data) => {
                if (err) {
                    return res.status(500).send(err);
                }

                const options = {
                    height: "11.25in",
                    width: "8.5in",
                    header: {
                        height: "20mm",
                    },
                    footer: {
                        height: "20mm",
                    },
                };

                pdf.create(data, options).toBuffer((err, buffer) => {
                    if (err) {
                        return res.status(500).send(err);
                    } else {
                        res.set({
                            'Content-Type': 'application/pdf',
                            'Content-Disposition': 'attachment; filename="invoice.pdf"',
                            'Content-Length': buffer.length,
                        });
                        res.send(buffer);
                    }
                });
            }
        );
    } catch (error) {
        console.error("Error generating invoice PDF:", error);
        res.status(500).send("Error generating invoice PDF");
    }
};

module.exports = {
    generateInvoicePDF
};
