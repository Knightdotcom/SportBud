import { NavLink as RouterNavLink } from 'react-router'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import styles from './Header.module.css'
import { useAuth } from '../../context/AuthProvider'

// Sidhuvudets navigeringskomponent – visar logotyp, hemknapp samt inloggnings- eller utloggningsalternativ beroende på inloggningsstatus
function Header() {
  const { isLoggedIn, logout } = useAuth()

  return (
    <header className={styles.header}>
      <Navbar expand="md" className={styles.navbar}>
        <Container fluid>
          <Navbar.Brand as={RouterNavLink} to="/" className={styles.brand}>
            <span className={styles.brandIcon}>🏆</span>
            <span className={styles.brandName}>SportBud</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-nav" className={styles.toggler} />

          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto">
              <Nav.Link as={RouterNavLink} to="/" end className={styles.navLink}>
                Hem
              </Nav.Link>
            </Nav>

            <Nav>
              <Nav.Link
                as={RouterNavLink}
                to={isLoggedIn ? '/mypage' : '/register'}
                className={styles.navLink}
              >
                {isLoggedIn ? 'Min sida' : 'Registrera'}
              </Nav.Link>

              {isLoggedIn ? (
                <button className={styles.logoutBtn} onClick={logout}>
                  Logga ut
                </button>
              ) : (
                <Nav.Link as={RouterNavLink} to="/login" className={styles.loginBtn}>
                  Logga in
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
