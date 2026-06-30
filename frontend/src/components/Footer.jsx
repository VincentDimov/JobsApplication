import React from "react";

const Footer = () => (
  <footer className="footer">
    <div className="footer-links">
      <a href="#!">Om JobApp</a>
      <a href="#!">Kontakt</a>
      <a href="#!">Sekretess</a>
      <a href="#!">Cookies</a>
    </div>
    <p>© {new Date().getFullYear()} JobApp</p>
  </footer>
);

export default Footer;
