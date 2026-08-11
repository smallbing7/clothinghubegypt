/*
=========================================================
CLOTHING HUB EGYPT
ADMIN + AFFILIATE MANAGEMENT
=========================================================
*/

const SUPABASE_URL =
    "https://qnsljfdaqfebpcsbehpm.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_DKheV3t2LIRqxwYbBOhpbw_S8P-eg2q";

const client =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

const $ = id => document.getElementById(id);

const msg = (id, text, error = false) => {
    const el = $(id);
    if (!el) return;

    el.textContent = text;
    el.classList.toggle("error", error);
};

function esc(value) {
    return String(value ?? "").replace(
        /[&<>"']/g,
        m => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[m])
    );
}

/* =========================================================
   ADMIN AUTH
========================================================= */

async function requireAdmin() {

    const {
        data: { user }
    } = await client.auth.getUser();

    if (!user) {
        $("loginPanel").classList.remove("hidden");
        $("dashboard").classList.add("hidden");
        return;
    }

    const { data: profile, error } =
        await client
            .from("admin_users")
            .select("user_id")
            .eq("user_id", user.id)
            .maybeSingle();

    if (error || !profile) {

        await client.auth.signOut();

        $("loginPanel").classList.remove("hidden");
        $("dashboard").classList.add("hidden");

        msg(
            "loginMessage",
            "This account is not an admin.",
            true
        );

        return;
    }

    $("loginPanel").classList.add("hidden");
    $("dashboard").classList.remove("hidden");

    await loadProducts();
    await loadAffiliates();
    await loadAffiliateStats();
}

/* =========================================================
   LOGIN
========================================================= */

$("loginForm").addEventListener(
    "submit",
    async e => {

        e.preventDefault();

        msg("loginMessage", "Logging in...");

        const {
            error
        } = await client.auth.signInWithPassword({
            email: $("email").value.trim(),
            password: $("password").value
        });

        if (error) {
            msg(
                "loginMessage",
                error.message,
                true
            );
            return;
        }

        await requireAdmin();
    }
);

/* =========================================================
   LOGOUT
========================================================= */

$("logoutBtn").addEventListener(
    "click",
    async () => {

        await client.auth.signOut();

        location.reload();
    }
);

/* =========================================================
   PRODUCTS
========================================================= */

async function loadProducts() {

    const {
        data,
        error
    } = await client
        .from("products")
        .select("*")
        .order("created_at", {
            ascending: false
        });

    if (error) {

        $("productsList").textContent =
            error.message;

        return;
    }

    $("productsList").innerHTML =
        data.length
            ? data.map(p => `
                <div class="item">

                    <strong>
                        ${esc(p.name)}
                    </strong>

                    <small>
                        ${esc(p.category)}
                        ·
                        ${esc(p.price)}
                        ·
                        ${esc(p.image)}
                    </small>

                    <div class="itemActions">

                        <button
                            onclick='editProduct(${JSON.stringify(p)})'>
                            Edit
                        </button>

                        <button
                            class="danger"
                            onclick="deleteProduct('${p.id}')">
                            Delete
                        </button>

                    </div>

                </div>
            `).join("")
            : "<p>No products yet.</p>";
}

window.editProduct = p => {

    $("productId").value =
        p.id || "";

    $("productName").value =
        p.name || "";

    $("productCategory").value =
        p.category || "";

    $("productPrice").value =
        p.price || "";

    $("productImage").value =
        p.image || "";

    $("productDescription").value =
        p.description || "";

    scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

async function deleteProduct(id) {

    if (!confirm("Delete this product?"))
        return;

    const {
        error
    } = await client
        .from("products")
        .delete()
        .eq("id", id);

    if (error) {
        alert(error.message);
        return;
    }

    await loadProducts();
}

$("productForm").addEventListener(
    "submit",
    async e => {

        e.preventDefault();

        const payload = {

            name:
                $("productName")
                    .value
                    .trim(),

            category:
                $("productCategory")
                    .value
                    .trim(),

            price:
                $("productPrice")
                    .value
                    .trim(),

            image:
                $("productImage")
                    .value
                    .trim(),

            description:
                $("productDescription")
                    .value
                    .trim()
        };

        const id =
            $("productId").value;

        const result =
            id
                ? await client
                    .from("products")
                    .update(payload)
                    .eq("id", id)
                : await client
                    .from("products")
                    .insert(payload);

        if (result.error) {

            msg(
                "productMessage",
                result.error.message,
                true
            );

            return;
        }

        msg(
            "productMessage",
            id
                ? "Product updated."
                : "Product added."
        );

        clearForm();

        await loadProducts();
    }
);

function clearForm() {

    [
        "productId",
        "productName",
        "productCategory",
        "productPrice",
        "productImage",
        "productDescription"
    ].forEach(id => {

        if ($(id))
            $(id).value = "";

    });
}

$("cancelEdit")
    .addEventListener(
        "click",
        clearForm
    );

$("refreshProducts")
    .addEventListener(
        "click",
        loadProducts
    );

/* =========================================================
   AFFILIATE CODE
========================================================= */

function createAffiliateCode() {

    const random =
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

    return "CHG-" + random;
}

function createReferralLink(code) {

    return (
        "https://smallbing7.github.io/clothinghubegypt/?ref=" +
        encodeURIComponent(code)
    );
}

/* =========================================================
   AFFILIATE APPLICATIONS
========================================================= */

async function loadAffiliates() {

    const {
        data,
        error
    } = await client
        .from("affiliate_applications")
        .select("*")
        .order("created_at", {
            ascending: false
        });

    if (error) {

        $("affiliateList").textContent =
            error.message;

        return;
    }

    if (!data.length) {

        $("affiliateList").innerHTML =
            "<p>No affiliate applications yet.</p>";

        return;
    }

    $("affiliateList").innerHTML =
        data.map(a => {

            const status =
                a.status || "pending";

            const code =
                a.affiliate_code || "";

            const link =
                a.referral_link || "";

            return `

            <div class="item">

                <strong>
                    ${esc(a.name)}
                </strong>

                <small>
                    ${esc(a.email)}
                    · WhatsApp:
                    ${esc(a.whatsapp)}
                    ·
                    ${esc(a.country)}
                </small>

                <p>
                    <strong>Status:</strong>
                    ${esc(status)}
                    <br>

                    <strong>Promotion:</strong>
                    ${esc(a.promotion_method || "")}
                    <br>

                    <strong>Audience:</strong>
                    ${esc(a.audience || "")}
                </p>

                ${
                    code
                        ? `
                        <p>
                            <strong>Affiliate Code:</strong>
                            ${esc(code)}
                            <br>

                            <strong>Referral Link:</strong>
                            <br>

                            <a
                                href="${esc(link)}"
                                target="_blank"
                                rel="noopener">
                                ${esc(link)}
                            </a>
                        </p>
                        `
                        : ""
                }

                <div class="itemActions">

                    ${
                        status !== "approved"
                            ? `
                            <button
                                onclick="approveAffiliate('${a.id}')">
                                Approve
                            </button>
                            `
                            : `
                            <button
                                onclick="copyAffiliateLink('${esc(link)}')">
                                Copy Link
                            </button>
                            `
                    }

                    ${
                        status !== "rejected"
                            ? `
                            <button
                                class="danger"
                                onclick="rejectAffiliate('${a.id}')">
                                Reject
                            </button>
                            `
                            : ""
                    }

                </div>

            </div>

            `;

        }).join("");
}

/* =========================================================
   APPROVE AFFILIATE
========================================================= */

window.approveAffiliate =
    async function (id) {

        const {
            data: existing,
            error: findError
        } = await client
            .from("affiliate_applications")
            .select("*")
            .eq("id", id)
            .single();

        if (findError) {

            alert(findError.message);

            return;
        }

        let code =
            existing.affiliate_code;

        if (!code)
            code = createAffiliateCode();

        const link =
            createReferralLink(code);

        const {
            error
        } = await client
            .from("affiliate_applications")
            .update({

                status: "approved",

                affiliate_code:
                    code,

                referral_link:
                    link,

                approved_at:
                    new Date().toISOString()

            })
            .eq("id", id);

        if (error) {

            alert(
                "Approval failed: " +
                error.message
            );

            return;
        }

        alert(
            "Affiliate approved!\n\nReferral link:\n" +
            link
        );

        await loadAffiliates();
    };

/* =========================================================
   REJECT
========================================================= */

window.rejectAffiliate =
    async function (id) {

        if (
            !confirm(
                "Reject this affiliate application?"
            )
        )
            return;

        const {
            error
        } = await client
            .from("affiliate_applications")
            .update({
                status: "rejected"
            })
            .eq("id", id);

        if (error) {

            alert(error.message);

            return;
        }

        await loadAffiliates();
    };

/* =========================================================
   COPY LINK
========================================================= */

window.copyAffiliateLink =
    async function (link) {

        try {

            await navigator.clipboard
                .writeText(link);

            alert(
                "Affiliate link copied."
            );

        } catch {

            prompt(
                "Copy affiliate link:",
                link
            );

        }
    };

/* =========================================================
   AFFILIATE STATISTICS
========================================================= */

async function loadAffiliateStats() {

    const [
        clicksResult,
        leadsResult
    ] = await Promise.all([

        client
            .from("affiliate_clicks")
            .select("affiliate_code"),

        client
            .from("affiliate_leads")
            .select("affiliate_code")

    ]);

    if (
        clicksResult.error ||
        leadsResult.error
    )
        return;

    const clicks =
        clicksResult.data || [];

    const leads =
        leadsResult.data || [];

    const stats =
        {};

    clicks.forEach(row => {

        if (!stats[row.affiliate_code])
            stats[row.affiliate_code] = {
                clicks: 0,
                leads: 0
            };

        stats[row.affiliate_code]
            .clicks++;
    });

    leads.forEach(row => {

        if (!stats[row.affiliate_code])
            stats[row.affiliate_code] = {
                clicks: 0,
                leads: 0
            };

        stats[row.affiliate_code]
            .leads++;
    });

    window.affiliateStats =
        stats;
}

/* =========================================================
   REFRESH
========================================================= */

$("refreshAffiliates")
    .addEventListener(
        "click",
        async () => {

            await loadAffiliates();
            await loadAffiliateStats();

        }
    );

/* =========================================================
   START
========================================================= */

requireAdmin();
