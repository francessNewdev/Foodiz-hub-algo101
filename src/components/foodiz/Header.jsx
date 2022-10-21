import PropTypes from "prop-types";
import Wallet from "../Wallet";
import { Nav } from "react-bootstrap";
import AddMeal from "./AddMeal";

const Header = ({ address, name, balance, disconnect, addMeal }) => {
  return (
    <>
      <header>
        <Nav className="navbar nav-fill">
          <Nav.Item>
            <div id="navFoodiz">
              <img src="https://i.postimg.cc/pdszfckC/logo1.png" alt="" />
              <p>FOODIZ HUB</p>
            </div>
          </Nav.Item>

          <Nav.Item style={{ display: "flex", justifyContent: "center" }}>
            <Wallet
              address={address}
              name={name}
              amount={balance}
              disconnect={disconnect}
              symbol={"ALGO"}
            />
          </Nav.Item>
        </Nav>
      </header>
      <div id="intro" style={{ height: "500px" }}>
        <div className="basic-intro">Restaurants and more,</div>
        <div className="basic-intro">delivered to your door steps</div>
        <div id="basic-intro1">Order Now from your favorite restaurants</div>
        <div className="mb-4" style={{ marginTop: "4em" }}>
          <AddMeal addMeal={addMeal} />
        </div>
        <div className="about">
          <h1>About Us</h1>
          <p>
            For us, it's not just about bringing you good food from your
            favourite restaurants. It's about making connections with the
            people, which is why we sit down with the chefs, dreaming up menus
            that will arrive fresh and full of flavour. Try us!
          </p>
        </div>
      </div>
      <div className="introcard">
        <div className="icard">
          <div className="icard-img">
            <img src="https://i.postimg.cc/CxHj1xqW/icard1.jpg" alt="" />
          </div>
          <div className="icardtext">Making Memories</div>
        </div>
        <div className="icard">
          <div className="icard-img">
            <img src="https://i.postimg.cc/HnyMCYmv/icard2.jpg" alt="" />
          </div>

          <div className="icardtext">Club At home</div>
        </div>
        <div className="icard">
          <div className="icard-img">
            <img src="https://i.postimg.cc/qBzGqH0j/icard3.jpg" alt="" />
          </div>
          <div className="icardtext">FOODIZ's Best</div>
        </div>
        <div className="icard">
          <div className="icard-img">
            <img
              src="https://www.mommytravels.net/wp-content/uploads/2018/11/Cafe-Hollywood.png"
              alt=""
            />
          </div>
          <div className="icardtext">Desert Lovers</div>
        </div>
      </div>
    </>
  );
};

Header.propTypes = {
  address: PropTypes.string.isRequired,
  name: PropTypes.string,
  balance: PropTypes.number.isRequired,
  disconnect: PropTypes.func.isRequired,
  addMeal: PropTypes.func.isRequired,
};

export default Header;
