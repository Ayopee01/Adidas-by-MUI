import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Badge, IconButton, Box, Drawer,
  List, ListItem, ListItemText, useMediaQuery
} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from 'react-redux';
import CartDrawer from './CartDrawer';
import LogoAdidas from '../assets/Logo_Adidas.png';
import { useLocation, useNavigate } from 'react-router-dom';

const adidasBlue = "#1c53e6";
const MenuText = styled(Typography, { shouldForwardProp: (prop) => prop !== 'active' })(({ active }) => ({
  color: active ? adidasBlue : '#1a1a1a',
  fontWeight: active ? 700 : 500,
  cursor: 'pointer',
  transition: 'color 0.18s, border 0.18s, background 0.18s',
  borderBottom: active ? `2.5px solid ${adidasBlue}` : '2.5px solid transparent',
  borderRadius: 2,
  padding: '7px 16px',
  fontSize: 18,
  '&:hover': { color: adidasBlue, borderBottom: `2.5px solid ${adidasBlue}` },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#fff',
  borderBottom: '1.5px solid #e3e6ea',
  boxShadow: '0 2px 10px 0 rgba(44,44,44,0.04)',
  position: 'sticky', top: 0,
  zIndex: theme.zIndex.drawer + 1,
}));

const Navbar = () => {
  const cart = useSelector((state) => state.cart.cart);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Home', id: 'Home' },
    { label: 'Products', id: 'Products' },
    { label: 'Contact', id: 'Contact' }
  ];
  const [activeSection, setActiveSection] = useState(menuItems[0].id);

  // สำหรับ scroll section เฉพาะหน้า Home เท่านั้น
  const handleMenuClick = (section) => {
    if (location.pathname === '/') {
      const el = document.getElementById(section);
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollTo: section } });
    }
  };

  // Logo click กลับ Home และเลื่อนขึ้นบนสุด
  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('Home');
    } else {
      navigate('/', { state: { scrollTo: 'Home' } });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      let current = menuItems[0].id;
      for (let item of menuItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const offset = 105;
          const top = el.getBoundingClientRect().top - offset;
          if (top <= 0) current = item.id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuItems]);

  return (
    <>
      <StyledAppBar elevation={0}>
        <Toolbar
          sx={{
            justifyContent: 'center',
            minHeight: { xs: 100, sm: 100 },
            px: { xs: 2, sm: 7 },
            position: 'relative'
          }}
        >
          {/* Hamburger - mobile only */}
          {isMobile && (
            <IconButton
              sx={{
                position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                color: '#111', border: '1.5px solid #ececec',
                mx: { xs: 2, sm: 7 }, borderRadius: 2, bgcolor: '#f8f8f8',
                '&:hover': { bgcolor: '#e3e3e3' }
              }}
              onClick={() => {
                setCartDrawerOpen(false); // ปิด Cart ถ้ามี
                setDrawerOpen(true);      // แล้วเปิด Hamburger
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          {/* Logo (click กลับ Home) */}
          <Box
            component="a"
            href="/"
            sx={{
              flex: { xs: 0, md: '0 0 200px' },
              display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' },
              pointerEvents: 'auto', textDecoration: 'none', mr: { xs: 0, md: 4 },
              cursor: 'pointer'
            }}
            onClick={handleLogoClick}
          >
            <img src={LogoAdidas} alt="Logo Adidas" style={{ height: 45, width: 'auto' }} />
          </Box>
          {/* Desktop Menu */}
          {!isMobile && (
            <Box sx={{
              display: 'flex', gap: 2, flex: 1, justifyContent: 'center', alignItems: 'center', minWidth: 0
            }}>
              {menuItems.map((item) => (
                <MenuText
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  active={activeSection === item.id ? 1 : 0}
                >
                  {item.label}
                </MenuText>
              ))}
            </Box>
          )}
          {/* Cart Icon */}
          <Box
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
              flex: { xs: 0, md: '0 0 140px' }, minWidth: { xs: 0, md: 'auto' },
              position: isMobile ? 'absolute' : 'static', right: isMobile ? 8 : 'auto',
              top: isMobile ? '50%' : 'auto', transform: isMobile ? 'translateY(-50%)' : 'none',
              mx: { xs: 2, sm: 7 },
            }}
          >
            <IconButton
              sx={{
                color: '#111', ml: 1, border: '1.5px solid #ececec', borderRadius: 2,
                bgcolor: '#f8f8f8', '&:hover': { bgcolor: '#e3e3e3' }
              }}
              onClick={() => {
                setDrawerOpen(false);      // ปิด Hamburger ถ้ามี
                setCartDrawerOpen(true);   // แล้วเปิด Cart
              }}
            >
              <Badge badgeContent={cartItemCount} color="error" showZero>
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </StyledAppBar>
      {/* Drawer (Mobile Menu) */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{
          width: 240, backgroundColor: '#fff', height: '100%',
          borderLeft: '1.5px solid #e3e6ea', pt: 15
        }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.id}
                selected={activeSection === item.id}
                sx={{
                  borderRadius: 2, mb: 1,
                  background: activeSection === item.id ? 'rgba(28,83,230,0.07)' : 'transparent',
                }}
                onClick={() => {
                  setDrawerOpen(false);
                  setTimeout(() => handleMenuClick(item.id), 200);
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: {
                      color: activeSection === item.id ? adidasBlue : '#222',
                      fontWeight: activeSection === item.id ? 700 : 500,
                      letterSpacing: 0.2
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <CartDrawer open={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </>
  );
};

export default Navbar;
