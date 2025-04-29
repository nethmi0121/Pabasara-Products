import PDFDocument from 'pdfkit'
import StockModel from '../../../models/productManagementModels/StockModel.js'
import StockProducts from '../../../models/productManagementModels/StockProductsModel.js'

const GenerateSupplierStockReport = async (req, res) => {
    try {
        // Retrieve all stocks and populate the Supplier field
        const stocks = await StockModel.find().populate('Supplier')

        // Group stocks by supplier
        const supplierData = {}
        for (const stock of stocks) {
            const supplierId = stock.Supplier?._id.toString() || 'Unknown'
            if (!supplierData[supplierId]) {
                supplierData[supplierId] = {
                    supplier: stock.Supplier,
                    stocks: [],
                    totalStockValue: 0,
                    totalQuantity: 0,
                }
            }

            const stockProducts = await StockProducts.find({ stock: stock._id }).populate('product')

            let stockValue = 0
            let stockQuantity = 0
            stockProducts.forEach((item) => {
                stockValue += item.price * item.quantity
                stockQuantity += item.quantity
            })

            supplierData[supplierId].stocks.push({
                stock,
                stockProducts,
                stockValue,
                stockQuantity,
            })
            supplierData[supplierId].totalStockValue += stockValue
            supplierData[supplierId].totalQuantity += stockQuantity
        }

        // Create PDF document
        const doc = new PDFDocument({ margin: 50 })
        res.setHeader('Content-disposition', 'attachment; filename="supplier-stock-report.pdf"')
        res.setHeader('Content-type', 'application/pdf')
        doc.pipe(res)

        // Report Header
        doc
            .fillColor('#62b8a0')
            .font('Helvetica-Bold')
            .fontSize(24)
            .text('Pabasara Products', { align: 'center' })
        doc.moveDown(1)

        doc
            .fillColor('#000')
            .font('Helvetica')
            .fontSize(20)
            .text('Supplier and Stocks Report', { align: 'center' })
        doc.moveDown()
        doc
            .fillColor('#000')
            .font('Helvetica')
            .fontSize(12)
            .text(`Report generated on: ${new Date().toLocaleString()}`)
        doc.moveDown(2)

        // Iterate over each supplier
        for (const supplierId in supplierData) {
            const data = supplierData[supplierId]
            const supplier = data.supplier

            // Supplier Overview
            doc
                .fillColor('#000')
                .font('Helvetica')
                .fontSize(16)
                .text(`Supplier: ${supplier?.name || 'Unknown Supplier'}`, { underline: true })

            // Supplier summary table
            const supplierTableTop = doc.y + 10
            doc.font('Helvetica-Bold').fontSize(12)

            // Table header
            doc.fillColor('#2a52be').rect(50, supplierTableTop, 500, 20).fill()
            doc
                .fillColor('#ffffff')
                .text('Metric', 60, supplierTableTop + 5)
                .text('Value', 400, supplierTableTop + 5, { width: 150, align: 'right' })

            // Table rows
            doc.font('Helvetica').fillColor('#333333')
            let supplierY = supplierTableTop + 25

            const supplierDetails = [
                { metric: 'Total Stocks Provided', value: data.stocks.length },
                { metric: 'Total Stock Value', value: `Rs.${data.totalStockValue.toFixed(2)}` },
                { metric: 'Total Quantity of Items', value: data.totalQuantity },
            ]

            supplierDetails.forEach((detail, i) => {
                if (i % 2 === 0) {
                    doc.fillColor('#f0f7ff').rect(50, supplierY, 500, 20).fill()
                }
                doc
                    .fillColor('#333333')
                    .text(detail.metric, 60, supplierY + 5)
                    .text(detail.value.toString(), 400, supplierY + 5, { width: 150, align: 'right' })
                supplierY += 20
            })

            doc.moveDown(2)

            // Stock Entries
            data.stocks.forEach((stockEntry, index) => {
                if (doc.y > 700) {
                    // Add new page if needed
                    doc.addPage()
                }

                // Enhanced Stock Entry Header with badge style
                const entryHeaderY = doc.y
                doc.fillColor('#2a52be').roundedRect(50, entryHeaderY, 500, 30, 5).fill()
                doc
                    .fillColor('#ffffff')
                    .font('Helvetica-Bold')
                    .fontSize(14)
                    .text(`STOCK ENTRY #${index + 1}`, 60, entryHeaderY + 8)

                // Add small date badge
                const dateText = new Date(stockEntry.stock.CreatedAt).toLocaleDateString()
                const dateWidth = doc.widthOfString(dateText) + 20
                doc
                    .fillColor('#4b6cb7')
                    .roundedRect(550 - dateWidth, entryHeaderY + 5, dateWidth, 20, 3)
                    .fill()
                doc.fillColor('#ffffff').text(dateText, 550 - dateWidth + 10, entryHeaderY + 10)

                doc.moveDown(2)

                // Stock entry details table
                const entryTableTop = doc.y
                doc.font('Helvetica').fontSize(12)

                // Table header
                doc.fillColor('#4b6cb7').rect(50, entryTableTop, 500, 20).fill()
                doc
                    .fillColor('#ffffff')
                    .font('Helvetica-Bold')
                    .text('Field', 60, entryTableTop + 5)
                    .text('Value', 300, entryTableTop + 5)

                // Table rows
                doc.font('Helvetica').fillColor('#333333')
                let entryY = entryTableTop + 25

                const entryDetails = [
                    { field: 'Stock ID', value: stockEntry.stock._id.toString() },
                    { field: 'Created At', value: new Date(stockEntry.stock.CreatedAt).toLocaleString() },
                    { field: 'Stock Value', value: `Rs.${stockEntry.stockValue.toFixed(2)}` },
                    { field: 'Total Quantity', value: stockEntry.stockQuantity.toString() },
                ]

                entryDetails.forEach((detail, i) => {
                    if (i % 2 === 0) {
                        doc.fillColor('#f5f9ff').rect(50, entryY, 500, 20).fill()
                    }
                    doc
                        .fillColor('#333333')
                        .text(detail.field, 60, entryY + 5)
                        .text(detail.value.toString(), 300, entryY + 5)
                    entryY += 20
                })

                doc.moveDown(1)

                // Items table
                doc.fontSize(12).text('Items in this Stock Entry:', { underline: true })

                const itemsTableTop = doc.y + 10
                doc.font('Helvetica-Bold').fontSize(10)

                // Table header
                doc.fillColor('#5a7ec9').rect(50, itemsTableTop, 500, 20).fill()
                doc
                    .fillColor('#ffffff')
                    .text('Item', 60, itemsTableTop + 5)
                    .text('Description', 150, itemsTableTop + 5)
                    .text('Qty', 350, itemsTableTop + 5)
                    .text('Price', 400, itemsTableTop + 5)
                    .text('Total', 450, itemsTableTop + 5)

                // Second header row for dates
                doc
                    .fillColor('#5a7ec9')
                    .rect(50, itemsTableTop + 20, 500, 20)
                    .fill()
                doc
                    .fillColor('#ffffff')
                    .text('Manufacture', 60, itemsTableTop + 25)
                    .text('Expiration', 150, itemsTableTop + 25)
                    .text('Alert', 350, itemsTableTop + 25)

                // Table rows
                doc.font('Helvetica').fontSize(10).fillColor('#333333')
                let itemsY = itemsTableTop + 45

                stockEntry.stockProducts.forEach((item, i) => {
                    if (itemsY > 700) {
                        // Add new page if needed
                        doc.addPage()
                        itemsY = 50
                        // Repeat table header
                        doc.font('Helvetica-Bold').fontSize(10)
                        doc
                            .fillColor('#5a7ec9')
                            .rect(50, itemsY - 20, 500, 20)
                            .fill()
                        doc
                            .fillColor('#ffffff')
                            .text('Item', 60, itemsY - 15)
                            .text('Description', 150, itemsY - 15)
                            .text('Qty', 350, itemsY - 15)
                            .text('Price', 400, itemsY - 15)
                            .text('Total', 450, itemsY - 15)
                        // Second header row
                        doc
                            .fillColor('#5a7ec9')
                            .rect(50, itemsY + 5, 500, 20)
                            .fill()
                        doc
                            .fillColor('#ffffff')
                            .text('Manufacture', 60, itemsY + 10)
                            .text('Expiration', 150, itemsY + 10)
                            .text('Alert', 350, itemsY + 10)
                        itemsY += 45
                    }

                    // Highlight low stock items
                    if (item.quantity < 20) {
                        doc.fillColor('#ffebee').rect(50, itemsY, 500, 40).fill()
                    } else if (i % 2 === 0) {
                        doc.fillColor('#f5f9ff').rect(50, itemsY, 500, 40).fill()
                    }

                    // Item details
                    doc
                        .fillColor('#333333')
                        .text(`${i + 1}. ${item.product?.name || 'Unknown Product'}`, 60, itemsY + 5)
                        .text(item.product?.description || 'No Description', 150, itemsY + 5, { width: 180 })
                        .text(item.quantity.toString(), 350, itemsY + 5)
                        .text(`Rs.${item.price.toFixed(2)}`, 400, itemsY + 5)
                        .text(`Rs.${(item.price * item.quantity).toFixed(2)}`, 450, itemsY + 5)
                        .text(new Date(item.manufactureDate).toLocaleDateString(), 60, itemsY + 25)
                        .text(new Date(item.expirationDate).toLocaleDateString(), 150, itemsY + 25)

                    if (item.quantity < 20) {
                        doc.fillColor('red').text(`Only ${item.quantity} left!`, 350, itemsY + 25)
                    }

                    itemsY += 40
                })

                doc.moveDown(2)
            })

            // Add page break between suppliers if not the last one
            if (Object.keys(supplierData).indexOf(supplierId) < Object.keys(supplierData).length - 1) {
                doc.addPage()
            }
        }

        // Finalize the PDF document
        doc.end()
    } catch (error) {
        console.error('Error generating supplier stock report:', error)
        res.status(500).json({ error: 'An error occurred while generating the supplier stock report.' })
    }
}

export default GenerateSupplierStockReport