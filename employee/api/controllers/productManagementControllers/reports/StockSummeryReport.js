import PDFDocument from 'pdfkit'
import StockProducts from '../../../models/productManagementModels/StockProductsModel.js'

export const StockSummaryReport = async (req, res) => {
    try {
        // Fetch stock product data with product details
        const stockProducts = await StockProducts.find().populate('product')

        // Calculate stock overview
        let totalStockValue = 0
        let totalQuantityAvailable = 0
        const uniqueItems = new Set()

        stockProducts.forEach((item) => {
            totalStockValue += item.price * item.quantity
            totalQuantityAvailable += item.quantity
            uniqueItems.add(item.product?._id.toString())
        })

        const totalUniqueItems = uniqueItems.size

        // Create a new PDF document with better defaults
        const doc = new PDFDocument({
            margin: 30,
            size: 'A4',
            bufferPages: true,
            info: {
                Title: 'Stock Summary Report',
                Author: 'Inventory Management System',
                Creator: 'Inventory Management System',
                CreationDate: new Date(),
            },
        })

        // Set response headers
        res.setHeader('Content-disposition', 'attachment; filename="stock-summary-report.pdf"')
        res.setHeader('Content-type', 'application/pdf')

        // Pipe PDF to response
        doc.pipe(res)

        // Add header with logo and title
        // Report Header
        doc
            .fillColor('#62b8a0')
            .font('Helvetica-Bold')
            .fontSize(24)
            .text('Pabasara Products', { align: 'center' })
        doc.moveDown(4)

        doc
            .fillColor('#444444')
            .font('Helvetica')
            .fontSize(20)
            .text('Stock Summary Report', 50, 57)
            .fontSize(10)
            .text(`Generated on: ${new Date().toLocaleString()}`, 50, 80)
            .moveDown(3)

        // Draw a colored line
        doc.strokeColor('#2951bd').lineWidth(3).moveTo(50, 100).lineTo(550, 100).stroke()

        // Stock Overview Section with colored box
        doc.fillColor('#2951bd').fontSize(16).text('Stock Overview', 50, 120)

        // Create a colored box for overview
        doc.roundedRect(50, 140, 500, 80, 5).fill('#e6ebf8')

        // Reset text color
        doc.fillColor('#333333')

        // Overview details in columns
        const overviewStartY = 150
        doc.fontSize(12).text('Total Stock Value:', 60, overviewStartY)
        doc
            .fontSize(12)
            .text(`Rs.${totalStockValue.toFixed(2)}`, 200, overviewStartY, { width: 150, align: 'right' })

        doc.text('Total Unique Items:', 60, overviewStartY + 20)
        doc.text(`${totalUniqueItems}`, 200, overviewStartY + 20, { width: 150, align: 'right' })

        doc.text('Total Quantity Available:', 60, overviewStartY + 40)
        doc.text(`${totalQuantityAvailable}`, 200, overviewStartY + 40, { width: 150, align: 'right' })

        doc.moveDown(3)

        // Item-wise Stock Details Section
        doc.fillColor('#2951bd').fontSize(16).text('Item-Wise Stock Details', 50, 240)
        doc.moveDown()

        // Table header
        const tableTop = 270
        const itemCodeX = 50
        const nameX = 80
        const qtyX = 250
        const priceX = 320
        const totalX = 390
        const expiryX = 460

        doc.fontSize(10).fillColor('#ffffff')
        doc.roundedRect(itemCodeX, tableTop, 500, 20, 3).fill('#2951bd')

        doc.text('ID', itemCodeX + 10, tableTop + 5)
        doc.text('Product Name', nameX, tableTop + 5)
        doc.text('Qty', qtyX, tableTop + 5)
        doc.text('Price', priceX, tableTop + 5)
        doc.text('Total', totalX, tableTop + 5)
        doc.text('Expiry', expiryX, tableTop + 5)

        // Table rows
        doc.fontSize(10).fillColor('#333333')
        let y = tableTop + 25

        stockProducts.forEach((item, index) => {
            if (y > 700) {
                // Add new page if we're at the bottom
                doc.addPage()
                y = 50
                // Repeat table header on new page
                doc.fontSize(10).fillColor('#ffffff')
                doc.roundedRect(itemCodeX, y - 20, 500, 20, 3).fill('#2951bd')
                doc.text('ID', itemCodeX + 10, y - 15)
                doc.text('Product Name', nameX, y - 15)
                doc.text('Qty', qtyX, y - 15)
                doc.text('Price', priceX, y - 15)
                doc.text('Total', totalX, y - 15)
                doc.text('Expiry', expiryX, y - 15)
                y += 25
            }

            // Alternate row colors
            if (index % 2 === 0) {
                doc.roundedRect(itemCodeX, y - 5, 500, 20, 3).fill('#f9f9f9')
            }

            doc.fillColor('#333333')
            doc.text((index + 1).toString(), itemCodeX + 10, y)
            doc.text(item.product?.name || 'Unknown', nameX, y)
            doc.text(item.quantity.toString(), qtyX, y)
            doc.text(`Rs.${item.price.toFixed(2)}`, priceX, y)
            doc.text(`Rs.${(item.quantity * item.price).toFixed(2)}`, totalX, y)
            doc.text(new Date(item.expirationDate).toLocaleDateString(), expiryX, y)

            y += 25
        })

        // Low Stock Alerts Section
        const lowStockItems = stockProducts.filter((item) => item.quantity < 20)

        if (lowStockItems.length > 0) {
            doc.addPage()
            doc.fillColor('#d9534f').fontSize(16).text('Low Stock Alerts', 50, 50)
            doc.fillColor('#666666').fontSize(10).text('Items with quantity less than 20', 50, 70)

            // Warning icon box
            doc.roundedRect(50, 90, 500, 30, 5).fill('#fdf3f2').stroke('#d9534f')

            doc.fillColor('#d9534f').fontSize(12).text('⚠ Attention Needed', 70, 98)
            doc
                .fillColor('#d9534f')
                .fontSize(10)
                .text(`${lowStockItems.length} items need replenishment`, 70, 115)

            // Low stock items table
            const lowStockTableTop = 140

            // Table header
            doc.fontSize(10).fillColor('#ffffff')
            doc.roundedRect(50, lowStockTableTop, 500, 20, 3).fill('#d9534f')

            doc.text('ID', 60, lowStockTableTop + 5)
            doc.text('Product Name', 100, lowStockTableTop + 5)
            doc.text('Current Qty', 350, lowStockTableTop + 5)
            doc.text('Days to Expiry', 420, lowStockTableTop + 5)

            // Table rows
            doc.fontSize(10).fillColor('#333333')
            let lowStockY = lowStockTableTop + 25

            lowStockItems.forEach((item, index) => {
                if (lowStockY > 700) {
                    doc.addPage()
                    lowStockY = 50
                }

                const daysToExpiry = Math.floor(
                    (new Date(item.expirationDate) - new Date()) / (1000 * 60 * 60 * 24)
                )

                // Alternate row colors
                if (index % 2 === 0) {
                    doc.roundedRect(50, lowStockY - 5, 500, 20, 3).fill('#fdf3f2')
                }

                doc.fillColor('#333333')
                doc.text((index + 1).toString(), 60, lowStockY)
                doc.text(item.product?.name || 'Unknown', 100, lowStockY)
                doc.text(item.quantity.toString(), 350, lowStockY)

                // Color code days to expiry
                if (daysToExpiry < 30) {
                    doc.fillColor('#d9534f')
                } else if (daysToExpiry < 90) {
                    doc.fillColor('#f0ad4e')
                } else {
                    doc.fillColor('#2951bd') // >90 days ⇒ main blue
                }

                doc.text(daysToExpiry.toString(), 420, lowStockY)

                lowStockY += 25
            })
        }

        // Finalize PDF
        doc.end()
    } catch (error) {
        console.error('Error generating stock report:', error)
        res.status(500).json({ error: 'An error occurred while generating the stock report.' })
    }
}

export default StockSummaryReport