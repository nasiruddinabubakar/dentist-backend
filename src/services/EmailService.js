const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  generateInvoiceTemplate(invoice, clinic, patient) {
    const formatDate = (date) => {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const formatCurrency = (amount) => {
      return `PKR ${parseFloat(amount).toFixed(2)}`;
    };

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice.invoiceNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Invoice</h1>
              <p style="margin: 10px 0 0 0; color: #e0f2fe; font-size: 16px;">${clinic.name || 'Dental Clinic'}</p>
            </td>
          </tr>
          
          <!-- Invoice Details -->
          <tr>
            <td style="padding: 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom: 20px;">
                    <h2 style="margin: 0; color: #1e293b; font-size: 24px; font-weight: 600;">Invoice #${invoice.invoiceNumber}</h2>
                    <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">Issue Date: ${formatDate(invoice.issueDate)}</p>
                    ${invoice.dueDate ? `<p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">Due Date: ${formatDate(invoice.dueDate)}</p>` : ''}
                  </td>
                  <td align="right" style="padding-bottom: 20px;">
                    <div style="display: inline-block; padding: 8px 16px; background-color: ${invoice.status === 'paid' ? '#10b981' : invoice.status === 'overdue' ? '#ef4444' : '#3b82f6'}; border-radius: 6px;">
                      <span style="color: #ffffff; font-size: 12px; font-weight: 600; text-transform: uppercase;">${invoice.status}</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Clinic and Patient Info -->
          <tr>
            <td style="padding: 0 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-right: 15px; vertical-align: top;">
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #06b6d4;">
                      <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-transform: uppercase;">From</h3>
                      <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">
                        <strong>${clinic.name || 'Dental Clinic'}</strong><br>
                        ${clinic.address || ''}<br>
                        ${clinic.phone ? `Phone: ${clinic.phone}` : ''}<br>
                        ${clinic.email ? `Email: ${clinic.email}` : ''}
                      </p>
                    </div>
                  </td>
                  <td width="50%" style="padding-left: 15px; vertical-align: top;">
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #14b8a6;">
                      <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-transform: uppercase;">Bill To</h3>
                      <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">
                        <strong>${patient.name || 'Patient'}</strong><br>
                        ${patient.email ? `${patient.email}<br>` : ''}
                        ${patient.phone ? `Phone: ${patient.phone}` : ''}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f1f5f9;">
                    <th style="padding: 12px; text-align: left; color: #475569; font-size: 12px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #e2e8f0;">Description</th>
                    <th style="padding: 12px; text-align: center; color: #475569; font-size: 12px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #e2e8f0;">Quantity</th>
                    <th style="padding: 12px; text-align: right; color: #475569; font-size: 12px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #e2e8f0;">Unit Price</th>
                    <th style="padding: 12px; text-align: right; color: #475569; font-size: 12px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #e2e8f0;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.items && invoice.items.length > 0 ? invoice.items.map(item => `
                  <tr>
                    <td style="padding: 15px 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 14px;">
                      <strong>${item.serviceName || item.description || 'Service'}</strong>
                    </td>
                    <td style="padding: 15px 12px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 14px;">${item.quantity || 1}</td>
                    <td style="padding: 15px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #64748b; font-size: 14px;">${formatCurrency(item.unitPrice || item.price || 0)}</td>
                    <td style="padding: 15px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #1e293b; font-size: 14px; font-weight: 600;">${formatCurrency(item.total || 0)}</td>
                  </tr>
                  `).join('') : '<tr><td colspan="4" style="padding: 20px; text-align: center; color: #64748b;">No items</td></tr>'}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <tr>
                  <td align="right" style="padding: 8px 0;">
                    <table align="right" cellpadding="0" cellspacing="0" style="width: 250px;">
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; text-align: right;">Subtotal:</td>
                        <td style="padding: 8px 0; padding-left: 20px; color: #1e293b; font-size: 14px; text-align: right; width: 100px;">${formatCurrency(invoice.subtotal || 0)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; text-align: right;">Tax:</td>
                        <td style="padding: 8px 0; padding-left: 20px; color: #1e293b; font-size: 14px; text-align: right;">${formatCurrency(invoice.tax || 0)}</td>
                      </tr>
                      <tr style="background-color: #f8fafc; border-top: 2px solid #e2e8f0; border-bottom: 2px solid #e2e8f0;">
                        <td style="padding: 12px 0; color: #1e293b; font-size: 18px; font-weight: 700; text-align: right;">Total:</td>
                        <td style="padding: 12px 0; padding-left: 20px; color: #06b6d4; font-size: 18px; font-weight: 700; text-align: right;">${formatCurrency(invoice.total || 0)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Notes -->
          ${invoice.notes ? `
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;"><strong>Notes:</strong> ${invoice.notes}</p>
              </div>
            </td>
          </tr>
          ` : ''}

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #64748b; font-size: 12px; line-height: 1.6;">
                Thank you for choosing ${clinic.name || 'our clinic'}.<br>
                If you have any questions about this invoice, please contact us.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  async sendInvoice(invoice, clinic, patient, recipientEmail) {
    try {
      const htmlContent = this.generateInvoiceTemplate(invoice, clinic, patient);

      const mailOptions = {
        from: `"${clinic.name || 'Dental Clinic'}" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: `Invoice #${invoice.invoiceNumber} - ${clinic.name || 'Dental Clinic'}`,
        html: htmlContent,
        text: `Invoice #${invoice.invoiceNumber}\n\nPlease find your invoice attached.\n\nTotal: PKR ${invoice.total}\n\nThank you!`
      };

      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}

module.exports = new EmailService();

