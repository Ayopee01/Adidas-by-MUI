import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogTitle, Typography, Box, TextField, Grid,
  Button, Divider, MenuItem, Select, InputLabel, FormControl, FormHelperText,
  Radio, RadioGroup, FormControlLabel, IconButton, Alert, Avatar, useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const years = Array.from({ length: 12 }, (_, i) => `${new Date().getFullYear() + i}`.slice(2));
const months = Array.from({ length: 12 }, (_, i) => `${i + 1}`.padStart(2, '0'));

export default function PaymentModal({
  open, onClose, cart = [], total = 0, onSuccess
}) {
  // ฟอร์ม state
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

  // Detect mobile width
  const isXs = useMediaQuery('(max-width:430px)');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErr = validate();
    setErrors(newErr);
    setSubmitted(true);
    if (Object.keys(newErr).length === 0) {
      onSuccess && onSuccess(form); // ส่งฟอร์มกลับไป ถ้าต้องการใช้งานต่อ
      // สามารถ reset form ได้ที่นี่ถ้าต้องการ
    }
  };

  // ใช้ราคารวมจาก props.total ถ้าไม่มีคำนวณเอง
  const getTotal = () =>
    cart.reduce((acc, item) =>
      acc + (item.price || item.originalPrice || 0) * (item.quantity || 1), 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight={700}>
          ชำระเงิน / Checkout
        </Typography>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 12, right: 16 }}>
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
                minWidth: 0, // fix for ellipsis
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
                <Typography fontSize={13} color="text.secondary" sx={{
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
        <Divider sx={{ my: 1.3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography fontWeight={800}>ยอดสุทธิ</Typography>
          <Typography fontWeight={800} color="primary">
            ฿{(total || getTotal()).toLocaleString()}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />

        {/* ฟอร์มข้อมูลผู้รับ */}
        <form onSubmit={handleSubmit} noValidate>
          <Typography fontWeight={700} mb={1}>ที่อยู่จัดส่ง</Typography>
          <TextField
            fullWidth label="ชื่อ-นามสกุล" margin="dense" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            error={!!errors.name} helperText={errors.name}
          />
          <TextField
            fullWidth label="ที่อยู่จัดส่ง" margin="dense" value={form.address}
            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
            error={!!errors.address} helperText={errors.address}
          />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                fullWidth label="เบอร์โทรศัพท์" margin="dense" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                error={!!errors.phone} helperText={errors.phone}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth label="E-mail" margin="dense" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                error={!!errors.email} helperText={errors.email}
              />
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />

          {/* วิธีชำระเงิน */}
          <Typography fontWeight={700} mb={1}>เลือกวิธีชำระเงิน</Typography>
          <RadioGroup
            row
            value={form.payment}
            onChange={e => setForm(f => ({ ...f, payment: e.target.value }))}
            sx={{ mb: 1 }}
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
            <Box mt={2} mb={1.5} sx={{ bgcolor: "#f6fafd", borderRadius: 2, p: 2 }}>
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
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth error={!!errors.expMonth}>
                    <InputLabel>เดือน</InputLabel>
                    <Select
                      value={form.expMonth}
                      label="เดือน"
                      onChange={e => setForm(f => ({ ...f, expMonth: e.target.value }))}
                    >
                      {months.map(m => <MenuItem value={m} key={m}>{m}</MenuItem>)}
                    </Select>
                    {errors.expMonth && <FormHelperText>{errors.expMonth}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth error={!!errors.expYear}>
                    <InputLabel>ปี</InputLabel>
                    <Select
                      value={form.expYear}
                      label="ปี"
                      onChange={e => setForm(f => ({ ...f, expYear: e.target.value }))}
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
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {submitted && Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ my: 2 }}>กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง</Alert>
          )}

          {/* Responsive button size */}
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
                fontSize: isXs ? "1rem" : undefined
              }}
              onClick={onClose}
            >
              ยกเลิก
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}
