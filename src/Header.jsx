import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div className="Header">
      <Link to="/threads" className="header-bg-link" />
    </div>
  );
};
