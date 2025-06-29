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
import LogoAdidas from './LogoAdidas';
import { useLocation, useNavigate } from 'react-router-dom';


const adidasBlue = "#1c53e6";
const MenuText = styled(Typography, { shouldForwardProp: (prop) => prop !== 'active' && prop !== 'darkMode' })(
  ({ active, darkMode }) => ({
    color: active
      ? "#1c53e6"
      : darkMode
        ? '#fff'
        : '#1a1a1a',
    fontWeight: active ? 700 : 500,
    cursor: 'pointer',
    transition: 'color 0.18s, border 0.18s, background 0.18s',
    borderBottom: active ? `2.5px solid #1c53e6` : '2.5px solid transparent',
    borderRadius: 2,
    padding: '7px 16px',
    fontSize: 18,
    '&:hover': {
      color: "#1c53e6",
      borderBottom: `2.5px solid #1c53e6`,
    },
  })
);

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'darkMode'
})(({ theme, darkMode }) => ({
  backgroundColor: darkMode ? '#111' : '#fff',  // สีพื้นหลัง
  color: darkMode ? '#fff' : '#1a1a1a',        // สีตัวอักษร
  borderBottom: darkMode ? '1.5px solid #222' : '1.5px solid #e3e6ea',
  boxShadow: '0 2px 10px 0 rgba(44,44,44,0.04)',
  position: 'sticky', top: 0,
  zIndex: theme.zIndex.drawer + 1,
}));

const Navbar = ({ darkMode }) => {
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
      <StyledAppBar elevation={0} darkMode={darkMode}>
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
            <LogoAdidas
              width={90}
              height={60}
              style={{
                color: darkMode ? '#fff' : '#111',
                transition: 'color 0.3s'
              }}
            />
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
                  darkMode={darkMode}
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
                color: darkMode ? '#fff' : '#111',
                border: darkMode ? '1.5px solid #333' : '1.5px solid #ececec',
                bgcolor: darkMode ? '#181818' : '#f8f8f8',
                '&:hover': { bgcolor: darkMode ? '#232323' : '#e3e3e3' }
              }}
              onClick={() => setCartDrawerOpen(true)} // <-- เพิ่มตรงนี้
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
        <Box
          sx={{
            width: 240,
            backgroundColor: darkMode ? '#181A1B' : '#fff',      // <-- เปลี่ยนตาม darkMode
            height: '100%',
            borderLeft: darkMode ? '1.5px solid #333' : '1.5px solid #e3e6ea', // <-- ขอบ
            pt: 15,
            transition: 'background 0.3s',
          }}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem
                component="button"
                key={item.id}
                selected={activeSection === item.id}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  border: 'none',
                  boxShadow: 'none',
                  outline: 'none',
                  background: activeSection === item.id
                    ? (darkMode ? 'rgba(28,83,230,0.15)' : 'rgba(28,83,230,0.07)')
                    : 'transparent',
                  '&:hover': {
                    background: darkMode
                      ? 'rgba(28,83,230,0.20)'
                      : 'rgba(28,83,230,0.10)',
                  },
                  transition: 'background 0.2s',
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
                      color: activeSection === item.id
                        ? adidasBlue
                        : (darkMode ? '#fff' : '#222'),
                      fontWeight: activeSection === item.id ? 700 : 500,
                      letterSpacing: 0.2,
                      transition: 'color 0.2s',
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
