import React from 'react';
import { Box, Typography, Button, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const VIDEO_DESKTOP = 'https://brand.assets.adidas.com/video/upload/f_auto:video,q_auto/if_w_gt_1920,w_1920/global_adizero_running_ss25_sustain_evo_sl_hp_banner_hero_1_d_b197aec60d.mp4';
const VIDEO_MOBILE = 'https://brand.assets.adidas.com/video/upload/f_auto:video,q_auto/if_w_gt_768,w_768/global_adizero_running_ss25_sustain_evo_sl_hp_banner_hero_1_m_40d3c658a7.mp4';

// HeroSection: จัดความสูงแบบ responsive ด้วย aspect-ratio
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#000',
  // Desktop
  minHeight: '80vh',
  // Tablet
  [theme.breakpoints.down('md')]: {
    minHeight: '88vw',           // จะให้วีดีโอกินความสูงประมาณ 48% ของความกว้าง (16:7.5)
    aspectRatio: '16 / 7.5',     // ถ้า browser รองรับ aspect-ratio
  },
  // Mobile (≤480)
  [theme.breakpoints.down('sm')]: {
    minHeight: '120vw',           // ใกล้เคียงอัตราส่วนวีดีโอ mobile (จะบีบเตี้ยขึ้น)
    aspectRatio: '16 / 8.8',     // หรือปรับตามความต้องการ
  },
}));

const VideoBG = styled('video')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 0,
  pointerEvents: 'none',
  background: '#000'
}));

const Overlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(90deg,rgba(0,0,0,0.24) 0%,rgba(0,0,0,0.08) 100%)',
  zIndex: 1,
});

const HeroText = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 'auto',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 2,
  maxWidth: 520,
  marginLeft: theme.spacing(8),
  textAlign: 'left',
  [theme.breakpoints.down('md')]: {
    marginLeft: theme.spacing(4),
    maxWidth: 370,
    // ไม่ต้องใส่ margin: '0 auto'
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: theme.spacing(2),
    maxWidth: 280,
    padding: theme.spacing(0.5),
  },
}));

// Function Scoll
const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    const y = el.getBoundingClientRect().top + window.pageYOffset - 100; // เผื่อ offset Navbar
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

export default function Hero() {
  const theme = useTheme();
  const isMobileVideo = useMediaQuery('(max-width:480px)');
  // const hideText = useMediaQuery('(max-width:899px)');

  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) {
        setTimeout(() => {
          const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }, 150);
      }
    }
  }, [location]);

  return (
    <Box id="Home">
      <HeroSection>
        <VideoBG autoPlay loop muted playsInline>
          <source src={isMobileVideo ? VIDEO_MOBILE : VIDEO_DESKTOP} type="video/mp4" />
          Your browser does not support the video tag.
        </VideoBG>
        <Overlay />
        {/* ซ่อน Text เมื่อจอ < 900px */}
        {/* {!hideText && ( */}
        <HeroText>
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700,
              color: '#fff',
              mb: 2,
              fontSize: { xs: '1.6rem', sm: '2.1rem', md: '2.7rem', lg: '3.2rem' },
              lineHeight: 1.14
            }}
          >
            Feel your <br />
            <Box component="span" fontWeight="bold">
              Inner style
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#fff',
              fontSize: { xs: '0.9rem', sm: '1.02rem', md: '1.08rem' },
              fontFamily: 'Poppins, sans-serif',
              mb: 3,
              lineHeight: 1.4,
              maxWidth: 500,
            }}
          >
            This website is for assessment purposes only and was developed as part of a job application process. All content and information presented are intended exclusively for evaluation and demonstration.
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#fff',
              color: '#222',
              borderRadius: '999px',
              px: { xs: 3, sm: 4 },
              py: { xs: 1, sm: 1.5 },
              fontWeight: 'bold',
              fontSize: { xs: '0.98rem', sm: '1.08rem', md: '1.12rem' },
              boxShadow: 3,
              mt: 1,
              '&:hover': {
                backgroundColor: '#ececec',
                color: '#000',
              },
            }}
            onClick={() => scrollToSection('Products')}
          >
            SHOP NOW
          </Button>
        </HeroText>
        {/* )} */}
      </HeroSection>
    </Box>
  );
}
