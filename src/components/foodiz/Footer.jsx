const Footer = () => {
  return (
    <footer>
      <div className="middle">
        <div className="mcard">
          <div className="mcard-img">
            <img
              src="https://cdn.doordash.com/media/consumer/home/landing/new/ScootScoot.svg"
              alt=""
            />
          </div>
          <div className="mcardtext">
            <h4 className="cardh4">Fastest Delivery</h4>
            <p className="mcardp">
              Experience FOODIZ HUB's <br />
              fastest delivery for fresh food
            </p>
          </div>
        </div>
        <div className="mcard">
          <div className="mcard-img">
            <img
              src="https://cdn.doordash.com/media/consumer/home/landing/new/Storefront.svg"
              alt=""
            />
          </div>
          <div className="mcardtext">
            <h4 className="cardh4">Become partner</h4>
            <p className="mcardp">
              Grow your business and reach
              <br />
              new customers by partnering with us
            </p>
          </div>
        </div>
        <div className="mcard">
          <div className="mcard-img">
            <img
              src="https://cdn.doordash.com/media/consumer/home/landing/new/iphone.svg"
              alt=""
            />
          </div>
          <div className="mcardtext">
            <h4 className="cardh4">Try Our App</h4>
            <p className="mcardp">
              Download Our app, all in one app
              <br />
              made to ease the customers
            </p>
          </div>
        </div>
      </div>
      <div className="endcontainer">
        <div className="endimg">
          <img
            src="https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_768,h_978/iPhone_wgconp_j0d1fn"
            alt=""
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
