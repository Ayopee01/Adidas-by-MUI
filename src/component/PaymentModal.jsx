import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogTitle, Typography, Box, TextField, Grid,
  Button, Divider, MenuItem, Select, InputLabel, FormControl, FormHelperText,
  Radio, RadioGroup, FormControlLabel, IconButton, Alert, Avatar, useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTheme } from '@mui/material/styles';

import jsPDF from "jspdf";
import "jspdf-autotable";
import "../fonts/Sarabun-Regular-normal";

const years = Array.from({ length: 12 }, (_, i) => `${new Date().getFullYear() + i}`.slice(2));
const months = Array.from({ length: 12 }, (_, i) => `${i + 1}`.padStart(2, '0'));
const LOCAL_KEY = "paymentFormData";

const textFieldSX = (darkMode) => ({
  '& .MuiInputBase-root': {
    color: darkMode ? '#fff' : '#222',
    background: darkMode ? '#232325' : '#fff',
    borderRadius: 2,
    fontWeight: 500,
  },
  '& .MuiInputLabel-root': {
    color: darkMode ? '#bdbdbd' : '#888',
  },
  '& .MuiFilledInput-root': {
    background: darkMode ? '#232325' : '#fff',
    borderRadius: 2,
    color: darkMode ? '#fff' : '#222',
    '&:before': {
      borderBottom: darkMode ? '1.5px solid #36393c' : '1.5px solid #c1c1c1',
    },
    '&:after': {
      borderBottom: `2px solid ${darkMode ? '#7ea6ff' : '#1976d2'}`,
    },
    '&:hover:not(.Mui-disabled):before': {
      borderBottom: `2px solid ${darkMode ? '#7ea6ff' : '#1976d2'}`,
    },
  },
  '& input, & textarea': {
    color: darkMode ? '#fff' : '#222',
    fontWeight: 500,
    background: 'transparent',
  }
});

export default function PaymentModal({
  open, onClose, cart = [], total = 0, onSuccess, clearCart
}) {
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    payment: 'card',
    cardName: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvc: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // สำรอง cart ไว้สำหรับ export PDF หลังชำระเงิน
  const [pdfCart, setPdfCart] = useState([]);
  const [pdfTotal, setPdfTotal] = useState(0);

  const [showSuccess, setShowSuccess] = useState(false);
  const isXs = useMediaQuery('(max-width:430px)');
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem(LOCAL_KEY);
      if (saved) {
        try {
          setForm(JSON.parse(saved));
        } catch (e) { /* ignore */ }
      }
    }
  }, [open]);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(form));
  }, [form]);

  const validate = () => {
    const newErr = {};
    if (!form.name) newErr.name = "กรุณากรอกชื่อ-นามสกุล";
    if (!form.address) newErr.address = "กรุณากรอกที่อยู่จัดส่ง";
    if (!form.phone || !/^[0-9]{10}$/.test(form.phone)) newErr.phone = "เบอร์โทร 10 หลัก";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErr.email = "อีเมลไม่ถูกต้อง";
    if (form.payment === "card") {
      if (!form.cardName) newErr.cardName = "ชื่อบนบัตร";
      if (!form.cardNumber || !/^[0-9]{16}$/.test(form.cardNumber)) newErr.cardNumber = "หมายเลขบัตร 16 หลัก";
      if (!form.expMonth) newErr.expMonth = "เดือน";
      if (!form.expYear) newErr.expYear = "ปี";
      if (!form.cvc || !/^[0-9]{3,4}$/.test(form.cvc)) newErr.cvc = "CVC 3-4 หลัก";
    }
    return newErr;
  };

  const getTotal = () =>
    cart.reduce((acc, item) =>
      acc + (item.price || item.originalPrice || 0) * (item.quantity || 1), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErr = validate();
    setErrors(newErr);
    setSubmitted(true);
    if (Object.keys(newErr).length === 0) {
      // สำรอง cart + total ไว้ใช้ export PDF (ก่อน clearCart)
      setPdfCart(cart);
      setPdfTotal(total || getTotal());
      setShowSuccess(true);
      onSuccess && onSuccess(form);
      // ไม่ต้อง clearCart ที่นี่! รอให้ export PDF ก่อน
    }
  };

  // --- PDF Receipt ---
  const handleExportPDF = () => {
    const doc = new jsPDF();
    if (window.SarabunRegular) {
      doc.addFileToVFS("Sarabun-Regular-normal.ttf", window.SarabunRegular);
      doc.addFont("Sarabun-Regular-normal.ttf", "Sarabun", "normal");
      doc.setFont("Sarabun", "normal");
    }
    doc.setFontSize(18);

    // Header
    doc.text('ใบเสร็จรับเงิน / Receipt', 105, 20, { align: 'center' });
    doc.setFontSize(13);
    let y = 35;
    doc.text(`ชื่อผู้ซื้อ: ${form.name || '-'}`, 15, y);
    doc.text(`ที่อยู่: ${form.address || '-'}`, 15, y += 8);
    doc.text(`เบอร์โทร: ${form.phone || '-'}`, 15, y += 8);
    doc.text(`E-mail: ${form.email || '-'}`, 15, y += 8);
    doc.text(`วิธีชำระเงิน: ${form.payment === "card" ? "บัตรเครดิต/เดบิต" : "เก็บเงินปลายทาง"}`, 15, y += 8);

    // Table Header
    y += 10;
    doc.setFontSize(13);
    doc.text('ลำดับ', 15, y);
    doc.text('สินค้า/Product', 30, y);
    doc.text('จำนวน/Qty', 120, y);
    doc.text('ราคา/Price', 145, y);
    doc.text('รวม/Total', 170, y);

    doc.setLineWidth(0.1);
    doc.line(15, y + 2, 195, y + 2);

    // รายการสินค้า
    let row = y + 10;
    doc.setFontSize(12);

    // ใช้ pdfCart ที่สำรองไว้!
    (pdfCart.length > 0 ? pdfCart : cart).forEach((item, idx) => {
      doc.text(`${idx + 1}`, 15, row);
      doc.text(item.name, 30, row);
      doc.text(`${item.quantity || 1}`, 120, row);
      doc.text(`${(item.price || item.originalPrice || 0).toLocaleString()}`, 145, row, { align: 'right' });
      doc.text(
        `${(((item.price || item.originalPrice || 0) * (item.quantity || 1)).toLocaleString())}`,
        170, row, { align: 'right' }
      );
      row += 8;
    });

    // Footer
    doc.line(15, row + 2, 195, row + 2);
    doc.setFontSize(13);
    const totalY = row + 15;
    doc.text('ยอดรวมสุทธิ (Total):', 15, totalY);
    doc.text(
      `${(pdfTotal || total || getTotal()).toLocaleString()} บาท (Baht)`,
      195,
      totalY,
      { align: 'right' }
    );

    doc.save(`Receipt_${new Date().toISOString().slice(0, 10)}.pdf`);

    // หลัง export PDF เสร็จแล้วค่อย clearCart!
    clearCart && clearCart();
    setShowSuccess(false); // ปิด popup สำเร็จ
  };

  // --- Success Dialog UI ---
  const SuccessDialog = (
    <Dialog open={showSuccess} onClose={() => setShowSuccess(false)} maxWidth="xs" fullWidth>
      <Box display="flex" flexDirection="column" alignItems="center" p={4}>
        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64, mb: 1 }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {form.payment === 'card'
            ? 'ยืนยันการชำระเงินเสร็จสิ้น'
            : 'ยืนยันการสั่งซื้อเรียบร้อยแล้ว'}
        </Typography>
        <Typography color="text.secondary" mb={2} align="center">
          {form.payment === 'card'
            ? 'การชำระเงินผ่านบัตรเครดิตของคุณสำเร็จ'
            : 'คำสั่งซื้อของคุณถูกบันทึกเรียบร้อย กรุณาชำระเงินเมื่อได้รับสินค้า'}
          <br />
          คุณสามารถดาวน์โหลดใบเสร็จรับเงิน (PDF) ได้ที่นี่
        </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={handleExportPDF}
          sx={{
            borderRadius: 3, px: 3, fontWeight: 700, fontSize: 17, mb: 2
          }}
        >
          ดาวน์โหลดใบเสร็จ (PDF)
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setShowSuccess(false);
            onClose && onClose();
          }}
        >
          ปิดหน้าต่าง
        </Button>
      </Box>
    </Dialog>
  );

  // -------- UI Main Dialog --------
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
        PaperProps={{
          sx: {
            background: darkMode ? '#1b1c1c' : '#fff',
            color: darkMode ? '#fff' : '#222',
          }
        }}
      >
        <DialogTitle sx={{ background: darkMode ? '#232325' : '#f7f7f7', color: darkMode ? '#fff' : '#222', fontWeight: 700 }}>
          ชำระเงิน / Checkout
          <IconButton onClick={onClose} sx={{
            position: 'absolute', top: 12, right: 16,
            color: darkMode ? '#fff' : '#222',
          }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* สรุปสินค้า */}
          <Typography fontWeight={700} mb={1} mt={1}>สรุปรายการสินค้า</Typography>
          {cart.length === 0 ? (
            <Typography color="text.secondary" mb={2}>ไม่มีสินค้าในตะกร้า</Typography>
          ) : cart.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 2, mb: 1, px: 1
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {item.img && (
                  <Avatar
                    src={Array.isArray(item.img) ? item.img[0] : item.img}
                    alt={item.name}
                    sx={{ width: 38, height: 38, mr: 1 }}
                    variant="rounded"
                  />
                )}
                <Box sx={{
                  minWidth: 0,
                  maxWidth: { xs: 110, sm: 160, md: 210 },
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <Typography
                    fontWeight={700}
                    fontSize={15}
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: { xs: 110, sm: 160, md: 210 },
                      display: 'block',
                    }}
                    title={item.name}
                  >
                    {item.name}
                  </Typography>
                  <Typography fontSize={13} color={darkMode ? "#bbb" : "text.secondary"} sx={{
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                  }}>
                    {item.color && `สี: ${item.color} `}
                    {item.size && `• ไซส์: ${item.size} `}
                    x{item.quantity || 1}
                  </Typography>
                </Box>
              </Box>
              <Typography fontWeight={700}>
                ฿{((item.price || item.originalPrice || 0) * (item.quantity || 1)).toLocaleString()}
              </Typography>
            </Box>
          ))}
          <Divider sx={{ my: 1.3, borderColor: darkMode ? "#444" : undefined }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography fontWeight={800}>ยอดสุทธิ</Typography>
            <Typography fontWeight={800} color="primary">
              ฿{(total || getTotal()).toLocaleString()}
            </Typography>
          </Box>
          <Divider sx={{ my: 2, borderColor: darkMode ? "#444" : undefined }} />

          {/* ฟอร์มข้อมูลผู้รับ */}
          <form onSubmit={handleSubmit} noValidate>
            <Typography fontWeight={700} mb={1}>ที่อยู่จัดส่ง</Typography>
            <TextField
              fullWidth label="ชื่อ-นามสกุล" margin="dense" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              error={!!errors.name} helperText={errors.name}
              variant="filled" sx={textFieldSX(darkMode)}
            />
            <TextField
              fullWidth label="ที่อยู่จัดส่ง" margin="dense" value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              error={!!errors.address} helperText={errors.address}
              variant="filled" sx={textFieldSX(darkMode)}
            />
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  fullWidth label="เบอร์โทรศัพท์" margin="dense" value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  error={!!errors.phone} helperText={errors.phone}
                  variant="filled" sx={textFieldSX(darkMode)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth label="E-mail" margin="dense" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  error={!!errors.email} helperText={errors.email}
                  variant="filled" sx={textFieldSX(darkMode)}
                />
              </Grid>
            </Grid>
            <Divider sx={{ my: 2, borderColor: darkMode ? "#444" : undefined }} />

            {/* วิธีชำระเงิน */}
            <Typography fontWeight={700} mb={1}>เลือกวิธีชำระเงิน</Typography>
            <RadioGroup
              row
              value={form.payment}
              onChange={e => setForm(f => ({ ...f, payment: e.target.value }))}
              sx={{ mb: 1, color: darkMode ? "#fff" : "#222" }}
            >
              <FormControlLabel
                value="card"
                control={<Radio color="primary" />}
                label={<Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                  <CreditCardIcon fontSize="small" /> <span>บัตรเครดิต/เดบิต</span>
                </Box>}
              />
              <FormControlLabel
                value="cod"
                control={<Radio color="primary" />}
                label={<Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                  <AttachMoneyIcon fontSize="small" /> <span>เก็บเงินปลายทาง</span>
                </Box>}
              />
            </RadioGroup>

            {/* Card fields */}
            {form.payment === "card" && (
              <Box mt={2} mb={1.5} sx={{
                bgcolor: darkMode ? "#212227" : "#f6fafd",
                borderRadius: 2,
                p: 2
              }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                    alt="VISA" height={28} style={{ marginRight: 10 }}
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
                    alt="MC" height={26}
                  />
                </Box>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      label="หมายเลขบัตร"
                      fullWidth
                      value={form.cardNumber}
                      onChange={e => setForm(f => ({
                        ...f, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16)
                      }))}
                      error={!!errors.cardNumber}
                      helperText={errors.cardNumber}
                      inputProps={{ maxLength: 16 }}
                      variant="filled"
                      sx={textFieldSX(darkMode)}
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      label="ชื่อบนบัตร"
                      fullWidth
                      value={form.cardName}
                      onChange={e => setForm(f => ({ ...f, cardName: e.target.value }))}
                      error={!!errors.cardName}
                      helperText={errors.cardName}
                      variant="filled"
                      sx={textFieldSX(darkMode)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormControl fullWidth error={!!errors.expMonth} variant="filled"
                      sx={{ background: darkMode ? "#232325" : "#fff", color: darkMode ? "#fff" : "#222", borderRadius: 2 }}>
                      <InputLabel sx={{ color: darkMode ? "#bdbdbd" : "#888" }}>เดือน</InputLabel>
                      <Select
                        value={form.expMonth}
                        label="เดือน"
                        onChange={e => setForm(f => ({ ...f, expMonth: e.target.value }))}
                        sx={{ color: darkMode ? "#fff" : "#222" }}
                      >
                        {months.map(m => <MenuItem value={m} key={m}>{m}</MenuItem>)}
                      </Select>
                      {errors.expMonth && <FormHelperText>{errors.expMonth}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}>
                    <FormControl fullWidth error={!!errors.expYear} variant="filled"
                      sx={{ background: darkMode ? "#232325" : "#fff", color: darkMode ? "#fff" : "#222", borderRadius: 2 }}>
                      <InputLabel sx={{ color: darkMode ? "#bdbdbd" : "#888" }}>ปี</InputLabel>
                      <Select
                        value={form.expYear}
                        label="ปี"
                        onChange={e => setForm(f => ({ ...f, expYear: e.target.value }))}
                        sx={{ color: darkMode ? "#fff" : "#222" }}
                      >
                        {years.map(y => <MenuItem value={y} key={y}>{y}</MenuItem>)}
                      </Select>
                      {errors.expYear && <FormHelperText>{errors.expYear}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="CVC"
                      fullWidth
                      value={form.cvc}
                      onChange={e => setForm(f => ({
                        ...f, cvc: e.target.value.replace(/\D/g, '').slice(0, 4)
                      }))}
                      error={!!errors.cvc}
                      helperText={errors.cvc}
                      inputProps={{ maxLength: 4 }}
                      variant="filled"
                      sx={textFieldSX(darkMode)}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {submitted && Object.keys(errors).length > 0 && (
              <Alert severity="error" sx={{ my: 2 }}>กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง</Alert>
            )}

            <Box mt={3} display="flex" gap={2} justifyContent="center" flexDirection={isXs ? "column" : "row"}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                sx={{
                  minWidth: isXs ? 70 : 120,
                  borderRadius: 3,
                  fontWeight: 700,
                  px: isXs ? 1.5 : 2,
                  width: isXs ? "100%" : undefined,
                  fontSize: isXs ? "1rem" : undefined
                }}
              >
                ชำระเงิน
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                sx={{
                  minWidth: isXs ? 70 : 120,
                  borderRadius: 3,
                  fontWeight: 700,
                  px: isXs ? 1.5 : 2,
                  width: isXs ? "100%" : undefined,
                  fontSize: isXs ? "1rem" : undefined,
                  color: darkMode ? "#fff" : undefined,
                  borderColor: darkMode ? "#fff" : undefined,
                  '&:hover': darkMode
                    ? { background: "#292a2f", borderColor: "#7ea6ff", color: "#7ea6ff" }
                    : {},
                }}
                onClick={onClose}
              >
                ยกเลิก
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
      {SuccessDialog}
    </>
  );
}
