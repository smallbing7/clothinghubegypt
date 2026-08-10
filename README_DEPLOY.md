# Clothing Hub Egypt — deployment package

## Files
- index.html
- style.css
- script.js
- favicon.svg
- images/ (keep your existing image folder here)

## Image deployment
Upload the `images` folder beside `index.html` exactly like this:

```
/index.html
/style.css
/script.js
/favicon.svg
/images/hero.jpg
/images/product-men-tshirt.jpg
...
```

Hosting is case-sensitive. `product-men-tshirt.jpg` is different from `Product-Men-Tshirt.JPG`.

## Real login / OTP / affiliate submissions
The front-end is wired for Supabase Auth and a database table. In `script.js`, replace:
- `YOUR_SUPABASE_PROJECT_URL`
- `YOUR_SUPABASE_ANON_KEY`

Then enable Email Auth in Supabase. Create table `affiliate_applications` with columns:
- `user_id` uuid
- `name` text
- `email` text
- `whatsapp` text
- `country` text
- `promotion_method` text
- `audience` text
- `status` text

For production, enable Row Level Security and allow authenticated users to insert their own application (`user_id = auth.uid()`).

The account modal supports password login/signup and email OTP/magic-link.
Product images open in a full-screen lightbox.
