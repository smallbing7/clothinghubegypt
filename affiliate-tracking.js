/* =========================================================
   CLOTHING HUB EGYPT
   AFFILIATE REFERRAL TRACKING
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const SUPABASE_URL =
            "https://qnsljfdaqfebpcsbehpm.supabase.co";

        const SUPABASE_KEY =
            "sb_publishable_DKheV3t2LIRqxwYbBOhpbw_S8P-eg2q";

        if (!window.supabase)
            return;

        const supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );


        /* =====================================================
           GET REFERRAL CODE
        ===================================================== */

        const params =
            new URLSearchParams(
                window.location.search
            );

        const ref =
            params.get("ref");


        /* =====================================================
           SAVE REFERRAL
        ===================================================== */

        if (ref) {

            localStorage.setItem(
                "clothinghub_affiliate",
                ref
            );

            localStorage.setItem(
                "clothinghub_affiliate_time",
                Date.now().toString()
            );

            recordAffiliateClick(
                supabaseClient,
                ref
            );
        }


        /* =====================================================
           GET STORED REFERRAL
        ===================================================== */

        const storedRef =
            localStorage.getItem(
                "clothinghub_affiliate"
            );


        /* =====================================================
           ADD AFFILIATE CODE TO INQUIRY
        ===================================================== */

        const inquiryForm =
            document.getElementById(
                "inquiryForm"
            );

        if (
            inquiryForm &&
            storedRef
        ) {

            let hidden =
                inquiryForm.querySelector(
                    'input[name="affiliate_code"]'
                );

            if (!hidden) {

                hidden =
                    document.createElement(
                        "input"
                    );

                hidden.type =
                    "hidden";

                hidden.name =
                    "affiliate_code";

                inquiryForm.appendChild(
                    hidden
                );
            }

            hidden.value =
                storedRef;
        }


        /* =====================================================
           CAPTURE INQUIRY AS AFFILIATE LEAD
        ===================================================== */

        if (inquiryForm) {

            inquiryForm.addEventListener(
                "submit",
                async () => {

                    const affiliateCode =
                        localStorage.getItem(
                            "clothinghub_affiliate"
                        );

                    if (!affiliateCode)
                        return;

                    const data =
                        Object.fromEntries(
                            new FormData(
                                inquiryForm
                            ).entries()
                        );

                    await supabaseClient
                        .from("affiliate_leads")
                        .insert({

                            affiliate_code:
                                affiliateCode,

                            name:
                                data.name || "",

                            company:
                                data.company || "",

                            email:
                                data.email || "",

                            country:
                                data.country || "",

                            product:
                                data.product || "",

                            quantity:
                                data.quantity || "",

                            message:
                                data.message || ""

                        });

                }
            );
        }


        /* =====================================================
           CLICK TRACKING
        ===================================================== */

        async function recordAffiliateClick(
            client,
            code
        ) {

            try {

                await client
                    .from("affiliate_clicks")
                    .insert({

                        affiliate_code:
                            code,

                        page_url:
                            window.location.href,

                        referrer:
                            document.referrer || "",

                        user_agent:
                            navigator.userAgent

                    });

            } catch (error) {

                console.warn(
                    "Affiliate tracking error:",
                    error
                );

            }
        }

    }
);