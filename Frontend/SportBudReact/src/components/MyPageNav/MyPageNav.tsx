import { NavLink } from 'react-router'
import { useAuth } from '../../context/AuthProvider'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import styles from './MyPageNav.module.css'

// Navigeringsmeny för "Mina sidor" – visar länkar till annonser, bud, skapa annons och inställningar, samt adminlänkar för administratörer
function MyPageNav() {
  const { user } = useAuth()
  const isAdmin = user?.roles?.includes('Admin') ?? false

  return (
    <Navbar bg="dark" variant="dark" className={`mb-4 ${styles.navbar}`}>
      <Container fluid>
        <Navbar.Brand className={styles.brand}>Mina sidor</Navbar.Brand>
        <Nav className="ms-auto">
          <NavDropdown align="end" title="Meny" id="mypg-dropdown" className={styles.dropdown}>
            <NavDropdown.Header>Mina sidor</NavDropdown.Header>
            <NavDropdown.Item as={NavLink} to="/mypage/auctions">Mina annonser</NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="/mypage/bids">Mina bud</NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="/mypage/create">Skapa annons</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Header>Inställningar</NavDropdown.Header>
            <NavDropdown.Item as={NavLink} to="/mypage/update-password">Byt lösenord</NavDropdown.Item>
            {isAdmin && (
              <>
                <NavDropdown.Divider />
                <NavDropdown.Header>Admin</NavDropdown.Header>
                <NavDropdown.Item as={NavLink} to="/mypage/admin/users">Användare</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/mypage/admin/auctions">Annonser</NavDropdown.Item>
              </>
            )}
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  )
}

export default MyPageNav
