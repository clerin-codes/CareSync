const paymentService = require("../services/paymentService");
const { generateReceiptBuffer } = require("../services/receiptPdfService");
const Appointment = require("../models/Appointment");

const createPayment = async (req, res, next) => {
  try {
    req.body.patient = req.user.id;
    const payment = await paymentService.createPayment(req.body);
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

const getPaymentById = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

const getPaymentByAppointment = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentByAppointment(req.params.appointmentId);
    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.verifyPayment(req.params.id);
    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

const failPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.failPayment(req.params.id);
    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

const getReceipt = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    if (payment.status !== "verified") {
      const err = new Error("Receipt available only for verified payments");
      err.statusCode = 400;
      throw err;
    }

    const appointmentId = payment.appointment._id || payment.appointment;
    const appointment = await Appointment.findById(appointmentId).populate("patient doctor");
    if (!appointment) {
      const err = new Error("Appointment not found");
      err.statusCode = 404;
      throw err;
    }

    const pdfBuffer = await generateReceiptBuffer({
      patient: appointment.patient,
      appointment,
      payment,
      doctor: { fullName: appointment.doctor.fullName },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="receipt-${payment.transactionRef || payment._id}.pdf"`);
    res.status(200).end(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  getPaymentById,
  getPaymentByAppointment,
  verifyPayment,
  failPayment,
  getReceipt,
};
