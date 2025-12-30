import React from 'react';

const Sitemap = () => {
  return (
    <div>
      <style>
        {`
          body {
            background-color: #fff;
            font-family: "Arial Narrow", "Helvetica", "Arial", sans-serif;
            margin: 0;
          }

          .hide {
            display: none;
          }

          .collapse {
            text-decoration-style: dashed;
            text-decoration-line: underline;
          }

          #top {
            background-color: #b1d1e8;
            font-size: 16px;
            padding-bottom: 40px;
          }

          nav {
            font-size: 24px;
            margin: 0px 30px 0px;
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
            background-color: #f3f3f3;
            color: #666;
            box-shadow: 0 10px 20px -12px rgba(0, 0, 0, 0.42), 0 3px 20px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
            padding: 10px 0;
            text-align: center;
            z-index: 1;
          }

          h3 {
            margin: auto;
            padding: 10px;
            max-width: 600px;
            color: #666;
          }

          h3 span {
            float: right;
          }

          h3 a {
            font-weight: normal;
            display: block;
          }

          #cont {
            font-size: 18px;
            position: relative;
            border-radius: 6px;
            box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
            background: #f3f3f3;
            margin: -20px 30px 0px 30px;
            padding: 20px;
          }

          small {
            color: #666;
          }

          a:link,
          a:visited {
            color: #0180AF;
            text-decoration: underline;
          }

          a:hover {
            color: #666;
          }

          #footer {
            padding: 10px;
            text-align: center;
          }

          ul {
            margin: 0px;
            padding: 0px;
            list-style: none;
          }

          ul.ultree {
            border: #ccc 1px solid;
            border-radius: 4px;
            border-bottom: none;
          }

          li {
            margin: 0px;
          }

          li ul {
            margin-left: 20px;
          }

          li.lhead {
            background: #ddd;
            color: #666;
            padding: 5px;
            margin: 0px;
            cursor: pointer;
          }

          li.lhead:hover,
          .pager a:hover {
            background: #ccc;
          }

          .lcount {
            padding: 0px 10px;
          }

          .lpage {
            padding: 5px;
          }

          .last-page {
            border: none;
          }

          .pager {
            text-align: center;
          }

          .pager a,
          .pager span {
            padding: 10px;
            margin: 2px;
            background: #fff;
            border-radius: 10px;
            display: inline-block;
          }

          .pager span {
            border: #ccc 1px solid;
          }
        `}
      </style>

      <div id="top">
        <nav>ibnemukhtarbrandstore.vercel.app HTML Site Map</nav>
        <h3>
          <span>Last updated: 2025, July 23 04:57:05<br />
            Total pages: 37</span>
          <a href="https://ibnemukhtarbrandstore.vercel.app/">ibnemukhtarbrandstore.vercel.app Homepage</a>
        </h3>
      </div>
      <div id="cont">
        <ul className="ultree level-1 has-pages">
          <li className="lhead" title="Click to toggle">https://ibnemukhtarbrandstore.vercel.app/<span className="lcount">28 pages <small>[+9 in 2 subfolders]</small></span></li>

          <li className="lpagelist">
            <ul className="ulpages">
              <li className="lpage">
                <a href="https://ibnemukhtarbrandstore.vercel.app/"
                  title="Ibnemukhtar Brand Store | Women's Suits, Winter Jackets & Shoes in Pakistan">Ibnemukhtar Brand Store | Women's Suits, Winter Jackets & Shoes in Pakistan</a>
                <br /><small>Discover premium quality women's suits, winter jackets, and shoes at unbeatable prices. From elegant formal suits to cozy winter wear and stylish footwear, we offer affordable fashion for everyone in Pakistan.</small>
              </li>

              <li className="lpage">
                <a href="https://ibnemukhtarbrandstore.vercel.app/uniforms"
                  title="Women's Suits - IBNEMUKHTARBRANDSTORE | Formal & Casual Suits for Women">Women's Suits - IBNEMUKHTARBRANDSTORE | Formal & Casual Suits for Women</a>
                <br /><small>Discover premium women's suits at IBNEMUKHTARBRANDSTORE. Shop elegant formal suits, casual two-piece sets, and stylish office wear designed for comfort and sophistication. Perfect for work, events, and everyday elegance with a wide range of sizes and styles.</small>
              </li>

              <li className="lpage">
                <a href="https://ibnemukhtarbrandstore.vercel.app/hoodies"
                  title="Winter Jackets & Hoodies - IBNEMUKHTARBRANDSTORE">Winter Jackets & Hoodies - IBNEMUKHTARBRANDSTORE</a>
                <br /><small>Discover our premium winter jackets and hoodies designed for warmth, comfort, and style. Perfect for cold weather, casual wear, and outdoor activities. Pre-loved and new items available.</small>
              </li>

              <li className="lpage">
                <a href="https://ibnemukhtarbrandstore.vercel.app/tshirts"
                  title="Shoes & Footwear - IBNEMUKHTARBRANDSTORE | Men, Women & Kids Shoes">Shoes & Footwear - IBNEMUKHTARBRANDSTORE | Men, Women & Kids Shoes</a>
                <br /><small>Browse premium shoes and footwear at IBNEMUKHTARBRANDSTORE. Stylish and comfortable shoes for men, women, and kids. Perfect for casual wear, formal events, and everyday use at affordable prices.</small>
              </li>

              <li className="lpage">
                <a href="https://ibnemukhtarbrandstore.vercel.app/mugs" title="Accessories - IBNEMUKHTARBRANDSTORE">Accessories - IBNEMUKHTARBRANDSTORE</a>
                <br /><small>Explore our collection of fashion accessories including bags, jewelry, and lifestyle items. Perfect for fashion lovers looking to complete their style.</small>
              </li>

              <li className="lpage">
                <a href="https://ibnemukhtarbrandstore.vercel.app/stickers"
                  title="Gift Items - IBNEMUKHTARBRANDSTORE | Fashion Accessories">Gift Items - IBNEMUKHTARBRANDSTORE | Fashion Accessories</a>
                <br /><small>Explore fashion gift items and accessories at IBNEMUKHTARBRANDSTORE. Perfect for gifting to loved ones or treating yourself.</small>
              </li>

              <li className="lpage">
                <a href="https://ibnemukhtarbrandstore.vercel.app/login" title="Login | IBNEMUKHTARBRANDSTORE">Login | IBNEMUKHTARBRANDSTORE</a>
                <br /><small>Login to your IBNEMUKHTARBRANDSTORE account to manage your orders, edit your personal details, and access exclusive member features for women's suits, jackets, and shoes.</small>
              </li>

              <li className="lpage">
                <a href="https://ibnemukhtarbrandstore.vercel.app/checkout"
                  title="Checkout - IBNEMUKHTARBRANDSTORE | Women's Suits, Jackets & Shoes">Checkout - IBNEMUKHTARBRANDSTORE | Women's Suits, Jackets & Shoes</a>
                <br /><small>Secure checkout for high-quality women's suits, winter jackets, and shoes. Shop affordable fashion with cash on delivery and free shipping options.</small>
              </li>

              <li className="lpage">
                <a href="https://ibnemukhtarbrandstore.vercel.app/products"
                  title="All Products - IBNEMUKHTARBRANDSTORE">All Products - IBNEMUKHTARBRANDSTORE</a>
                <br /><small>Explore all available fashion products at IBNEMUKHTARBRANDSTORE. Find women's suits, winter jackets, shoes, hoodies, and more. Easily search your favorite products.</small>
              </li>

              <li className="lpage">
                <a href="https://ibnemukhtarbrandstore.vercel.app/contact-us"
                  title="Contact Us | IBNEMUKHTARBRANDSTORE Fashion Support">Contact Us | IBNEMUKHTARBRANDSTORE Fashion Support</a>
                <br /><small>Have questions about orders, sizing, or products? Contact IBNEMUKHTARBRANDSTORE for customer support, order tracking, and fashion inquiries about women's suits, jackets, and shoes.</small>
              </li>

              <li className="lpage">
                <a href="https://ibnemukhtarbrandstore.vercel.app/uniforms-company?company=dae%20do"
                  title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | IBNEMUKHTARBRANDSTORE">BUY
                  TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | IBNEMUKHTARBRANDSTORE</a>
                <br /><small>Discover premium quality sports uniforms and martial arts equipment designed for
                  performance, durability, and style. Whether you&apos;re a beginner or a professional
                  athlete, we bring you a wide range of gear that empowers your training and boosts your
                  confidence.</small>
              </li>

              <li className="lpage">
                <a href="https://ibnemukhtarbrandstore.vercel.app/uniforms-company?company=fila"
                  title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | IBNEMUKHTARBRANDSTORE">BUY
                  TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | IBNEMUKHTARBRANDSTORE</a>
                <br /><small>Discover premium quality sports uniforms and martial arts equipment designed for
                  performance, durability, and style. Whether you&apos;re a beginner or a professional
                  athlete, we bring you a wide range of gear that empowers your training and boosts your
                  confidence.</small>
              </li>

              <li className="lpage">
                <a href="https://ibnemukhtarbrandstore.vercel.app/uniforms-company?company=gr%20tkd"
                  title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | IBNEMUKHTARBRANDSTORE">BUY
                  TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | IBNEMUKHTARBRANDSTORE</a>
                <br /><small>Discover premium quality sports uniforms and martial arts equipment designed for
                  performance, durability, and style. Whether you&apos;re a beginner or a professional
                  athlete, we bring you a wide range of gear that empowers your training and boosts your
                  confidence.</small>
              </li>

              <li className="lpage">
                <a href="https://ibnemukhtarbrandstore.vercel.app/uniforms-company?company=moto"
                  title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | IBNEMUKHTARBRANDSTORE">BUY
                  TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | IBNEMUKHTARBRANDSTORE</a>
                <br /><small>Discover premium quality sports uniforms and martial arts equipment designed for
                  performance, durability, and style. Whether you&apos;re a beginner or a professional
                  athlete, we bring you a wide range of gear that empowers your training and boosts your
                  confidence.</small>
              </li>

              <li className="lpage">
                <a href="https://ibnemukhtarbrandstore.vercel.app/uniforms-company?company=pine%20tree"
                  title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | IBNEMUKHTARBRANDSTORE">BUY
                  TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | IBNEMUKHTARBRANDSTORE</a>
                <br /><small>Discover premium quality sports uniforms and martial arts equipment designed for
                  performance, durability, and style. Whether you&apos;re a beginner or a professional
                  athlete, we bring you a wide range of gear that empowers your training and boosts your
                  confidence.</small>
              </li>

              <li className="lpage">
                <a href="https://ibnemukhtarbrandstore.vercel.app/uniforms-company?company=pro%20specs"
                  title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | IBNEMUKHTARBRANDSTORE">BUY
                  TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | IBNEMUKHTARBRANDSTORE</a>
                <br /><small>Discover premium quality sports uniforms and martial arts equipment designed for
                  performance, durability, and style. Whether you&apos;re a beginner or a professional
                  athlete, we bring you a wide range of gear that empowers your training and boosts your
                  confidence.</small>
              </li>

              <li className="lpage">
                <a href="https://ibnemukhtarbrandstore.vercel.app/about"
                  title="About Us | IBNEMUKHTARBRANDSTORE Martial Arts Gear & Equipment">About Us |
                  IBNEMUKHTARBRANDSTORE Martial Arts Gear & Equipment</a>
                <br /><small>Learn about IBNEMUKHTARBRANDSTORE, your trusted store for premium martial arts uniforms,
                  protective gear, and training equipment. Discover our mission, values, and commitment to
                  supporting martial artists worldwide.</small>
              </li>

              <li className="lpage">
                <a href="https://ibnemukhtarbrandstore.vercel.app/privacy-policy"
                  title="Privacy Policy | IBNEMUKHTARBRANDSTORE Martial Arts Gear & Equipment">Privacy Policy |
                  IBNEMUKHTARBRANDSTORE Martial Arts Gear & Equipment</a>
                <br /><small>Learn how IBNEMUKHTARBRANDSTORE safeguards your personal information when shopping
                  for martial arts gear, uniforms, and accessories. Read our privacy policy to understand
                  how we collect, store, and use your data.</small>
              </li>
              <li className="lpage">
                <a href="https://ibnemukhtarbrandstore.vercel.app/blog" title="Blog | IBNEMUKHTARBRANDSTORE Blog">Blog | IBNEMUKHTARBRANDSTORE Blog</a>
                <br /><small>Read our latest fashion tips, styling guides, and shopping inspiration for women's suits, winter jackets, and shoes.</small>
              </li>



              <li className="lpage">
                <a href="https://www.champzones.com/refund-policy"
                  title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE">BUY
                  TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE</a>
                <br /><small>Discover premium quality sports uniforms and martial arts equipment designed for
                  performance, durability, and style. Whether you&apos;re a beginner or a professional
                  athlete, we bring you a wide range of gear that empowers your training and boosts your
                  confidence.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/shiping-policy"
                  title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE">BUY
                  TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE</a>
                <br /><small>Discover premium quality sports uniforms and martial arts equipment designed for
                  performance, durability, and style. Whether you&apos;re a beginner or a professional
                  athlete, we bring you a wide range of gear that empowers your training and boosts your
                  confidence.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/terms-conditions"
                  title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE">BUY
                  TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE</a>
                <br /><small>Discover premium quality sports uniforms and martial arts equipment designed for
                  performance, durability, and style. Whether you&apos;re a beginner or a professional
                  athlete, we bring you a wide range of gear that empowers your training and boosts your
                  confidence.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/signup"
                  title="Create Account - CHAMPION-CHOICE | Martial Arts Gear Store">Create Account -
                  CHAMPION-CHOICE | Martial Arts Gear Store</a>
                <br /><small>Create your CHAMPION-CHOICE account to access your order history, track deliveries,
                  and receive the best martial arts gear offers. Secure sign-up for karate, taekwondo, and MMA
                  enthusiasts.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/forgot"
                  title="Forgot Password - CHAMPION-CHOICE | Martial Arts Gears & Fashion">Forgot Password
                  - CHAMPION-CHOICE | Martial Arts Gears & Fashion</a>
                <br /><small>Reset your password easily at CHAMPION-CHOICE. Fashionable martial arts uniforms,
                  Taekwondo, Karate, Hapkido, Kung Fu, and sportswear are all available here.</small>
              </li>
            </ul>
          </li>

          <li className="lsub">
            <ul className="ultree level-2 has-pages">
              <li className="lhead" title="Click to toggle">all-products/<span className="lcount">3 pages</span></li>

              <li className="lpagelist">
                <ul className="ulpages">
                  <li className="lpage">
                    <a href="https://www.champzones.com/all-products/recommended"
                      title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE">BUY
                      TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE</a>
                    <br /><small>Discover premium quality sports uniforms and martial arts equipment
                      designed for performance, durability, and style. Whether you&apos;re a beginner or a
                      professional athlete, we bring you a wide range of gear that empowers your training
                      and boosts your confidence.</small>
                  </li>

                  <li className="lpage">
                    <a href="https://www.champzones.com/all-products/flash-sale"
                      title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE">BUY
                      TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE</a>
                    <br /><small>Discover premium quality sports uniforms and martial arts equipment
                      designed for performance, durability, and style. Whether you&apos;re a beginner or a
                      professional athlete, we bring you a wide range of gear that empowers your training
                      and boosts your confidence.</small>
                  </li>

                  <li className="lpage">
                    <a href="https://www.champzones.com/all-products/limited"
                      title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE">BUY
                      TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE</a>
                    <br /><small>Discover premium quality sports uniforms and martial arts equipment
                      designed for performance, durability, and style. Whether you&apos;re a beginner or a
                      professional athlete, we bring you a wide range of gear that empowers your training
                      and boosts your confidence.</small>
                  </li>
                </ul>
              </li>
            </ul>

            <ul className="ultree level-2 has-pages">
              <li className="lhead" title="Click to toggle">product/<span className="lcount">6 pages</span></li>

              <li className="lpagelist">
                <ul className="ulpages">
                  <li className="lpage">
                    <a href="https://www.champzones.com/product/taekwondo-tkd-hoodie-black"
                      title="All Products - CHAMPION-CHOICE">All Products - CHAMPION-CHOICE</a>
                    <br /><small>Explore all available martial arts gear and sportswear at CHAMPION-CHOICE.
                      Find uniforms, hoodies, belts, gloves, mugs, and more. Easily search your favorite
                      products.</small>
                  </li>

                  <li className="lpage">
                    <a href="https://www.champzones.com/product/taekwondo-training-tshirt-mens-sports-fit-black"
                      title="All Products - CHAMPION-CHOICE">All Products - CHAMPION-CHOICE</a>
                    <br /><small>Explore all available martial arts gear and sportswear at CHAMPION-CHOICE.
                      Find uniforms, hoodies, belts, gloves, mugs, and more. Easily search your favorite
                      products.</small>
                  </li>

                  <li className="lpage">
                    <a href="https://www.champzones.com/product/traditional-korean-art-taekwondo-tshirt"
                      title="All Products - CHAMPION-CHOICE">All Products - CHAMPION-CHOICE</a>
                    <br /><small>Explore all available martial arts gear and sportswear at CHAMPION-CHOICE.
                      Find uniforms, hoodies, belts, gloves, mugs, and more. Easily search your favorite
                      products.</small>
                  </li>

                  <li className="lpage">
                    <a href="https://www.champzones.com/product/taekwondo-tkd-hoodie-yellow"
                      title="All Products - CHAMPION-CHOICE">All Products - CHAMPION-CHOICE</a>
                    <br /><small>Explore all available martial arts gear and sportswear at CHAMPION-CHOICE.
                      Find uniforms, hoodies, belts, gloves, mugs, and more. Easily search your favorite
                      products.</small>
                  </li>

                  <li className="lpage">
                    <a href="https://www.champzones.com/product/traditional-korean-art-taekwondo-tshirt-l"
                      title="All Products - CHAMPION-CHOICE">All Products - CHAMPION-CHOICE</a>
                    <br /><small>Explore all available martial arts gear and sportswear at CHAMPION-CHOICE.
                      Find uniforms, hoodies, belts, gloves, mugs, and more. Easily search your favorite
                      products.</small>
                  </li>

                  <li className="lpage">
                    <a href="https://www.champzones.com/product/traditional-korean-art-taekwondo-tshirt-s"
                      title="All Products - CHAMPION-CHOICE">All Products - CHAMPION-CHOICE</a>
                    <br /><small>Explore all available martial arts gear and sportswear at CHAMPION-CHOICE.
                      Find uniforms, hoodies, belts, gloves, mugs, and more. Easily search your favorite
                      products.</small>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>

    </div>
  );
};

export default Sitemap;