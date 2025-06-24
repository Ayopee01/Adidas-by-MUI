import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Grid, Typography, Card, CardMedia, CardContent, Chip, Button, Container, Divider, Tabs, Tab,
  TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Modal, IconButton, Fade, Backdrop, useMediaQuery
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import BlockIcon from '@mui/icons-material/Block';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

// --- colors ---
const colors = {
  primary: "#111",
  background: "#fff",
  border: "#e0e0e0",
  gray: "#888",
  disabled: "#e0e0e0",
  sky: "#2b7fff",
  red: "#e7000b"
};

const BackgroundContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: colors.background,
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '3.2rem',
  fontWeight: 900,
  color: colors.primary,
  textAlign: 'center',
  marginBottom: theme.spacing(1),
  letterSpacing: '-0.02em',
  fontFamily: 'Helvetica Neue, Arial, sans-serif',
  [theme.breakpoints.down('485')]: {
    fontSize: '2.1rem',
  }
}));

const SectionSubTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.15rem',
  color: colors.gray,
  textAlign: 'center',
  marginBottom: theme.spacing(5),
  fontWeight: 400,
  letterSpacing: '0.02em',
  [theme.breakpoints.down('485')]: {
    fontSize: '0.97rem',
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 24,
  overflow: 'hidden',
  backgroundColor: colors.background,
  boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
  border: `1.5px solid ${colors.border}`,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  height: '630px',
  width: '100%',
  maxWidth: '100%',
  flex: '1 1 auto',
  transition: 'box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: '0 8px 36px 0 rgba(0,0,0,0.15)',
  },
  [theme.breakpoints.down('485')]: {
    height: '530px',
    '& .MuiTypography-h6': { fontSize: '0.97rem' },
    '& .MuiChip-label': { fontSize: '0.85rem' }
  }
}));

const SaleBadge = styled(Box)(() => ({
  position: 'absolute',
  top: 16,
  left: 16,
  background: colors.red,
  color: "#fff",
  fontWeight: 'bold',
  padding: '8px 14px',
  borderRadius: '20px',
  fontSize: '0.8rem',
  zIndex: 10,
  boxShadow: '0 2px 8px rgba(255, 0, 0, 0.08)'
}));

const ImageContainer = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  height: '280px',
  overflow: 'hidden',
  cursor: 'pointer',
  backgroundColor: '#fafafa',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover .zoom-overlay': { opacity: 1 }
}));

const ZoomOverlay = styled(Box)(() => ({
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.15)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s',
  zIndex: 5,
}));

const StyledModal = styled(Modal)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
}));

const ModalContent = styled(Box)(() => ({
  position: 'relative',
  maxWidth: '90vw',
  maxHeight: '90vh',
  outline: 'none',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
  background: colors.background
}));

const ModalImage = styled('img')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  display: 'block',
}));

const CloseButton = styled(IconButton)(() => ({
  position: 'absolute',
  top: 16,
  right: 16,
  backgroundColor: colors.primary,
  color: '#fff',
  zIndex: 10,
  '&:hover': { backgroundColor: "#000" },
}));

const ColorDot = styled(Box)(({ colors: dotColors = [], selected }) => ({
  width: 28, height: 28, borderRadius: '50%',
  background: Array.isArray(dotColors) && dotColors.length === 2
    ? `linear-gradient(90deg, ${dotColors[0]} 50%, ${dotColors[1]} 50%)`
    : (dotColors[0] || '#ccc'),
  border: selected ? `3px solid ${colors.sky}` : `2px solid ${colors.border}`,
  cursor: 'pointer',
  transition: 'all 0.2s',
  boxShadow: selected ? `0 0 0 2px rgba(51, 196, 240, 0.29)` : 'none',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: '0 4px 12px rgba(8, 136, 255, 0.38)'
  }
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: '32px',
  minHeight: 0,
  '& .MuiTabs-flexContainer': {
    flexWrap: 'nowrap',
    [theme.breakpoints.down('740')]: {
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
    },
  },
  '& .MuiTab-root': {
    color: colors.gray,
    fontWeight: 700,
    fontSize: '1.1rem',
    textTransform: 'none',
    minWidth: 110,
    letterSpacing: '0.02em',
    fontFamily: 'Helvetica Neue, Arial, sans-serif',
    transition: 'color 0.15s',
    '&:hover': { color: '#2979ff' },
    '&.Mui-selected': { color: colors.primary },
    [theme.breakpoints.down('740')]: {
      flex: '1 1 33%', maxWidth: '33%',
      fontSize: '1.05rem', minWidth: 90, padding: 0
    },
    [theme.breakpoints.down('485')]: {
      fontSize: '0.95rem', minWidth: 74
    }
  },
  '& .MuiTabs-indicator': {
    backgroundColor: colors.primary,
    height: 3,
    borderRadius: '2px',
    transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
    [theme.breakpoints.down('740')]: {
      display: 'none', // ซ่อนเส้น indicator เดิม
    }
  }
}));

const StyledChip = styled(Chip)(() => ({
  mb: 2,
  bgcolor: "#fff",
  color: colors.primary,
  fontWeight: 600,
  marginBottom: 15,
  border: `1px solid ${colors.border}`,
}));

const StyledButton = styled(Button)(({ disabled }) => ({
  borderRadius: 6,
  height: 48,
  fontWeight: 700,
  fontSize: 18,
  letterSpacing: 0.5,
  boxShadow: 'none',
  backgroundColor: disabled ? colors.disabled : colors.primary,
  color: disabled ? '#bdbdbd' : '#fff',
  border: disabled ? `1.5px solid ${colors.disabled}` : `1.5px solid ${colors.primary}`,
  cursor: disabled ? 'not-allowed' : 'pointer',
  transition: 'all .15s cubic-bezier(.4,0,.2,1)',
  '&:hover': !disabled
    ? {
      backgroundColor: "#222",
      color: "#fff",
      border: `1.5px solid #000`,
      boxShadow: '0 8px 30px 0 rgba(0,0,0,0.12)',
    }
    : {},
}));

const PriceTypography = styled(Typography)(() => ({
  color: colors.primary,
  fontWeight: 700,
  fontSize: '1.15rem',
}));

const PriceOldTypography = styled(Typography)(() => ({
  textDecoration: 'line-through',
  color: colors.gray,
  marginLeft: 8,
  fontSize: '1rem'
}));

const categories = ['All', 'Promotion', 'Shirt', 'Pants', 'Shorts', 'Shoe'];

const Product = () => {
  const theme = useTheme();
  const is740down = useMediaQuery('(max-width:740px)');
  const is485down = useMediaQuery('(max-width:485px)');
  const is390down = useMediaQuery('(max-width:390px)');

  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [selectedVariants, setSelectedVariants] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const tabRefs = useRef([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, top: 0 });


  useEffect(() => {
    if (!is740down) return; // ทำเฉพาะมือถือ
    const el = tabRefs.current[tabIndex];
    if (el) {
      const parentRect = el.parentNode.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      setIndicator({
        left: rect.left - parentRect.left,
        width: rect.width,
        top: rect.top - parentRect.top + rect.height // ให้เส้นอยู่ใต้ตัวอักษร
      });
    }
    // อย่าลืมให้ re-calc เมื่อ resize
    const onResize = () => {
      const el = tabRefs.current[tabIndex];
      if (el) {
        const parentRect = el.parentNode.getBoundingClientRect();
        const rect = el.getBoundingClientRect();
        setIndicator({
          left: rect.left - parentRect.left,
          width: rect.width,
          top: rect.top - parentRect.top + rect.height
        });
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [tabIndex, is740down]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/products');
        const merged = Object.values(
          res.data.reduce((acc, item) => {
            const key = item.name;
            if (!acc[key]) {
              acc[key] = { ...item, variants: [item] };
            } else {
              acc[key].variants.push(item);
            }
            return acc;
          }, {})
        );
        setProducts(merged);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (category === 'Promotion') {
      filtered = products.filter(p => {
        const allVariants = p.variants || [p];
        return allVariants.some(variant => (variant.discount && variant.discount > 0));
      });
    } else if (category !== 'All') {
      filtered = products.filter(p => p.category === category);
    }

    if (search) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (sort === 'asc' || sort === 'desc') {
      filtered = [...filtered].sort((a, b) => {
        const getPrice = (prod) => {
          let v = prod.variants ? prod.variants[0] : prod;
          return v.price || v.originalPrice || 0;
        };
        return sort === 'asc'
          ? getPrice(a) - getPrice(b)
          : getPrice(b) - getPrice(a);
      });
    }
    setFilteredProducts(filtered);
  }, [category, products, search, sort]);

  const handleVariantSelect = (productName, variant) => {
    setSelectedVariants(prev => ({ ...prev, [productName]: variant }));
    let sizeKey = variant.clothing_sizes?.[0]?.size || variant.shoe_sizes?.[0]?.size || '';
    setSelectedSizes(prev => ({ ...prev, [productName]: sizeKey }));
  };

  const handleSizeChange = (productName, size) => {
    setSelectedSizes(prev => ({ ...prev, [productName]: size }));
  };

  const handleImageClick = (imgs, idx = 0) => {
    if (Array.isArray(imgs)) {
      setModalImages(imgs);
      setModalIndex(idx);
    } else {
      setModalImages([imgs]);
      setModalIndex(0);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalImages([]);
    setModalIndex(0);
  };

  const swiperRef = useRef(null);

  const handlePrev = (e) => {
    e.stopPropagation();
    const newIndex = (modalIndex - 1 + modalImages.length) % modalImages.length;
    setModalIndex(newIndex);
    swiperRef.current.swiper.slideTo(newIndex);
  };
  const handleNext = (e) => {
    e.stopPropagation();
    const newIndex = (modalIndex + 1) % modalImages.length;
    setModalIndex(newIndex);
    swiperRef.current.swiper.slideTo(newIndex);
  };

  const handleAddToCart = (product, variant, size) => {
    const img = Array.isArray(variant.img) ? variant.img[0] : variant.img || product.img;
    dispatch(
      addToCart({
        id: variant.id || product.id,
        name: variant.name || product.name,
        img: img,
        price: variant.price || variant.originalPrice || 0,
        color: variant['text-color'] || '',
        size: size || '',
        stock: variant.stock || 0,
        quantity: 1
      })
    );
  };

  return (
    <Box id="Products">
      <BackgroundContainer>
        <Container maxWidth="xl">
          <SectionTitle>Product Catalog</SectionTitle>
          <SectionSubTitle>High-quality products from the Adidas.</SectionSubTitle>
          <Divider sx={{ mb: 5, borderColor: colors.border }} />

          {/* Tabs responsive */}
          <Box sx={{ position: 'relative', width: '100%' }}>
            <StyledTabs
              value={tabIndex}
              onChange={(e, newIndex) => {
                setTabIndex(newIndex);
                setCategory(categories[newIndex]);
              }}
              centered={!is740down}
            >
              {categories.map((cat, i) => (
                <Tab
                  key={cat}
                  label={cat}
                  value={i}
                  ref={el => (tabRefs.current[i] = el)}
                />
              ))}
            </StyledTabs>
            {/* เส้น line ใต้ tab ที่เลือก (custom) */}
            {is740down && (
              <Box
                sx={{
                  position: 'absolute',
                  left: indicator.left,
                  top: indicator.top,
                  width: indicator.width,
                  height: 3,
                  bgcolor: colors.primary,
                  borderRadius: '2px',
                  transition: 'all 0.25s cubic-bezier(.4,0,.2,1)',
                  pointerEvents: 'none'
                }}
              />
            )}
          </Box>

          {/* Responsive filter/search */}
          <Box
            display="flex"
            flexDirection={is390down ? 'column' : 'row'}
            justifyContent="center"
            alignItems="center"
            gap={2}
            mb={5}
          >
            <TextField
              variant="outlined"
              placeholder="ค้นหาสินค้า..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: colors.gray }} />
              }}
              sx={{
                width: { xs: '100%', sm: 340, md: 420 },
                backgroundColor: colors.background,
                borderRadius: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: colors.background,
                  borderRadius: 3,
                  '& fieldset': { borderColor: colors.border },
                  '&:hover fieldset': { borderColor: colors.primary },
                  '&.Mui-focused fieldset': { borderColor: colors.primary }
                }
              }}
            />
            <FormControl sx={{ minWidth: 170, width: is390down ? '100%' : undefined }}>
              <Select
                value={sort}
                displayEmpty
                onChange={e => setSort(e.target.value)}
                renderValue={selected => {
                  if (!selected) return <span style={{ color: colors.gray }}>เรียงตามราคา</span>;
                  return selected === 'asc' ? 'ราคาต่ำ → สูง' : 'ราคาสูง → ต่ำ';
                }}
                sx={{
                  backgroundColor: colors.background,
                  color: colors.primary,
                  borderRadius: 3,
                  height: 57,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.border },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary },
                  '& .MuiSvgIcon-root': { color: colors.primary }
                }}
              >
                <MenuItem value="">ไม่เรียง</MenuItem>
                <MenuItem value="asc">ราคาต่ำ → สูง</MenuItem>
                <MenuItem value="desc">ราคาสูง → ต่ำ</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height={400}>
              <CircularProgress size={60} sx={{ color: colors.primary }} />
            </Box>
          ) : (
            <Grid
              container
              spacing={4}
              justifyContent="center"
              alignItems="stretch"
              sx={{ alignItems: 'stretch', flexWrap: 'wrap' }}
            >
              {filteredProducts.map((product) => {
                const activeVariant = selectedVariants[product.name] || product;
                const allSizes = activeVariant.clothing_sizes || activeVariant.shoe_sizes || [];
                const currentSize =
                  selectedSizes[product.name] ||
                  (allSizes.length > 0 ? allSizes[0].size : '');
                const getCurrentStock = () => {
                  const sz = allSizes.find(s => s.size === currentSize);
                  return sz ? sz.qty : activeVariant.stock || 0;
                };
                return (
                  <Grid
                    key={product.id || product.name}
                    sx={{
                      display: 'flex',
                      width: { xs: '100%', sm: '50%', md: '33.3333%', lg: '25%' },
                      maxWidth: { xs: '100%', sm: '50%', md: '33.3333%', lg: '25%' },
                      flex: '0 0 auto',
                    }}
                  >
                    <StyledCard>
                      {activeVariant.discount > 0 && (
                        <SaleBadge>
                          SALE <span>-{activeVariant.discount}%</span>
                        </SaleBadge>
                      )}
                      <ImageContainer onClick={() => handleImageClick(activeVariant.img)}>
                        <CardMedia
                          component="img"
                          image={Array.isArray(activeVariant.img) ? activeVariant.img[0] : activeVariant.img}
                          alt={activeVariant.name}
                          sx={{
                            width: '100%',
                            height: '100%',
                            minHeight: 180,
                            maxHeight: 280,
                            objectFit: 'contain',
                            objectPosition: 'center',
                            backgroundColor: "#ebeeef"
                          }}
                        />
                        <ZoomOverlay className="zoom-overlay">
                          <ZoomInIcon sx={{ color: '#fff', fontSize: 40 }} />
                        </ZoomOverlay>
                      </ImageContainer>
                      <CardContent sx={{
                        flex: '1 1 auto',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px'
                      }}>
                        {/* UI Name Product */}
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            component={RouterLink}
                            to={`/product/${activeVariant.id || product.id}`}
                            sx={{
                              mb: 1,
                              color: colors.primary,
                              minHeight: '56px',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              fontSize: is485down ? '0.95rem' : '1rem',
                              wordBreak: 'break-word',
                              maxWidth: '240px',
                              whiteSpace: 'normal',
                              textDecoration: 'none',
                              transition: 'color 0.2s',
                              cursor: 'pointer',
                              '&:hover': { color: '#2b7fff' },
                            }}
                          >
                            {activeVariant.name}
                          </Typography>
                          <StyledChip
                            label={activeVariant['text-color'] || activeVariant.color}
                            size="small"
                          />
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <PriceTypography>
                              ฿{(activeVariant.price || activeVariant.originalPrice || 0).toLocaleString()}
                            </PriceTypography>
                            {activeVariant.discount > 0 && (
                              <PriceOldTypography>
                                ฿{activeVariant.originalPrice?.toLocaleString()}
                              </PriceOldTypography>
                            )}
                          </Box>
                          {allSizes.length > 0 && (
                            <Box mb={2}>
                              <FormControl size="small" sx={{ minWidth: 100, background: "#f6f8fa", borderRadius: 2 }}>
                                <InputLabel id={`size-label-${product.name}`}>Size</InputLabel>
                                <Select
                                  labelId={`size-label-${product.name}`}
                                  value={currentSize}
                                  label="Size"
                                  onChange={e => handleSizeChange(product.name, e.target.value)}
                                  sx={{ fontWeight: 700 }}
                                >
                                  {allSizes.map((s, idx) => (
                                    <MenuItem value={s.size} key={idx}>{s.size}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Box>
                          )}
                          <Typography
                            variant="body2"
                            sx={{
                              mb: 2,
                              color: getCurrentStock() <= 0 ? '#f44336' : (getCurrentStock() > 5 ? '#2b7fff' : '#fbc02d'),
                              fontWeight: 700
                            }}
                          >
                            เหลือ {getCurrentStock()} ชิ้น {currentSize && `(${currentSize})`}
                          </Typography>
                          <StyledButton
                            fullWidth
                            disabled={getCurrentStock() <= 0}
                            startIcon={getCurrentStock() <= 0 ? <BlockIcon /> : <ShoppingCartIcon />}
                            onClick={() => handleAddToCart(product, activeVariant, currentSize)}
                          >
                            {getCurrentStock() <= 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                          </StyledButton>
                          <Typography
                            variant="caption"
                            sx={{
                              color: colors.gray,
                              fontWeight: 600,
                              mb: 1,
                              pt: 2,
                              display: 'block'
                            }}
                          >
                            สีที่มีจำหน่าย
                          </Typography>
                          <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                            {product.variants?.map((variant, i) => (
                              <ColorDot
                                key={i}
                                colors={Array.isArray(variant.color) ? variant.color : [variant.color]}
                                selected={selectedVariants[product.name]?.color === variant.color ||
                                  (!selectedVariants[product.name] && product.variants[0].color === variant.color)}
                                onClick={() => handleVariantSelect(product.name, variant)}
                              />
                            ))}
                          </Box>
                        </Box>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>

        {/* Image Modal */}
        <StyledModal
          open={modalOpen}
          onClose={handleCloseModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
            sx: { backgroundColor: 'rgba(0,0,0,0.8)' }
          }}
        >
          <Fade in={modalOpen}>
            <ModalContent>
              <CloseButton onClick={handleCloseModal}>
                <CloseIcon />
              </CloseButton>
              {modalImages.length > 1 && (
                <>
                  <IconButton
                    sx={{
                      position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 2,
                      background: colors.primary, color: '#fff'
                    }}
                    onClick={handlePrev}
                    disabled={modalImages.length <= 1}
                  >
                    <ChevronLeftIcon fontSize="large" />
                  </IconButton>
                  <IconButton
                    sx={{
                      position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 2,
                      background: colors.primary, color: '#fff'
                    }}
                    onClick={handleNext}
                    disabled={modalImages.length <= 1}
                  >
                    <ChevronRightIcon fontSize="large" />
                  </IconButton>
                </>
              )}
              <Swiper
                slidesPerView={1}
                initialSlide={modalIndex}
                onSlideChange={swiper => setModalIndex(swiper.activeIndex)}
                style={{ width: '100%', maxWidth: 668 }}
                ref={swiperRef}
              >
                {modalImages.map((img, i) => (
                  <SwiperSlide key={i}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      sx={{ width: '100%', height: '70vh', background: "#fafafa" }}
                    >
                      <ModalImage src={img} alt={`Product Image ${i + 1}`} />
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>
            </ModalContent>
          </Fade>
        </StyledModal>
      </BackgroundContainer>
    </Box>
  );
};

export default Product;
