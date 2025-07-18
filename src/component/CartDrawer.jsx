import React, { useEffect, useState } from "react";
import {
  Drawer, Box, Typography, Button, IconButton, Tooltip, MenuItem, Select, InputBase
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart, clearCart, incrementQty, decrementQty, addToCart, setQty
} from "../store/cartSlice";
import { motion, useAnimation } from "framer-motion";
import axios from "axios";
import useMediaQuery from '@mui/material/useMediaQuery';
import PaymentModal from './PaymentModal';
import { useTheme } from "@mui/material/styles";

const CART_DRAWER_HEIGHT = 100;
const shakeVariant = {
  initial: { x: 0 },
  shake: { x: [0, -8, 8, -5, 5, -2, 2, 0], transition: { duration: 0.45 } }
};

const CartDrawer = ({ open, onClose }) => {
  const cart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  const controls = useAnimation();
  const [products, setProducts] = useState([]);
  const [payOpen, setPayOpen] = useState(false);
  const isMobile370 = useMediaQuery('(max-width:370px)');
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => { if (open) controls.start("shake"); }, [open, controls]);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(res => setProducts(res.data || []))
      .catch(() => setProducts([]));
  }, []);

  // Utils
  const findProduct = (item) =>
    products.find(p => p.id === item.id);

  const getVariants = (item) =>
    products.filter((p) => p.name === item.name);

  const getColors = (item) => {
    const variants = getVariants(item);
    return [...new Set(variants.map(v => v["text-color"] || v.color))];
  };

  const getSizes = (item, color) => {
    const variants = getVariants(item).filter(
      v => (v["text-color"] || v.color) === color
    );
    let sizes = [];
    variants.forEach(v => {
      if (v.clothing_sizes) sizes = sizes.concat(v.clothing_sizes.map(s => s.size));
      if (v.shoe_sizes) sizes = sizes.concat(v.shoe_sizes.map(s => s.size));
    });
    return [...new Set(sizes)];
  };

  // คืนค่าจำนวน stock จริงต่อไซส์/สี
  const getStock = (item) => {
    const variant = getVariants(item).find(
      v =>
        (v["text-color"] || v.color) === item.color &&
        (
          (v.clothing_sizes && v.clothing_sizes.some(s => s.size === item.size)) ||
          (v.shoe_sizes && v.shoe_sizes.some(s => s.size === item.size))
        )
    );
    if (!variant) return 0;
    let stock = 0;
    if (variant.clothing_sizes) {
      const s = variant.clothing_sizes.find(s => s.size === item.size);
      if (s) stock = s.qty;
    }
    if (variant.shoe_sizes) {
      const s = variant.shoe_sizes.find(s => s.size === item.size);
      if (s) stock = s.qty;
    }
    return stock;
  };

  const getPrice = (item) => {
    const p = findProduct(item);
    return p?.price || p?.originalPrice || item.price || 0;
  };

  // เมื่อเปลี่ยนสีหรือไซส์ใน cart
  const handleColorChange = (item, color) => {
    const variants = getVariants(item).filter(
      v => (v["text-color"] || v.color) === color
    );
    let variant = variants.find(v =>
      (v.clothing_sizes && v.clothing_sizes.some(s => s.size === item.size)) ||
      (v.shoe_sizes && v.shoe_sizes.some(s => s.size === item.size))
    );
    if (!variant) variant = variants[0];
    let size = item.size;
    if (variant) {
      if (variant.clothing_sizes && !variant.clothing_sizes.find(s => s.size === size))
        size = variant.clothing_sizes[0].size;
      if (variant.shoe_sizes && !variant.shoe_sizes.find(s => s.size === size))
        size = variant.shoe_sizes[0].size;
    }
    // ต้องส่ง stock ไปด้วย
    const stock = getStock({ ...variant, color, size });
    dispatch(removeFromCart({ id: item.id, color: item.color, size: item.size }));
    dispatch(addToCart({ ...variant, color, size, quantity: Math.min(item.quantity || 1, stock), stock }));
  };

  const handleSizeChange = (item, size) => {
    const variant = getVariants(item).find(v => {
      const thisColor = v["text-color"] || v.color;
      return thisColor === item.color &&
        ((v.clothing_sizes && v.clothing_sizes.some(s => s.size === size)) ||
          (v.shoe_sizes && v.shoe_sizes.some(s => s.size === size)));
    });
    const stock = getStock({ ...variant, color: item.color, size });
    dispatch(removeFromCart({ id: item.id, color: item.color, size: item.size }));
    dispatch(addToCart({ ...variant, color: item.color, size, quantity: Math.min(item.quantity || 1, stock), stock }));
  };

  // คุม input
  const handleQtyChange = (item, val) => {
    let qty = Number(val);
    const stock = getStock(item);
    if (isNaN(qty) || qty < 1) qty = 1;
    if (qty > stock) qty = stock;
    dispatch(setQty({ id: item.id, color: item.color, size: item.size, quantity: qty, stock }));
  };

  // ฟังก์ชันเพิ่ม-ลดจำนวนทีละ 1 (ส่ง stock ทุกครั้ง!)
  const handleInc = (item) => {
    const stock = getStock(item);
    if ((item.quantity || 1) < stock) {
      dispatch(incrementQty({ id: item.id, color: item.color, size: item.size, stock }));
    }
  };

  const handleDec = (item) => {
    if ((item.quantity || 1) > 1) {
      dispatch(decrementQty({ id: item.id, color: item.color, size: item.size }));
    }
  };

  const getTotal = () =>
    cart.reduce((acc, item) => acc + getPrice(item) * (item.quantity || 1), 0);

  // --- ฟังก์ชันล้างตะกร้า (Redux) ---
  const handleClearCart = () => dispatch(clearCart());

  // --- หลังชำระเงินเสร็จ (onSuccess) ---
  const handleSuccess = () => {
    handleClearCart();
    setPayOpen(false);
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            top: `${CART_DRAWER_HEIGHT}px`,
            height: `calc(85vh - ${CART_DRAWER_HEIGHT}px)`,
            width: 370,
            maxWidth: "95vw",
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
            overflow: "hidden",
            bgcolor: isDark ? "#111" : "#f6f6f8",
            boxShadow: 8,
            right: 15,
            position: 'fixed',
          },
        }}
        ModalProps={{ keepMounted: true }}
      >
        <motion.div
          variants={shakeVariant}
          initial="initial"
          animate={controls}
          style={{ height: "100%" }}
        >
          <Box sx={{
            display: "flex", flexDirection: "column", height: "100%", bgcolor: isDark ? "#111" : "#f6f6f8"
          }}>
            {/* Header */}
            <Box sx={{
              p: 0, display: "flex", alignItems: "center",
              minHeight: 66, px: 3, bgcolor: isDark ? "#222" : "#fff",
              borderTopLeftRadius: 20, borderBottomRightRadius: 44,
              borderBottom: `1px solid ${isDark ? "#232323" : "#e0e0e0"}`,
            }}>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ color: isDark ? "#fff" : "#222", flex: 1, letterSpacing: 0.2 }}
              >Shopping Cart</Typography>
              <Typography sx={{
                color: isDark ? "#bbb" : "#888", fontSize: 15, fontWeight: 400, mr: 2,
                minWidth: 56, textAlign: "right"
              }}>
                {cart.length} items
              </Typography>
              <Tooltip title="Close" arrow>
                <IconButton onClick={onClose} sx={{
                  color: isDark ? "#fff" : "#222", bgcolor: isDark ? "rgba(255,255,255,0.07)" : "#f4f4f4",
                  "&:hover": { bgcolor: isDark ? "#fff" : "#222", color: isDark ? "#222" : "#fff" }, ml: 1,
                }}><CloseIcon /></IconButton>
              </Tooltip>
            </Box>

            {/* Cart List */}
            <Box sx={{
              flex: 1, overflowY: "auto", px: 2, pt: 2, pb: 1, bgcolor: isDark ? "#111" : "#f6f6f8", minHeight: 0,
            }}>
              {cart.length === 0 ? (
                <Typography align="center" color="text.secondary" mt={10} fontSize={18} sx={{ color: isDark ? "#666" : "#888" }}>
                  Your cart is empty.
                </Typography>
              ) : (
                cart.map((item, idx) => {
                  const sizeOptions = getSizes(item, item.color);
                  const colorOptions = getColors(item);
                  const stock = getStock(item);
                  const price = getPrice(item);
                  const imgUrl = Array.isArray(item.img) ? item.img[0] : item.img;

                  return (
                    <Box
                      key={item.id + (item.color || "") + (item.size || "")}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2.2,
                        p: 2,
                        borderRadius: 3,
                        bgcolor: isDark ? "#181818" : "#fff",
                        minHeight: 116,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.10)",
                        gap: 2,
                      }}
                    >
                      {/* Product Image + Action Icons */}
                      <Box sx={{
                        position: "relative",
                        mr: 2,
                        width: 80,
                        height: 80,
                        borderRadius: 2.5,
                        bgcolor: "#fff",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px #0002",
                      }}>
                        <img
                          src={imgUrl}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            background: isDark ? "#222" : "#f6f6f6",
                            display: "block",
                          }}
                        />
                        {/* Badge (Qty) - Top Left */}
                        <Box sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: 26, height: 26, bgcolor: "#1c53e6",
                          border: "2px solid #fff",
                          borderRadius: "50%",
                          color: "#fff", fontWeight: 800, fontSize: 16,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          zIndex: 2
                        }}>
                          {item.quantity || 1}
                        </Box>
                        {/* Delete (Top Right) */}
                        <Tooltip title="Remove Item" arrow>
                          <IconButton
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 0, right: 0,
                              color: "#fff", bgcolor: "#e94242",
                              border: "2px solid #fff", p: 0.5, boxShadow: 2,
                              "&:hover": { bgcolor: "#c22" },
                              zIndex: 2,
                            }}
                            onClick={() =>
                              dispatch(removeFromCart({ id: item.id, color: item.color, size: item.size }))
                            }
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      {/* Info */}
                      <Box sx={{ flex: 1, minWidth: 0, pl: 0 }}>
                        <Tooltip title={item.name} arrow>
                          <Typography
                            fontWeight={700}
                            fontSize={15}
                            color={isDark ? "#fff" : "#222"}
                            sx={{
                              mb: 0.3, whiteSpace: "nowrap",
                              overflow: "hidden", textOverflow: "ellipsis", letterSpacing: 0.1,
                            }}
                          >
                            {item.name}
                          </Typography>
                        </Tooltip>
                        {/* Select: Size, Color */}
                        <Box sx={{
                          display: "flex", alignItems: "center", gap: 1.2, mb: 0.5,
                          flexWrap: "wrap"
                        }}>
                          {sizeOptions.length > 1 && (
                            <Select
                              size="small"
                              value={item.size}
                              onChange={e => handleSizeChange(item, e.target.value)}
                              sx={{
                                minWidth: 55, bgcolor: isDark ? "#242424" : "#f7f7f7", color: isDark ? "#fff" : "#222",
                                ".MuiSelect-icon": { color: isDark ? "#fff" : "#555" }, fontWeight: 700, height: 36,
                              }}
                              MenuProps={{ PaperProps: { sx: { bgcolor: isDark ? "#242424" : "#fff", color: isDark ? "#fff" : "#222" } } }}
                            >
                              {sizeOptions.map((s, i) => (
                                <MenuItem key={i} value={s}>{s}</MenuItem>
                              ))}
                            </Select>
                          )}
                          {colorOptions.length > 1 && (
                            <Select
                              size="small"
                              value={item.color}
                              onChange={e => handleColorChange(item, e.target.value)}
                              sx={{
                                minWidth: 60, bgcolor: isDark ? "#242424" : "#f7f7f7", color: isDark ? "#fff" : "#222",
                                ".MuiSelect-icon": { color: isDark ? "#fff" : "#555" }, fontWeight: 700, height: 36,
                              }}
                              MenuProps={{ PaperProps: { sx: { bgcolor: isDark ? "#242424" : "#fff", color: isDark ? "#fff" : "#222" } } }}
                            >
                              {colorOptions.map((c, i) => (
                                <MenuItem key={i} value={c}>{c}</MenuItem>
                              ))}
                            </Select>
                          )}
                          {sizeOptions.length === 1 && (
                            <Typography fontSize={13} color={isDark ? "#bbb" : "#888"}>{item.size}</Typography>
                          )}
                          {colorOptions.length === 1 && (
                            <Typography fontSize={13} color={isDark ? "#bbb" : "#888"}>{item.color}</Typography>
                          )}
                        </Box>
                        {/* Price */}
                        <Typography fontSize={15} fontWeight={700} color={isDark ? "#fff" : "#222"} sx={{ mb: 0.7 }}>
                          Price: ฿{price?.toLocaleString?.() || 0}
                        </Typography>
                        {/* Qty + Stock */}
                        <Box sx={{
                          display: "flex", alignItems: "center", gap: 0, mt: 0.5
                        }}>
                          <IconButton
                            size="small"
                            onClick={() => handleDec(item)}
                            disabled={(item.quantity || 1) <= 1}
                            sx={{
                              color: isDark ? "#fff" : "#222", bgcolor: isDark ? "#242424" : "#ececec", border: `1px solid ${isDark ? "#333" : "#ddd"}`,
                              "&:hover": { bgcolor: isDark ? "#181818" : "#e1e1e1" }, width: 28, height: 28,
                            }}
                          ><RemoveIcon /></IconButton>
                          <InputBase
                            value={item.quantity || 1}
                            type="number"
                            inputProps={{
                              min: 1, max: stock,
                              style: {
                                width: 35, textAlign: "center", color: isDark ? "#fff" : "#222", background: isDark ? "#1d1d1d" : "#f7f7f7",
                                fontWeight: 800, fontSize: 16, borderRadius: 2, padding: "3px 4px",
                              },
                            }}
                            sx={{ mx: 0.6 }}
                            onChange={(e) => handleQtyChange(item, e.target.value)}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleInc(item)}
                            disabled={(item.quantity || 1) >= stock}
                            sx={{
                              color: isDark ? "#fff" : "#222", bgcolor: isDark ? "#242424" : "#ececec", border: `1px solid ${isDark ? "#333" : "#ddd"}`,
                              "&:hover": { bgcolor: isDark ? "#181818" : "#e1e1e1" }, width: 28, height: 28,
                            }}
                          ><AddIcon /></IconButton>
                          {!isMobile370 && (
                            <Typography fontSize={12} color={isDark ? "#00e676" : "#1c53e6"} ml={2}>
                              Stock: {stock}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  );
                })
              )}
            </Box>
            {/* Footer */}
            <Box sx={{
              p: 2,
              borderTop: `1px solid ${isDark ? "#232323" : "#e0e0e0"}`,
              bgcolor: isDark ? "#111" : "#f6f6f8"
            }}>
              <Box sx={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", mb: 1.5,
              }}>
                <Typography fontWeight={700} fontSize={17} color={isDark ? "#fff" : "#222"}>
                  Total
                </Typography>
                <Typography
                  fontWeight={900}
                  fontSize={23}
                  sx={{
                    background: isDark ? "#fff" : "#222",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  ฿{getTotal().toLocaleString()}
                </Typography>
              </Box>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                disabled={cart.length === 0}
                sx={{
                  fontWeight: 800, fontSize: 16, letterSpacing: 0.4,
                  bgcolor: isDark ? "#fff" : "#222",
                  color: isDark ? "#111" : "#fff", mb: 2, py: 1.1,
                  boxShadow: "0 6px 18px rgba(80,80,80,0.10)", textTransform: "none",
                  "&:hover": { bgcolor: isDark ? "#fafafa" : "#111" },
                  "&:disabled": { background: isDark ? "#222" : "#ddd", color: "#888", boxShadow: "none" },
                }}
                onClick={() => setPayOpen(true)}
              >
                Order Products • ฿{getTotal().toLocaleString()}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="inherit"
                onClick={handleClearCart}
                disabled={cart.length === 0}
                sx={{
                  fontWeight: 700, color: isDark ? "#fff" : "#555", borderColor: isDark ? "#444" : "#bbb", background: isDark ? "#181818" : "#f6f6f8",
                  "&:hover": { borderColor: isDark ? "#fff" : "#222", background: isDark ? "#222" : "#ececec" },
                  textTransform: "none",
                }}
                startIcon={<DeleteIcon />}
              >
                Clear All
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Drawer>
      <PaymentModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        cart={cart}
        total={getTotal()}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default CartDrawer;
