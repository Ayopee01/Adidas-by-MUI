import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Grid, Typography, Button, Chip,
  IconButton, Breadcrumbs, Link, CircularProgress, TextField, Paper, Modal, Fade
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [allVariants, setAllVariants] = useState([]);
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [modalIdx, setModalIdx] = useState(0);

  // --- Responsive
  const theme = useTheme();
  const is1480down = useMediaQuery('(max-width:1480px)');
  const is860down = useMediaQuery('(max-width:860px)');
  const is500down = useMediaQuery('(max-width:500px)');
  const is460down = useMediaQuery('(max-width:460px)');

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        const found = res.data.find((p) => String(p.id) === String(id));
        setProduct(found);
        const variants = res.data.filter((p) => p.name === found.name);
        setAllVariants(variants);

        setSelectedColor(variants[0]);
        if (variants[0].clothing_sizes)
          setSelectedSize(variants[0].clothing_sizes[0].size);
        if (variants[0].shoe_sizes)
          setSelectedSize(variants[0].shoe_sizes[0].size);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!selectedColor) return;
    if (selectedColor.clothing_sizes)
      setSelectedSize(selectedColor.clothing_sizes[0].size);
    if (selectedColor.shoe_sizes)
      setSelectedSize(selectedColor.shoe_sizes[0].size);
  }, [selectedColor]);

  if (loading)
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;

  if (!product)
    return (
      <Box py={8} textAlign="center">
        <Typography variant="h5">ไม่พบสินค้า</Typography>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 3 }}>ย้อนกลับ</Button>
      </Box>
    );

  // Prepare images in rows of 2 horizontally (แต่ละ row = [img1, img2])
  const images = Array.isArray(selectedColor?.img) ? selectedColor.img : [selectedColor?.img];
  const imageRows = [];
  let rowSize = 2;
  if (is860down) rowSize = 1; // แถวละ 1 รูป
  for (let i = 0; i < images.length; i += rowSize) {
    imageRows.push(images.slice(i, i + rowSize));
  }

  const sizeOptions = selectedColor?.clothing_sizes
    ? selectedColor.clothing_sizes
    : selectedColor?.shoe_sizes || [];
  const stock = sizeOptions.find(s => s.size === selectedSize)?.qty ?? 0;

  const handleAddToCart = () => {
    if (!selectedSize || stock === 0) return;
    dispatch(addToCart({
      id: selectedColor.id,
      name: selectedColor.name,
      img: images[0],
      color: selectedColor["text-color"] || selectedColor.color,
      size: selectedSize,
      price: selectedColor.price || selectedColor.originalPrice,
      quantity: quantity,
      originalPrice: selectedColor.originalPrice,
      discount: selectedColor.discount,
    }));
  };

  // === Modal รูป ===
  const handleOpenModal = (idx) => { setModalIdx(idx); setOpenModal(true); };
  const handleCloseModal = () => setOpenModal(false);
  const handlePrev = (e) => { e.stopPropagation(); setModalIdx((prev) => (prev - 1 + images.length) % images.length); };
  const handleNext = (e) => { e.stopPropagation(); setModalIdx((prev) => (prev + 1) % images.length); };

  // --- Responsive styles ---
  // กำหนดขนาดรูปแบบอิง breakpoint
  const imageBoxWidth = is500down ? 250 : is860down ? 340 : 400;
  const imageBoxHeight = imageBoxWidth;

  // Breadcrumb & title font
  const breadFontSize = is460down ? 13 : 16;
  const prodNameFont = is460down ? 23 : is500down ? 27 : 33;

  const colorBoxStyle = (isSelected) => ({
    p: 1,
    borderRadius: 2,
    cursor: 'pointer',
    border: isSelected ? '2.5px solid #111' : '1.5px solid #d9d9d9',
    bgcolor: isSelected ? '#111' : '#fff',
    color: isSelected ? '#fff' : '#222',
    minWidth: 90,
    minHeight: 60,
    display: 'flex', alignItems: 'center', gap: 1.5,
    transition: 'all 0.2s',
    boxShadow: isSelected ? '0 4px 18px rgba(0,0,0,0.05)' : 'none'
  });

  const colorImgStyle = (isSelected) => ({
    width: isSelected ? 46 : 38,
    height: isSelected ? 46 : 38,
    borderRadius: 8,
    background: '#eee',
    border: isSelected ? '2px solid #fff' : '1px solid #aaa',
    boxShadow: isSelected ? '0 4px 16px rgba(0,0,0,0.14)' : 'none',
    transition: 'all 0.22s'
  });

  return (
    <Box sx={{
      background: '#fafbfc',
      minHeight: '100vh',
      py: 3,
      pl: is1480down ? 0 : 7,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Breadcrumb */}
      <Breadcrumbs sx={{
        mb: 3, fontSize: breadFontSize, maxWidth: 1200,
        mx: "auto"
      }}>
        <Link
          underline="hover"
          onClick={() => navigate('/')}
          sx={{ cursor: 'pointer', fontSize: breadFontSize }}
        >ย้อนกลับ</Link>
        <Typography color="text.primary" sx={{ fontSize: breadFontSize }}>{product.name}</Typography>
      </Breadcrumbs>

      <Grid
        container
        spacing={3}
        sx={{
          maxWidth: '1500px',
          mx: 'auto',
          px: 2,
          alignItems: { md: is1480down ? 'center' : 'flex-start', xs: 'center' },
          justifyContent: 'center'
        }}
      >
        {/* Gallery */}
        <Grid item xs={12} md={4.5}>
          <Box display="flex" flexDirection="column" gap={2} alignItems="center">
            {imageRows.map((row, i) => (
              <Box key={i} display="flex" gap={2} width="100%" flexDirection="row" justifyContent="center">
                {row.map((img, idx) => (
                  <Paper
                    key={idx}
                    elevation={1}
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      background: '#fff',
                      width: imageBoxWidth,
                      height: imageBoxHeight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      '&:hover .zoom-overlay': { opacity: 1 }
                    }}
                    onClick={() => handleOpenModal(i * rowSize + idx)}
                  >
                    {img ? (
                      <>
                        <img
                          src={img}
                          alt={`product-img-${i * rowSize + idx}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                        {/* Hover Overlay + Icon */}
                        <Box
                          className="zoom-overlay"
                          sx={{
                            opacity: 0,
                            transition: 'opacity 0.25s',
                            position: 'absolute',
                            top: 0, left: 0,
                            width: '100%', height: '100%',
                            bgcolor: 'rgba(0,0,0,0.21)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2,
                            pointerEvents: 'none'
                          }}
                        >
                          <ZoomInIcon sx={{ color: '#fff', fontSize: 48, filter: 'drop-shadow(0 2px 6px #222)' }} />
                        </Box>
                      </>
                    ) : null}
                  </Paper>
                ))}
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Detail */}
        <Grid item xs={12} md={7.5}>
          <Box sx={{
            background: '#fff',
            borderRadius: 5,
            p: { xs: 2, md: 4 },
            boxShadow: 2,
            maxWidth: 530,
            mx: { md: 0, xs: 'auto' },
            minHeight: 430,
            display: 'flex', flexDirection: 'column',
            gap: 1.5
          }}>
            <Typography
              variant="h4"
              color="#111"
              fontWeight={900}
              sx={{
                mb: 1,
                fontSize: prodNameFont,
                [theme.breakpoints.down('460')]: { fontSize: 19 }
              }}
            >
              {product.name}
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="h5" color="#111" fontWeight={800}>
                ฿{(selectedColor.price || selectedColor.originalPrice)?.toLocaleString()}
              </Typography>
              {selectedColor.discount > 0 && (
                <>
                  <Chip
                    label={`SALE -${selectedColor.discount}%`}
                    color="error"
                    sx={{ fontWeight: 700, fontSize: 16 }}
                  />
                  <Typography variant="body1" color="#888" sx={{ textDecoration: 'line-through', ml: 1 }}>
                    ฿{selectedColor.originalPrice?.toLocaleString()}
                  </Typography>
                </>
              )}
            </Box>
            <Typography
              variant="h6"
              color='#252525'
              sx={{
                mb: 2,
                fontWeight: 600,
                fontSize: is460down ? 16 : 20
              }}>
              รายละเอียดสินค้า
            </Typography>
            <Box component="ul" sx={{
              color: '#252525', mb: 2, pl: 3, fontSize: 16, lineHeight: 1.8, wordBreak: 'break-word', maxWidth: 480
            }}>
              {(Array.isArray(selectedColor.detail) ? selectedColor.detail : [selectedColor.detail]).map((d, i) =>
                <li key={i} style={{ marginBottom: 3 }}>{d}</li>
              )}
            </Box>

            {/* สี */}
            <Typography fontWeight={700} color='#252525' sx={{ mb: 1, fontSize: is460down ? 13.5 : 16 }}>Color</Typography>
            <Box display="flex" gap={2} mb={2} flexWrap="wrap">
              {allVariants.map((v, idx) => {
                const isSelected = selectedColor === v;
                return (
                  <Box
                    key={v["text-color"] || v.color}
                    onClick={() => setSelectedColor(v)}
                    sx={colorBoxStyle(isSelected)}
                  >
                    <img
                      src={Array.isArray(v.img) ? v.img[0] : v.img}
                      alt={v["text-color"] || v.color}
                      style={colorImgStyle(isSelected)}
                    />
                    <Typography fontSize={14} sx={{
                      fontWeight: 600,
                      color: isSelected ? "#fff" : "#222",
                      whiteSpace: 'pre-line'
                    }}>
                      {v["text-color"] || v.color}
                    </Typography>
                  </Box>
                )
              })}
            </Box>

            {/* ไซส์ */}
            <Typography fontWeight={700} color='#252525' sx={{ mb: 1, fontSize: is460down ? 13.5 : 16 }}>Size</Typography>
            <Box display="flex" flexWrap="wrap" gap={1.3} mb={2}>
              {sizeOptions.map(({ size, qty }) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "contained" : "outlined"}
                  color={selectedSize === size ? "primary" : "inherit"}
                  disabled={qty === 0}
                  onClick={() => setSelectedSize(size)}
                  sx={{
                    minWidth: 74,
                    fontWeight: 700,
                    mb: 1,
                    color: selectedSize === size ? "#fff" : "#111",
                    background: selectedSize === size ? "#111" : "#fff",
                    border: selectedSize === size ? "1.5px solid #111" : "1.5px solid #eee",
                    transition: "all 0.14s"
                  }}
                >
                  {size}
                </Button>
              ))}
            </Box>
            {/* จำนวน */}
            <Box display="flex" alignItems="center" mb={1.5}>
              <Typography sx={{ fontSize: is460down ? 13.5 : 16 }}>จำนวน</Typography>
              <TextField
                type="number"
                value={quantity}
                onChange={e => setQuantity(Math.max(1, Math.min(Number(e.target.value), stock)))}
                size="small"
                inputProps={{ min: 1, max: stock, style: { width: 64, textAlign: 'center' } }}
                disabled={stock === 0}
                sx={{ mx: 2, background: '#f6f7f8', borderRadius: 2 }}
              />
              <Typography color={stock === 0 ? "error" : "#1aac3d"} sx={{ fontSize: is460down ? 13 : 15 }}>
                Stock: {stock}
              </Typography>
            </Box>
            {/* Add to cart */}
            <Button
              variant="contained"
              color="inherit"
              startIcon={<ShoppingCartIcon />}
              sx={{
                my: 2, width: '100%', py: 1.4, fontSize: 18, borderRadius: 2,
                background: "#111", color: "#fff", fontWeight: 600,
                '&:hover': { background: "#222" }
              }}
              disabled={!selectedSize || stock === 0}
              onClick={handleAddToCart}
            >
              เพิ่มไปยังตะกร้า
            </Button>
          </Box>
        </Grid>
      </Grid>
      {/* === Modal for Image Preview === */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          bgcolor: 'rgba(0,0,0,0.8)'
        }}
      >
        <Fade in={openModal}>
          <Box sx={{
            position: 'relative',
            outline: 'none',
            maxWidth: '90vw',
            maxHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: 'absolute',
                top: 10, right: 10, color: '#fff', zIndex: 10,
                background: 'rgba(0,0,0,0.25)', '&:hover': { background: 'rgba(0,0,0,0.5)' }
              }}
            >
              <CloseIcon fontSize="large" />
            </IconButton>
            {images.length > 1 && (
              <IconButton
                onClick={handlePrev}
                sx={{
                  position: 'absolute', left: 10, top: '50%',
                  transform: 'translateY(-50%)', color: '#fff',
                  background: 'rgba(0,0,0,0.2)', '&:hover': { background: 'rgba(0,0,0,0.5)' }
                }}
              >
                <ChevronLeftIcon fontSize="large" />
              </IconButton>
            )}
            <img
              src={images[modalIdx]}
              alt={`product-large-${modalIdx}`}
              style={{
                maxHeight: '85vh',
                maxWidth: '85vw',
                borderRadius: 10,
                boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
                background: '#fff'
              }}
            />
            {images.length > 1 && (
              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute', right: 10, top: '50%',
                  transform: 'translateY(-50%)', color: '#fff',
                  background: 'rgba(0,0,0,0.2)', '&:hover': { background: 'rgba(0,0,0,0.5)' }
                }}
              >
                <ChevronRightIcon fontSize="large" />
              </IconButton>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ProductDetail;
