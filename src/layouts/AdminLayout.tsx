import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { FaTachometerAlt,  FaCog, FaSignOutAlt } from "react-icons/fa";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="d-flex">
      <div className={`bg-dark text-white p-3 ${collapsed ? "d-none" : "d-block"}`} style={{ width: "250px", height: "100vh" }}>
        <h4 className="text-center">Admin</h4>
        <Nav className="flex-column">
          <Nav.Link as={Link} to="/admin/dashboard" className="text-white">
            <FaTachometerAlt /> Dashboard
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/food-list" className="text-white">
            🍽 Food List
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/settings" className="text-white">
            <FaCog /> Settings
          </Nav.Link>
          <Nav.Link className="text-white">
            <FaSignOutAlt /> Logout
          </Nav.Link>
        </Nav>
      </div>
      <div className="flex-grow-1">
        <Navbar bg="light" className="p-3">
          <Button variant="outline-dark" onClick={() => setCollapsed(!collapsed)}>
            ☰
          </Button>
          <Navbar.Brand className="ms-3">Admin Panel</Navbar.Brand>
        </Navbar>
        <Container className="mt-3">
          <Outlet /> {/* Quan trọng: Outlet sẽ render các trang con */}
        </Container>
      </div>
    </div>
  );
};

export default AdminLayout;
