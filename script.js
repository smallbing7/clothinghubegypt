/* =========================================================
   CLOTHING HUB EGYPT
   PREMIUM WEBSITE — CLEAN FINAL JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* PUBLIC SUPABASE CONFIG — publishable key is safe for browser use. */
    const SUPABASE_URL = "https://qnsljfdaqfebpcsbehpm.supabase.co";
    const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_DKheV3t2LIRqxwYbBOhpbw_S8P-eg2q";
    const supabaseClient = (window.supabase && SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY)
        ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
        : null;

    const sendFormEmail = (payload, subject) => {
        const iframe = document.createElement("iframe");
        iframe.name = "formsubmit_target_" + Date.now();
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://formsubmit.co/clothinghubegypt4@gmail.com";
        form.target = iframe.name;
        form.style.display = "none";
        const fields = {
            _subject: subject,
            _captcha: "false",
            _template: "table",
            ...payload
        };
        Object.entries(fields).forEach(([key, value]) => {
            const input = document.createElement("input");
            input.type = "hidden"; input.name = key; input.value = value ?? "";
            form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
        setTimeout(() => { form.remove(); iframe.remove(); }, 5000);
    };

    /* =====================================================
       01 — LOADER
    ===================================================== */

    const loader = document.querySelector(".site-loader");

    window.addEventListener("load", () => {

        setTimeout(() => {

            if (loader) {
                loader.classList.add("loaded");
            }

        }, 1200);

    });


    /* =====================================================
       02 — NAVBAR
    ===================================================== */

    const navbar = document.querySelector(".navbar");

    const handleNavbar = () => {

        if (!navbar) return;

        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

    };

    handleNavbar();

    window.addEventListener("scroll", handleNavbar);


    /* =====================================================
       03 — MOBILE MENU
    ===================================================== */

    const menuToggle =
        document.querySelector(".menu-toggle");

    const navMenu =
        document.querySelector(".nav-menu");

    const navLinks =
        document.querySelectorAll(".nav-menu a");


    const closeMenu = () => {

        if (!menuToggle || !navMenu) return;

        menuToggle.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.classList.remove("menu-open");

    };


    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {

            menuToggle.classList.toggle("active");
            navMenu.classList.toggle("active");
            document.body.classList.toggle("menu-open");

        });

    }


    navLinks.forEach(link => {

        link.addEventListener("click", closeMenu);

    });


    /* =====================================================
       04 — ACTIVE NAVIGATION
    ===================================================== */

    const sections =
        document.querySelectorAll("section[id]");


    const updateActiveNav = () => {

        let currentSection = "";

        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 180;

            const sectionHeight =
                section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY <
                sectionTop + sectionHeight
            ) {

                currentSection =
                    section.getAttribute("id");

            }

        });


        navLinks.forEach(link => {

            link.classList.remove("active");

            const href =
                link.getAttribute("href");

            if (
                href === `#${currentSection}`
            ) {

                link.classList.add("active");

            }

        });

    };


    window.addEventListener(
        "scroll",
        updateActiveNav
    );

    updateActiveNav();


    /* =====================================================
       05 — SMOOTH SCROLL
    ===================================================== */

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(anchor => {

        anchor.addEventListener(
            "click",
            function (event) {

                const targetId =
                    this.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) return;

                const target =
                    document.querySelector(targetId);

                if (!target) return;

                event.preventDefault();

                const offset =
                    navbar
                        ? navbar.offsetHeight
                        : 0;

                const position =
                    target.offsetTop - offset;

                window.scrollTo({
                    top: position,
                    behavior: "smooth"
                });

            }
        );

    });


    /* =====================================================
       06 — SCROLL REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");


    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target
                                .classList
                                .add("revealed");

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(element => {

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach(element => {

            element.classList.add("revealed");

        });

    }


    /* =====================================================
       07 — PRODUCT FILTER
    ===================================================== */

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    let productCards =
        document.querySelectorAll(".product-card");


    const filterProducts = category => {

        productCards.forEach(card => {

            const cardCategory =
                (
                    card.dataset.category ||
                    ""
                ).toLowerCase();


            if (
                category === "all" ||
                cardCategory === category
            ) {

                card.classList.remove(
                    "product-hidden"
                );

                card.classList.add(
                    "product-visible"
                );

            } else {

                card.classList.remove(
                    "product-visible"
                );

                card.classList.add(
                    "product-hidden"
                );

            }

        });

    };


    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


                button.classList.add("active");


                const category =
                    (
                        button.dataset.filter ||
                        "all"
                    ).toLowerCase();


                filterProducts(category);

            }
        );

    });


    /* =====================================================
       08 — PRODUCT SEARCH
    ===================================================== */

    const searchInput =
        document.querySelector(
            ".catalogue-search input"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                const searchTerm =
                    searchInput.value
                        .trim()
                        .toLowerCase();


                productCards.forEach(card => {

                    const searchableText =
                        card.textContent
                            .toLowerCase();


                    const matches =
                        searchableText.includes(
                            searchTerm
                        );


                    if (matches) {

                        card.classList.remove(
                            "product-hidden"
                        );

                        card.classList.add(
                            "product-visible"
                        );

                    } else {

                        card.classList.remove(
                            "product-visible"
                        );

                        card.classList.add(
                            "product-hidden"
                        );

                    }

                });

            }
        );

    }


    /* =====================================================
       09 — PRODUCT MODAL
    ===================================================== */

    const productModal =
        document.querySelector(".product-modal");

    const modalOverlay =
        document.querySelector(".modal-overlay");

    const modalClose =
        document.querySelector(".modal-close");

    const modalTitle =
        document.querySelector(
            ".modal-content h2"
        );

    const modalCategory =
        document.querySelector(
            ".modal-content > span"
        );

    const modalDescription =
        document.querySelector(
            ".modal-content p"
        );

    const productViewButtons =
        document.querySelectorAll(".product-view");


    const openModal = card => {

        if (!productModal) return;


        const title =
            card.querySelector(".product-info h3");

        const category =
            card.querySelector(
                ".product-info > span"
            );

        const description =
            card.querySelector(".product-info p");


        if (modalTitle && title) {

            modalTitle.textContent =
                title.textContent.trim();

        }


        if (modalCategory && category) {

            modalCategory.textContent =
                category.textContent.trim();

        }


        if (modalDescription && description) {

            modalDescription.textContent =
                description.textContent.trim() +
                " Available for wholesale export and international bulk orders.";

        }


        productModal.classList.add("open");

        document.body.classList.add("menu-open");

    };


    const closeModal = () => {

        if (!productModal) return;

        productModal.classList.remove("open");

        document.body.classList.remove(
            "menu-open"
        );

    };


    productViewButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const card =
                    button.closest(".product-card");

                if (card) {
                    openModal(card);
                }

            }
        );

    });


    if (modalClose) {
        modalClose.addEventListener(
            "click",
            closeModal
        );
    }


    if (modalOverlay) {
        modalOverlay.addEventListener(
            "click",
            closeModal
        );
    }


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {
                closeModal();
            }

        }
    );


    /* =====================================================
       10 — WHATSAPP
    ===================================================== */

    const whatsappNumber =
        "201112736689";


    const inquiryForm =
        document.querySelector("#inquiryForm");


    if (inquiryForm) {
        inquiryForm.addEventListener("submit", event => {
            event.preventDefault();
            const data = Object.fromEntries(new FormData(inquiryForm).entries());
            const whatsappMessage = `Hello Clothing Hub Egypt,\nI would like to make a wholesale inquiry.\n\nName: ${data.name || ""}\nCompany: ${data.company || ""}\nEmail: ${data.email || ""}\nCountry: ${data.country || ""}\nProduct: ${data.product || ""}\nQuantity: ${data.quantity || ""}\n\nMessage:\n${data.message || ""}\n\nPlease share your best wholesale price, MOQ, available options and shipping details.`;
            const formMessage = document.querySelector(".form-message");
            sendFormEmail(data, "New Quote Request — Clothing Hub Egypt");
            if (supabaseClient) {
                supabaseClient.from("quote_requests").insert({
                    name: data.name || "", company: data.company || "", email: data.email || "",
                    country: data.country || "", product: data.product || "", quantity: data.quantity || "",
                    message: data.message || ""
                }).catch(() => {});
            }
            window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, "_blank", "noopener");
            if (formMessage) {
                formMessage.textContent = "Quote sent. WhatsApp opened and your inquiry was emailed.";
                formMessage.className = "form-message success";
            }
            inquiryForm.reset();
        });
    }


    /* =====================================================
       11 — PRODUCT WHATSAPP BUTTONS
    ===================================================== */

    document.querySelectorAll(
        "[data-whatsapp-product]"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const product =
                    button.dataset.whatsappProduct ||
                    "clothing";


                const message =
                    `Hello Clothing Hub Egypt, I am interested in ${product}. Please send me wholesale price, MOQ, available quantity, specifications and shipping options.`;


                const url =
                    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        message
                    )}`;


                window.open(
                    url,
                    "_blank"
                );

            }
        );

    });


    /* =====================================================
       12 — EMAIL
    ===================================================== */

    const businessEmail =
        "clothinghubegypt4@gmail.com";


    document.querySelectorAll(
        "[data-email]"
    ).forEach(element => {

        element.addEventListener(
            "click",
            () => {

                window.location.href =
                    `mailto:${businessEmail}`;

            }
        );

    });


    /* =====================================================
       13 — CONTACT LINKS
    ===================================================== */

    document.querySelectorAll("a").forEach(link => {

        const text =
            link.textContent
                .toLowerCase()
                .replace(/\s+/g, " ")
                .trim();


        if (
            text.includes("whatsapp") ||
            text.includes("send inquiry") ||
            text.includes("whatsapp us")
        ) {

            link.href =
                `https://wa.me/${whatsappNumber}`;

            link.target = "_blank";

            link.rel =
                "noopener noreferrer";

        }


        if (
            text === "email us" ||
            text.includes("email inquiry")
        ) {

            link.href =
                `mailto:${businessEmail}`;

        }

    });


    /* =====================================================
       14 — CONTACT FORM
    ===================================================== */

    const contactForm =
        document.querySelector("#contactForm");


    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const name =
                    document.querySelector(
                        "#name"
                    )?.value || "";


                const email =
                    document.querySelector(
                        "#email"
                    )?.value || "";


                const message =
                    document.querySelector(
                        "#message"
                    )?.value || "";


                const subject =
                    encodeURIComponent(
                        "New Inquiry — Clothing Hub Egypt"
                    );


                const body =
                    encodeURIComponent(
                        `Name: ${name}
Email: ${email}

Message:
${message}`
                    );


                window.location.href =
                    `mailto:${businessEmail}?subject=${subject}&body=${body}`;

            }
        );

    }


    /* =====================================================
       15 — CUSTOM CURSOR
    ===================================================== */

    const cursor =
        document.querySelector(".custom-cursor");

    const cursorLabel =
        document.querySelector(".cursor-label");


    if (
        cursor &&
        window.matchMedia(
            "(pointer: fine)"
        ).matches
    ) {

        let mouseX = 0;
        let mouseY = 0;

        let cursorX = 0;
        let cursorY = 0;


        document.addEventListener(
            "mousemove",
            event => {

                mouseX = event.clientX;
                mouseY = event.clientY;


                if (cursorLabel) {

                    cursorLabel.style.left =
                        `${mouseX + 15}px`;

                    cursorLabel.style.top =
                        `${mouseY + 15}px`;

                }

            }
        );


        const animateCursor = () => {

            cursorX +=
                (mouseX - cursorX) * 0.18;

            cursorY +=
                (mouseY - cursorY) * 0.18;


            cursor.style.left =
                `${cursorX}px`;

            cursor.style.top =
                `${cursorY}px`;


            requestAnimationFrame(
                animateCursor
            );

        };


        animateCursor();


        document.querySelectorAll(
            "a, button, .product-card, .collection-card"
        ).forEach(element => {

            element.addEventListener(
                "mouseenter",
                () => {

                    cursor.classList.add(
                        "cursor-hover"
                    );

                }
            );


            element.addEventListener(
                "mouseleave",
                () => {

                    cursor.classList.remove(
                        "cursor-hover"
                    );

                }
            );

        });

    }


    /* =====================================================
       16 — HERO PARALLAX
    ===================================================== */

    const hero =
        document.querySelector(".hero");


    if (
        hero &&
        window.matchMedia(
            "(min-width: 769px)"
        ).matches
    ) {

        window.addEventListener(
            "scroll",
            () => {

                const scroll =
                    window.scrollY;


                if (
                    scroll <
                    window.innerHeight
                ) {

                    hero.style.backgroundPosition =
                        `center ${scroll * 0.18}px`;

                }

            }
        );

    }


    /* =====================================================
       17 — CURRENT YEAR
    ===================================================== */

    document.querySelectorAll(
        "[data-current-year]"
    ).forEach(element => {

        element.textContent =
            new Date().getFullYear();

    });


    /* =====================================================
       18 — COUNTERS
    ===================================================== */

    const counters =
        document.querySelectorAll(
            "[data-counter]"
        );


    if (
        counters.length &&
        "IntersectionObserver" in window
    ) {

        const counterObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            !entry.isIntersecting
                        ) return;


                        const counter =
                            entry.target;


                        const target =
                            parseInt(
                                counter.dataset.counter,
                                10
                            );


                        if (
                            Number.isNaN(target)
                        ) return;


                        let current = 0;

                        const duration = 1300;

                        const stepTime =
                            Math.max(
                                Math.floor(
                                    duration /
                                    target
                                ),
                                15
                            );


                        const timer =
                            setInterval(() => {

                                current +=
                                    Math.ceil(
                                        target / 60
                                    );


                                if (
                                    current >=
                                    target
                                ) {

                                    current =
                                        target;

                                    clearInterval(
                                        timer
                                    );

                                }


                                counter.textContent =
                                    current;

                            }, stepTime);


                        counterObserver.unobserve(
                            counter
                        );

                    });

                },
                {
                    threshold: 0.6
                }
            );


        counters.forEach(counter => {

            counterObserver.observe(counter);

        });

    }


    /* =====================================================
       19 — FORM VALIDATION
    ===================================================== */

    document.querySelectorAll(
        "#inquiryForm [required]"
    ).forEach(input => {

        input.addEventListener(
            "blur",
            () => {

                if (!input.value.trim()) {

                    input.style.borderColor =
                        "#b04b4b";

                } else {

                    input.style.borderColor =
                        "";

                }

            }
        );


        input.addEventListener(
            "input",
            () => {

                if (input.value.trim()) {

                    input.style.borderColor =
                        "";

                }

            }
        );

    });


    /* =====================================================
       20 — ESCAPE MENU
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {
                closeMenu();
            }

        }
    );


    /* =====================================================
       21 — RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 768) {
                closeMenu();
            }

        }
    );


    /* =====================================================
       22 — PRICES
    ===================================================== */

    const productPrices = {

        "t-shirt": "$6.00",
        "tshirt": "$6.00",

        "polo": "$7.00",

        "shirt": "$8.00",

        "pants": "$10.00",
        "trousers": "$10.00",

        "dress": "$10.00",

        "top": "$7.00",

        "kids wear": "$5.00",
        "kids": "$5.00",

        "denim jacket": "$13.00",
        "denim jackets": "$13.00",

        "jeans": "$11.00",

        "tie": "$4.00",
        "ties": "$4.00",

        "belt": "$5.00",
        "belts": "$5.00",

        "purse": "$9.00",
        "purses": "$9.00",
        "women's purses": "$9.00",

        "sportswear": "$9.00",
        "sports wear": "$9.00",

        "bulk garments": "Request Quote",
        "bulk": "Request Quote"

    };


    const priceCards =
        document.querySelectorAll(
            ".product-card"
        );


    priceCards.forEach(card => {

        if (
            card.querySelector(
                ".auto-product-price"
            )
        ) return;


        const text =
            card.textContent
                .toLowerCase()
                .replace(/\s+/g, " ")
                .trim();


        let matchedPrice = null;


        for (
            const [keyword, price]
            of Object.entries(productPrices)
        ) {

            if (text.includes(keyword)) {

                matchedPrice = price;

                break;

            }

        }


        if (!matchedPrice) return;


        const priceElement =
            document.createElement("div");


        priceElement.className =
            "auto-product-price";


        priceElement.innerHTML = `
            <span>Wholesale</span>
            <strong>${matchedPrice}</strong>
            <small>per piece</small>
        `;


        card.appendChild(priceElement);

    });


    /* =====================================================
       23 — NEW PRODUCT CATEGORIES
    ===================================================== */

    const productGrid =
        document.querySelector(".products-grid") ||
        document.querySelector(".product-grid") ||
        document.querySelector("#productsGrid") ||
        document.querySelector(".products-container");


    if (productGrid) {

        const extraGrid =
            document.createElement("div");


        extraGrid.className =
            "clothing-extra-grid";


        const extraProducts = [

            {
                name: "Denim Jackets",
                category: "Denim",
                price: "$13.00",
                image: "denim-jacket.jpg"
            },

            {
                name: "Jeans",
                category: "Denim",
                price: "$11.00",
                image: "jeans.jpg"
            },

            {
                name: "Ties",
                category: "Accessories",
                price: "$4.00",
                image: "ties.jpg"
            },

            {
                name: "Belts",
                category: "Accessories",
                price: "$5.00",
                image: "belts.jpg"
            },

            {
                name: "Women's Purses",
                category: "Accessories",
                price: "$9.00",
                image: "womens-purses.jpg"
            },

            {
                name: "Sportswear",
                category: "Sports",
                price: "$9.00",
                image: "sportswear.jpg"
            }

        ];


        extraProducts.forEach(product => {

            const card =
                document.createElement("article");


            card.className =
                "product-card clothing-extra-card";


            card.dataset.category =
                product.category.toLowerCase();


            card.innerHTML = `

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                    >

                </div>


                <div class="product-info">

                    <span>
                        ${product.category}
                    </span>

                    <h3>
                        ${product.name}
                    </h3>


                    <div class="auto-product-price">

                        <span>
                            Wholesale
                        </span>

                        <strong>
                            ${product.price}
                        </strong>

                        <small>
                            per piece
                        </small>

                    </div>

                </div>

            `;


            extraGrid.appendChild(card);

        });


        productGrid.appendChild(extraGrid);

    }


    /* =====================================================
       24 — AFFILIATE APPLICATION + EMAIL OTP
    ===================================================== */
    const affiliateForm = document.getElementById("affiliateForm");
    const affiliateMessage = document.getElementById("affiliateMessage");
    const affiliateOtpBox = document.getElementById("affiliateOtpBox");
    const affiliateOtp = document.getElementById("affiliateOtp");
    const verifyAffiliateOtp = document.getElementById("verifyAffiliateOtp");
    let affiliateData = null;

    const affiliateMsg = text => { if (affiliateMessage) { affiliateMessage.textContent = text; affiliateMessage.classList.add("show"); } };

    if (affiliateForm) {
        affiliateForm.addEventListener("submit", async event => {
            event.preventDefault();
            const data = {
                name: document.getElementById("affiliateName")?.value.trim() || "",
                email: document.getElementById("affiliateEmail")?.value.trim() || "",
                whatsapp: document.getElementById("affiliateWhatsapp")?.value.trim() || "",
                country: document.getElementById("affiliateCountry")?.value.trim() || "",
                promotion_method: document.getElementById("affiliateMethod")?.value || "",
                audience: document.getElementById("affiliateAudience")?.value.trim() || ""
            };
            if (!data.name || !data.email || !data.whatsapp || !data.country || !data.promotion_method || !data.audience || !document.getElementById("affiliateTerms")?.checked) {
                affiliateMsg("Please complete all required fields and accept the terms."); return;
            }
            if (!supabaseClient) { affiliateMsg("Verification service is unavailable. Please try again later."); return; }
            affiliateData = data;
            const { error } = await supabaseClient.auth.signInWithOtp({ email: data.email, options: { shouldCreateUser: true } });
            if (error) { affiliateMsg(error.message); return; }
            if (affiliateOtpBox) affiliateOtpBox.style.display = "block";
            affiliateMsg("A 6-digit OTP has been sent to your email. Enter it below.");
        });
    }

    if (verifyAffiliateOtp) {
        verifyAffiliateOtp.addEventListener("click", async () => {
            if (!affiliateData || !affiliateOtp?.value.trim()) { affiliateMsg("Enter the OTP first."); return; }
            const { error: verifyError } = await supabaseClient.auth.verifyOtp({ email: affiliateData.email, token: affiliateOtp.value.trim(), type: "email" });
            if (verifyError) { affiliateMsg(verifyError.message); return; }
            const { error: insertError } = await supabaseClient.from("affiliate_applications").insert(affiliateData);
            if (insertError) {
                affiliateMsg("Email verified, but the application could not be saved. Please contact us on WhatsApp.");
                return;
            }
            sendFormEmail(affiliateData, "New Verified Affiliate Application — Clothing Hub Egypt");
            affiliateMsg("Verified! Your affiliate application has been submitted successfully.");
            affiliateForm.reset();
            if (affiliateOtpBox) affiliateOtpBox.style.display = "none";
            affiliateData = null;
            await supabaseClient.auth.signOut();
        });
    }


    /* =====================================================
       25 — INITIAL PRODUCT STATE
    ===================================================== */

    document.querySelectorAll(
        ".product-card"
    ).forEach(card => {

        card.classList.add(
            "product-visible"
        );

    });


    /* =====================================================
       WEBSITE READY
    ===================================================== */

    console.log(
        "%c CLOTHING HUB EGYPT ",
        "background:#0a0a0a;color:#c6a16d;font-size:16px;padding:8px;"
    );

    console.log(
        "Premium wholesale export website loaded successfully."
    );

});
