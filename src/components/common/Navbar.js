import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 2rem;
  z-index: 1000;
  background-color: transparent;
  color: white;
`;

const MenuIcon = styled.div`
  cursor: pointer;
  z-index: 1001;
  width: 30px;
  height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  span {
    display: block;
    height: 2px;
    width: 100%;
    background: white;
    transition: all 0.3s ease-in-out;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  text-align: center;
`;

const NavItem = styled(motion.li)`
  margin: 1.5rem 0;
  a, button {
    font-size: 2rem;
    color: white;
    text-decoration: none;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    background: none;
    border: none;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const listVariants = {
  hidden: { transition: { staggerChildren: 0.1, staggerDirection: -1 } },
  visible: { transition: { staggerChildren: 0.1, staggerDirection: 1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 }
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <>
      <NavContainer>
        <MenuIcon onClick={() => setIsOpen(!isOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </MenuIcon>
      </NavContainer>
      <AnimatePresence>
        {isOpen && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <NavList
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              <NavItem variants={itemVariants} onClick={() => setIsOpen(false)}>
                <Link to="/collections">Collections</Link>
              </NavItem>
              {user?.isAdmin && (
                <NavItem variants={itemVariants} onClick={() => setIsOpen(false)}>
                  <Link to="/admin">Admin</Link>
                </NavItem>
              )}
              {user ? (
                <>
                  <NavItem variants={itemVariants} onClick={() => setIsOpen(false)}>
                    <Link to="/profile">User Profile</Link>
                  </NavItem>
                  <NavItem variants={itemVariants}>
                    <button onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </NavItem>
                </>
              ) : (
                <NavItem variants={itemVariants} onClick={() => setIsOpen(false)}>
                  <Link to="/auth">
                    <FaSignInAlt /> Login / Register
                  </Link>
                </NavItem>
              )}
              <NavItem variants={itemVariants} onClick={() => setIsOpen(false)}>
                <Link to="/about">About</Link>
              </NavItem>
            </NavList>
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
