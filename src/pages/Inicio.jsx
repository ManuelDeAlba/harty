function Inicio(){
    
    return(
        <div>
        <div className="search-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <span className="close-btn"><i className="fas fa-window-close"></i></span>
                        <div className="search-bar">
                            <div className="search-bar-tablecell">
                                <h3>Search For:</h3>
                                <input type="text" placeholder="Keywords"/>
                                <button type="submit">Search <i className="fas fa-search"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="hero-area hero-bg">
            <div className="container">
                <div className="row">
                    <div className="col-lg-9 offset-lg-2 text-center">
                        <div className="hero-text">
                            <div className="hero-text-tablecell">
                                <div className="subtitle"><p>Fresh & Organic</p></div>
                                <h1>Delicious Seasonal Fruits</h1>
                                <div className="hero-btns">
                                    <a href="shop.html" className="boxed-btn">Fruit Collection</a>
                                    <a href="contact.html" className="bordered-btn">Contact Us</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
	
        <div className="list-section pt-80 pb-80">
            <div className="container">

                <div className="row">
                    <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                        <div className="list-box d-flex align-items-center">
                            <div className="list-icon">
                                <i className="fas fa-shipping-fast"></i>
                            </div>
                            <div className="content">
                                <h3>Free Shipping</h3>
                                <p>When order over $75</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                        <div className="list-box d-flex align-items-center">
                            <div className="list-icon">
                                <i className="fas fa-phone-volume"></i>
                            </div>
                            <div className="content">
                                <h3>24/7 Support</h3>
                                <p>Get support all day</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="list-box d-flex justify-content-start align-items-center">
                            <div className="list-icon">
                                <i className="fas fa-sync"></i>
                            </div>
                            <div className="content">
                                <h3>Refund</h3>
                                <p>Get refund within 3 days!</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
	
        <div className="product-section mt-150 mb-150">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 offset-lg-2 text-center">
                        <div className="section-title">	
                            <h3><span className="orange-text">Our</span> Products</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, fuga quas itaque eveniet beatae optio.</p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-4 col-md-6 text-center">
                        <div className="single-product-item">
                            <div className="product-image">
                                <a href="single-product.html"><img src="assets/img/products/product-img-1.jpg" alt=""/></a>
                            </div>
                            <h3>Strawberry</h3>
                            <p className="product-price"><span>Per Kg</span> 85$ </p>
                            <a href="cart.html" className="cart-btn"><i className="fas fa-shopping-cart"></i> Add to Cart</a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 text-center">
                        <div className="single-product-item">
                            <div className="product-image">
                                <a href="single-product.html"><img src="assets/img/products/product-img-2.jpg" alt=""/></a>
                            </div>
                            <h3>Berry</h3>
                            <p className="product-price"><span>Per Kg</span> 70$ </p>
                            <a href="cart.html" className="cart-btn"><i className="fas fa-shopping-cart"></i> Add to Cart</a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 offset-md-3 offset-lg-0 text-center">
                        <div className="single-product-item">
                            <div className="product-image">
                                <a href="single-product.html"><img src="assets/img/products/product-img-3.jpg" alt=""/></a>
                            </div>
                            <h3>Lemon</h3>
                            <p className="product-price"><span>Per Kg</span> 35$ </p>
                            <a href="cart.html" className="cart-btn"><i className="fas fa-shopping-cart"></i> Add to Cart</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
	
        <section className="cart-banner pt-100 pb-100">
            <div className="container">
                <div className="row clearfix">
                    <div className="image-column col-lg-6">
                        <div className="image">
                            <div className="price-box">
                                <div className="inner-price">
                                    <span className="price">
                                        <strong>30%</strong> <br/> off per kg
                                    </span>
                                </div>
                            </div>
                            <img src="assets/img/a.jpg" alt=""/>
                        </div>
                    </div>
                    <div className="content-column col-lg-6">
                        <h3><span className="orange-text">Deal</span> of the month</h3>
                        <h4>Hikan Strwaberry</h4>
                        <div className="text">Quisquam minus maiores repudiandae nobis, minima saepe id, fugit ullam similique! Beatae, minima quisquam molestias facere ea. Perspiciatis unde omnis iste natus error sit voluptatem accusant</div>
			    {/*Countdown Timer*/}
                        <div className="time-counter"><div className="time-countdown clearfix" data-countdown="2020/2/01"><div className="counter-column"><div className="inner"><span className="count">00</span>Days</div></div> <div className="counter-column"><div className="inner"><span className="count">00</span>Hours</div></div>  <div className="counter-column"><div className="inner"><span className="count">00</span>Mins</div></div>  <div className="counter-column"><div className="inner"><span className="count">00</span>Secs</div></div></div></div>
                        <a href="cart.html" className="cart-btn mt-3"><i className="fas fa-shopping-cart"></i> Add to Cart</a>
                    </div>
                </div>
            </div>
        </section>

    </div>
    )
}

export default Inicio;
