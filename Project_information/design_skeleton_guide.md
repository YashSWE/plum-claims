<!-- Design System -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>ClaimAdjudicate | User Dashboard</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-primary-fixed-variant": "#920029",
                        "surface-variant": "#e5e2e1",
                        "surface-container-lowest": "#ffffff",
                        "tertiary-fixed": "#80f9bd",
                        "on-surface-variant": "#5c3f41",
                        "secondary": "#a73544",
                        "surface-bright": "#fcf9f8",
                        "surface-container-low": "#f6f3f2",
                        "on-secondary-fixed-variant": "#871d2f",
                        "secondary-fixed-dim": "#ffb2b6",
                        "on-background": "#1b1c1c",
                        "surface": "#fcf9f8",
                        "primary": "#ba0036",
                        "on-tertiary": "#ffffff",
                        "inverse-primary": "#ffb2b6",
                        "background": "#fcf9f8",
                        "surface-container-high": "#eae7e7",
                        "on-primary": "#ffffff",
                        "secondary-container": "#fd7682",
                        "primary-container": "#e21e4a",
                        "error-container": "#ffdad6",
                        "primary-fixed": "#ffdada",
                        "on-error-container": "#93000a",
                        "inverse-on-surface": "#f3f0ef",
                        "tertiary": "#006a45",
                        "on-error": "#ffffff",
                        "on-primary-container": "#fffbff",
                        "on-tertiary-fixed-variant": "#005234",
                        "surface-container": "#f0eded",
                        "on-secondary-fixed": "#40000d",
                        "primary-fixed-dim": "#ffb2b6",
                        "on-secondary-container": "#710920",
                        "outline": "#906f70",
                        "secondary-fixed": "#ffdada",
                        "surface-dim": "#dcd9d9",
                        "inverse-surface": "#303030",
                        "tertiary-container": "#008558",
                        "tertiary-fixed-dim": "#62dca3",
                        "on-tertiary-container": "#f6fff6",
                        "on-secondary": "#ffffff",
                        "surface-tint": "#be0038",
                        "on-surface": "#1b1c1c",
                        "error": "#ba1a1a",
                        "on-primary-fixed": "#40000d",
                        "outline-variant": "#e5bdbe",
                        "on-tertiary-fixed": "#002113",
                        "surface-container-highest": "#e5e2e1"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "20px": "20px",
                        "full": "9999px"
                    },
                    "fontFamily": {
                        "headline": ["Inter"],
                        "body": ["Inter"],
                        "label": ["Inter"]
                    }
                },
            },
        }
    </script>
<style>
        body { font-family: 'Inter', sans-serif; background-color: #fcf9f8; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .glass-nav { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        .ambient-shadow { box-shadow: rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px; }
    </style>
</head>
<body class="text-on-background">
<!-- TopNavBar -->
<nav class="fixed top-0 w-full z-50 bg-[#fcf9f8]/90 dark:bg-stone-950/90 backdrop-blur-md shadow-[0_2px_6px_rgba(0,0,0,0.04)] border-b border-stone-200/20">
<div class="flex justify-between items-center px-8 h-20 max-w-[1440px] mx-auto">
<div class="flex items-center gap-8">
<span class="text-[#ba0036] font-bold text-2xl tracking-tighter">ClaimAdjudicate</span>
<div class="hidden md:flex items-center gap-6">
<a class="text-[#ba0036] font-bold border-b-2 border-[#ba0036] pb-4 font-['Inter'] font-medium text-sm tracking-tight" href="#">Claims</a>
<a class="text-stone-600 dark:text-stone-400 pb-4 font-['Inter'] font-medium text-sm tracking-tight hover:text-[#ba0036] transition-colors duration-200" href="#">Analytics</a>
<a class="text-stone-600 dark:text-stone-400 pb-4 font-['Inter'] font-medium text-sm tracking-tight hover:text-[#ba0036] transition-colors duration-200" href="#">Providers</a>
<a class="text-stone-600 dark:text-stone-400 pb-4 font-['Inter'] font-medium text-sm tracking-tight hover:text-[#ba0036] transition-colors duration-200" href="#">Settings</a>
</div>
</div>
<div class="flex items-center gap-4">
<div class="relative hidden lg:block">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">search</span>
<input class="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-2 focus:ring-primary w-64 transition-all" placeholder="Search claims..." type="text"/>
</div>
<button class="p-2 text-stone-600 hover:text-primary transition-all scale-95 active:opacity-80">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="p-2 text-stone-600 hover:text-primary transition-all scale-95 active:opacity-80">
<span class="material-symbols-outlined">account_circle</span>
</button>
</div>
</div>
</nav>
<main class="pt-24 pb-12 px-4 md:px-8 max-w-[1440px] mx-auto flex gap-8">
<!-- SideNavBar (Contextual Categories) -->
<aside class="hidden lg:flex flex-col w-64 p-4 space-y-2 bg-[#f6f3f2] dark:bg-stone-900 rounded-20px h-[calc(100vh-120px)] sticky top-24">
<div class="mb-6 px-2">
<h2 class="font-['Inter'] font-bold text-lg text-on-surface">Claim Types</h2>
<p class="text-xs text-stone-500">Adjudication Categories</p>
</div>
<a class="flex items-center gap-3 p-3 bg-white dark:bg-stone-800 text-[#ba0036] rounded-lg shadow-sm font-['Inter'] font-semibold text-sm transition-transform hover:translate-x-1 cursor-pointer" href="#">
<span class="material-symbols-outlined">medical_services</span>
                Consultation
            </a>
<a class="flex items-center gap-3 p-3 text-stone-500 hover:bg-stone-200/50 rounded-lg font-['Inter'] font-semibold text-sm transition-transform hover:translate-x-1 cursor-pointer" href="#">
<span class="material-symbols-outlined">medication</span>
                Pharmacy
            </a>
<a class="flex items-center gap-3 p-3 text-stone-500 hover:bg-stone-200/50 rounded-lg font-['Inter'] font-semibold text-sm transition-transform hover:translate-x-1 cursor-pointer" href="#">
<span class="material-symbols-outlined">biotech</span>
                Lab Test
            </a>
</aside>
<!-- Main Content Canvas -->
<section class="flex-1 space-y-10">
<!-- Hero Section -->
<div class="relative overflow-hidden rounded-20px bg-primary text-on-primary p-12 min-h-[320px] flex flex-col justify-end">
<img alt="" class="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30" data-alt="clean modern medical office with soft natural lighting and minimalist professional atmosphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0JV3F-t7az1ze7JR4FXLOorhP6G0UtnB32kAgQ9QqXq9v0n7zLiXXiHV78YVfIrHv1ixjA0bJv7TFHfBJRw_NwOfdcWDtiuuD1lYOn1WE4kp-k7eXEdgz8g6kIhgD0-NesUYWwYFcpRG0Dwb_aBF3vgQ34C155xobBNCyIY-XQcC11mWozZ4X9ly7_mc80BNSAJF9deaBlY5qiQhyjotZFbmnrissAuLfEEQLdywsAgqUeOILem-MnD0A5jP1gVfKMTjAvFYNqTQ"/>
<div class="relative z-10 max-w-2xl">
<span class="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 inline-block">Member Dashboard</span>
<h1 class="text-5xl font-extrabold tracking-tight mb-4">Welcome back, Alexandra</h1>
<p class="text-lg opacity-90 leading-relaxed">Your adjudication pipeline is moving efficiently. 4 new claim reviews are pending your final signature this morning.</p>
</div>
</div>
<!-- Summary Stats (Editorial Style) -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="bg-surface-container-lowest p-8 rounded-20px ambient-shadow flex justify-between items-center group hover:bg-surface-container-low transition-colors duration-300">
<div>
<p class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">Total Reimbursed</p>
<h3 class="text-4xl font-bold text-on-surface">$14,280.50</h3>
</div>
<div class="w-16 h-16 rounded-full bg-tertiary-container/10 flex items-center justify-center text-tertiary">
<span class="material-symbols-outlined text-3xl">account_balance_wallet</span>
</div>
</div>
<div class="bg-surface-container-lowest p-8 rounded-20px ambient-shadow flex justify-between items-center group hover:bg-surface-container-low transition-colors duration-300">
<div>
<p class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">Active Claims</p>
<h3 class="text-4xl font-bold text-on-surface">12</h3>
</div>
<div class="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-3xl">pending_actions</span>
</div>
</div>
</div>
<!-- Recent Claims Grid (Bento Style) -->
<div class="space-y-6">
<div class="flex justify-between items-end">
<h2 class="text-2xl font-bold tracking-tight">Recent Claims</h2>
<button class="text-primary font-bold text-sm hover:underline">View All Activity</button>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
<!-- Consultation Card -->
<div class="bg-surface-container-lowest rounded-20px overflow-hidden ambient-shadow flex flex-col hover:scale-[1.01] transition-all duration-300">
<div class="h-40 overflow-hidden relative">
<img alt="" class="w-full h-full object-cover" data-alt="close-up of a stethoscope on a clean white desk with soft warm sunlight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwQvcklFjQXyP41Nc39E_dFKAzCWXX50ajfR2hAyvtWpXNxUnHd9kdzTfVNBETZD8G8xXnj3k6OtIEIZ898nOhE_cXY77_-shCPr725Hy7DXL0nA_HTvVAeBLk7mLJ6cKe2wnLDU5oLMRbwuhZEyvHBvZ-napHU8Mqt5vGV2ELqigjcwsvO_57dmfuE5KKuT23xzFb3awny96WxBl5Ibobp1wYpA2LUD9EeJoeMk_1urTLvReEw0xzUuC8saOEAx92SSAmVenuEyo"/>
<span class="absolute top-4 right-4 bg-tertiary text-on-tertiary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">Approved</span>
</div>
<div class="p-6 space-y-4">
<div>
<h4 class="font-bold text-lg mb-1">General Consultation</h4>
<p class="text-sm text-stone-500">St. Mary's General Hospital</p>
</div>
<div class="flex justify-between items-center border-t border-stone-100 pt-4">
<span class="font-bold text-primary">$120.00</span>
<span class="text-xs text-stone-400">Oct 24, 2024</span>
</div>
</div>
</div>
<!-- Pharmacy Card -->
<div class="bg-surface-container-lowest rounded-20px overflow-hidden ambient-shadow flex flex-col hover:scale-[1.01] transition-all duration-300">
<div class="h-40 overflow-hidden relative">
<img alt="" class="w-full h-full object-cover" data-alt="neatly arranged medicine bottles on a pharmacy shelf with bright professional lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1vAv5Zg5msUjMMHvneK2SFhydubGfq-IwcwWXSz6ZI8hXbUME23yX1NGVLKtvcEzgkpCZqZfC1jawDzY_JeMFS9Q0pUXqnYlaSZoAXeHTS7SdgVZXFNsDMVFiHameDdidhGJB82mPQTUr_raNnphLyCaMJ0LJrW6Heq0C832C9rfV1Hf-5iOPWiS7e-QHBqnCCTYI7lElHsqKZlxz5quKORG36sFUvdwugK9VZWk9OSq1pI_bHvnOhPVzlWgquEztLzkkJINXeUE"/>
<span class="absolute top-4 right-4 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">Pending</span>
</div>
<div class="p-6 space-y-4">
<div>
<h4 class="font-bold text-lg mb-1">Prescription Refill</h4>
<p class="text-sm text-stone-500">City Center Pharmacy</p>
</div>
<div class="flex justify-between items-center border-t border-stone-100 pt-4">
<span class="font-bold text-primary">$45.50</span>
<span class="text-xs text-stone-400">Oct 22, 2024</span>
</div>
</div>
</div>
<!-- Lab Test Card -->
<div class="bg-surface-container-lowest rounded-20px overflow-hidden ambient-shadow flex flex-col hover:scale-[1.01] transition-all duration-300">
<div class="h-40 overflow-hidden relative">
<img alt="" class="w-full h-full object-cover" data-alt="modern laboratory equipment with blue lighting and scientific aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHDO2xzKV4N_4hWjgGPAWboMQaApHlJIKJZR5SSdjiiua5d9akkomj2Pw5Q-fXrg4F4zT88wXX_IRUSRfriVre_9BeMLmmlySSXhARXRVgLZOWoKZqph9tH3oBTY9BUJaUOWSos5MuIT7Zjxkk4dssNJw5c9UupItXj_-qcF7kVlypjRusLWDhn-LO3dY5WWC2XNAS46LFXzyUQFJ9yd43a6q8EGXc_YLwzWI0T2HwIoMwE63caH5Oz6cIavtNsHAUGSwos6W7ACw"/>
<span class="absolute top-4 right-4 bg-tertiary text-on-tertiary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">Approved</span>
</div>
<div class="p-6 space-y-4">
<div>
<h4 class="font-bold text-lg mb-1">Annual Blood Panel</h4>
<p class="text-sm text-stone-500">Pathology Diagnostics Ltd.</p>
</div>
<div class="flex justify-between items-center border-t border-stone-100 pt-4">
<span class="font-bold text-primary">$310.00</span>
<span class="text-xs text-stone-400">Oct 18, 2024</span>
</div>
</div>
</div>
</div>
</div>
<!-- Focus Action Card -->
<div class="bg-surface-container-low rounded-20px p-8 flex flex-col md:flex-row items-center gap-8 border-2 border-dashed border-outline-variant/30">
<div class="bg-white p-4 rounded-20px ambient-shadow">
<span class="material-symbols-outlined text-4xl text-primary" style="font-variation-settings: 'FILL' 1;">add_circle</span>
</div>
<div class="flex-1 text-center md:text-left">
<h3 class="text-xl font-bold mb-2">New Outpatient Claim?</h3>
<p class="text-stone-500 text-sm">Upload your receipts and medical reports. Our AI-driven engine will pre-verify your claim details in seconds.</p>
</div>
<button class="bg-primary hover:bg-primary-container text-on-primary px-8 py-3 rounded-lg font-bold transition-all shadow-lg active:scale-95">Start New Claim</button>
</div>
</section>
</main>
<!-- Footer -->
<footer class="w-full border-t border-stone-100 dark:border-stone-800 bg-[#fcf9f8] dark:bg-stone-950 mt-auto">
<div class="flex flex-col md:flex-row justify-between items-center px-8 py-12 w-full max-w-[1440px] mx-auto">
<span class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400 mb-4 md:mb-0">© 2024 Adjudicate Pro. Editorial Precision.</span>
<div class="flex gap-8">
<a class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-opacity opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
<a class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-opacity opacity-80 hover:opacity-100" href="#">Terms of Service</a>
<a class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-opacity opacity-80 hover:opacity-100" href="#">Help Center</a>
</div>
</div>
</footer>
<!-- FAB for quick action (Suppressed as per rules on detail/setting, but allowed on Home/Dashboard) -->
<button class="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
<span class="material-symbols-outlined text-3xl">add</span>
</button>
</body></html>

<!-- User Dashboard -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Claim Decision | ClaimAdjudicate</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-primary-fixed-variant": "#920029",
                        "surface-variant": "#e5e2e1",
                        "surface-container-lowest": "#ffffff",
                        "tertiary-fixed": "#80f9bd",
                        "on-surface-variant": "#5c3f41",
                        "secondary": "#a73544",
                        "surface-bright": "#fcf9f8",
                        "surface-container-low": "#f6f3f2",
                        "on-secondary-fixed-variant": "#871d2f",
                        "secondary-fixed-dim": "#ffb2b6",
                        "on-background": "#1b1c1c",
                        "surface": "#fcf9f8",
                        "primary": "#ba0036",
                        "on-tertiary": "#ffffff",
                        "inverse-primary": "#ffb2b6",
                        "background": "#fcf9f8",
                        "surface-container-high": "#eae7e7",
                        "on-primary": "#ffffff",
                        "secondary-container": "#fd7682",
                        "primary-container": "#e21e4a",
                        "error-container": "#ffdad6",
                        "primary-fixed": "#ffdada",
                        "on-error-container": "#93000a",
                        "inverse-on-surface": "#f3f0ef",
                        "tertiary": "#006a45",
                        "on-error": "#ffffff",
                        "on-primary-container": "#fffbff",
                        "on-tertiary-fixed-variant": "#005234",
                        "surface-container": "#f0eded",
                        "on-secondary-fixed": "#40000d",
                        "primary-fixed-dim": "#ffb2b6",
                        "on-secondary-container": "#710920",
                        "outline": "#906f70",
                        "secondary-fixed": "#ffdada",
                        "surface-dim": "#dcd9d9",
                        "inverse-surface": "#303030",
                        "tertiary-container": "#008558",
                        "tertiary-fixed-dim": "#62dca3",
                        "on-tertiary-container": "#f6fff6",
                        "on-secondary": "#ffffff",
                        "surface-tint": "#be0038",
                        "on-surface": "#1b1c1c",
                        "error": "#ba1a1a",
                        "on-primary-fixed": "#40000d",
                        "outline-variant": "#e5bdbe",
                        "on-tertiary-fixed": "#002113",
                        "surface-container-highest": "#e5e2e1"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "fontFamily": {
                        "headline": ["Inter"],
                        "body": ["Inter"],
                        "label": ["Inter"]
                    }
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .tonal-layering-no-borders {
            border-bottom-width: 0 !important;
        }
        .signature-shadow {
            box-shadow: rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px;
        }
        .glass-nav {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
        }
    </style>
</head>
<body class="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
<!-- TopNavBar Shell -->
<header class="fixed top-0 w-full z-50 glass-nav bg-[#fcf9f8]/90 dark:bg-stone-950/90 shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
<div class="flex justify-between items-center px-8 h-20 max-w-[1440px] mx-auto">
<div class="flex items-center gap-8">
<span class="text-[#ba0036] font-bold text-2xl tracking-tighter">ClaimAdjudicate</span>
<nav class="hidden md:flex gap-6 font-['Inter'] font-medium text-sm tracking-tight">
<a class="text-[#ba0036] font-bold border-b-2 border-[#ba0036] pb-4 transition-colors duration-200" href="#">Claims</a>
<a class="text-stone-600 dark:text-stone-400 pb-4 hover:text-[#ba0036] transition-colors duration-200" href="#">Analytics</a>
<a class="text-stone-600 dark:text-stone-400 pb-4 hover:text-[#ba0036] transition-colors duration-200" href="#">Providers</a>
<a class="text-stone-600 dark:text-stone-400 pb-4 hover:text-[#ba0036] transition-colors duration-200" href="#">Settings</a>
</nav>
</div>
<div class="flex items-center gap-4">
<button class="p-2 rounded-full hover:bg-surface-container-low transition-all scale-95 active:opacity-80">
<span class="material-symbols-outlined text-on-surface-variant" data-icon="notifications">notifications</span>
</button>
<button class="p-2 rounded-full hover:bg-surface-container-low transition-all scale-95 active:opacity-80">
<span class="material-symbols-outlined text-on-surface-variant" data-icon="account_circle">account_circle</span>
</button>
</div>
</div>
</header>
<main class="pt-28 pb-16 px-4 md:px-8 max-w-[1200px] mx-auto">
<!-- Hero Header -->
<div class="mb-12">
<span class="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Claim ID: #CAD-99210-24</span>
<h1 class="text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface mb-4">Claim Approved!</h1>
<p class="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed">Great news, your claim for the <span class="font-semibold text-on-surface">Comprehensive Health Screening</span> has been processed and fully approved. We've initiated the reimbursement to your account.</p>
</div>
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
<!-- Left Column: Status & Breakdown -->
<div class="lg:col-span-7 space-y-8">
<!-- Main Status Card -->
<section class="bg-surface-container-lowest p-8 rounded-[20px] signature-shadow relative overflow-hidden">
<div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
<div class="flex justify-between items-start mb-10">
<div>
<div class="flex items-center gap-2 mb-2">
<span class="material-symbols-outlined text-tertiary" data-icon="check_circle" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span class="text-sm font-bold text-tertiary uppercase tracking-wider">Payment Released</span>
</div>
<h2 class="text-4xl font-bold text-on-surface">$1,450.00</h2>
<p class="text-on-surface-variant">Reimbursed Amount</p>
</div>
<button class="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95">
<span class="material-symbols-outlined text-sm" data-icon="download">download</span>
                            Download Receipt
                        </button>
</div>
<div class="space-y-4">
<h3 class="font-bold text-lg text-on-surface border-b border-surface-container-low pb-2">Breakdown</h3>
<div class="flex justify-between items-center py-1">
<span class="text-on-surface-variant">Billed Amount</span>
<span class="font-medium">$1,600.00</span>
</div>
<div class="flex justify-between items-center py-1">
<span class="text-on-surface-variant">Policy Coverage (90.6%)</span>
<span class="font-medium text-tertiary">-$1,450.00</span>
</div>
<div class="flex justify-between items-center py-1">
<span class="text-on-surface-variant">Deductible Applied</span>
<span class="font-medium">$150.00</span>
</div>
<div class="flex justify-between items-center pt-4 border-t border-surface-container mt-4">
<span class="font-bold text-on-surface">Final Reimbursement</span>
<span class="text-2xl font-extrabold text-primary">$1,450.00</span>
</div>
</div>
</section>
<!-- Reasoning Section -->
<section class="bg-surface-container-low p-8 rounded-[20px] space-y-4">
<div class="flex items-center gap-3 mb-2">
<div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary signature-shadow">
<span class="material-symbols-outlined" data-icon="info">info</span>
</div>
<h3 class="text-xl font-bold">Why was this approved?</h3>
</div>
<div class="grid md:grid-cols-2 gap-6 pt-4">
<div class="space-y-2">
<p class="font-bold text-sm uppercase tracking-widest text-on-surface-variant">Policy Rule 1.4</p>
<p class="text-on-surface-variant leading-relaxed">Preventative screenings are 100% covered when performed by an in-network provider, minus your standard deductible.</p>
</div>
<div class="space-y-2">
<p class="font-bold text-sm uppercase tracking-widest text-on-surface-variant">Evidence Check</p>
<p class="text-on-surface-variant leading-relaxed">The submitted digital invoice matched our registered provider database for "Main Street Diagnostics Center".</p>
</div>
</div>
</section>
</div>
<!-- Right Column: Contextual Info & Actions -->
<div class="lg:col-span-5 space-y-8">
<!-- Side Summary Bento -->
<div class="grid grid-cols-1 gap-6">
<div class="bg-surface-container-highest p-6 rounded-[20px] flex items-center gap-4">
<div class="bg-white p-3 rounded-xl">
<span class="material-symbols-outlined text-primary" data-icon="calendar_today">calendar_today</span>
</div>
<div>
<p class="text-xs font-bold text-on-surface-variant uppercase">Processed On</p>
<p class="font-bold text-lg">October 24, 2024</p>
</div>
</div>
<!-- Image Bleed Concept -->
<div class="group relative bg-black rounded-[20px] overflow-hidden aspect-[16/9] signature-shadow">
<img alt="Modern healthcare facility with soft natural light" class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" data-alt="Modern high-end diagnostic medical facility interior with soft natural lighting and glass partitions in a professional healthcare setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ7UmyUj4mg4CvUQ0dkgDlDHEkVIiEJ7i0zvHvcm4PneIgIiuegL_n5gw3zdubCuVF58aBp3VxN4RM_WwilWk9KuPdNNYG6nVS2od2fmZoaDIaHL2DGs1piRCFbuPUpk1XInDODmgJ4Nih_qL_2HG7IRbxyYDJNXh7TT4p18zOpR6oZ-8mg66T1jPh6XY5Mqq8VXYkt4simgt4DkzSuF-sr7pqQaunsVLFr48V6ZSl-je3tVAD00m3upVGsFhUZZVfzjkIh_22J3Y"/>
<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
<p class="text-white font-medium">Main Street Diagnostics Center</p>
</div>
</div>
<div class="bg-surface-container-low p-8 rounded-[20px] border-l-4 border-primary">
<h4 class="font-bold text-lg mb-4">What's next?</h4>
<ul class="space-y-4">
<li class="flex gap-3">
<span class="text-primary font-bold">01</span>
<p class="text-on-surface-variant text-sm">The funds will appear in your bank account ending in **8842 within 3-5 business days.</p>
</li>
<li class="flex gap-3">
<span class="text-primary font-bold">02</span>
<p class="text-on-surface-variant text-sm">You'll receive an automated notification once the transfer is completed.</p>
</li>
<li class="flex gap-3">
<span class="text-primary font-bold">03</span>
<p class="text-on-surface-variant text-sm">Keep your receipt for your annual tax records under Medical Expenses.</p>
</li>
</ul>
</div>
<div class="flex flex-col gap-3">
<button class="w-full py-4 bg-surface-container-high hover:bg-surface-container text-on-surface font-bold rounded-xl transition-colors active:scale-[0.98]">
                            View Original Documents
                        </button>
<button class="w-full py-4 text-primary font-bold hover:underline">
                            Something wrong? File an Appeal
                        </button>
</div>
</div>
</div>
</div>
</main>
<!-- Footer Shell -->
<footer class="w-full border-t border-stone-100 dark:border-stone-800 bg-[#fcf9f8] dark:bg-stone-950 mt-auto">
<div class="flex flex-col md:flex-row justify-between items-center px-8 py-12 w-full max-w-[1440px] mx-auto">
<p class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400 mb-4 md:mb-0">© 2024 Adjudicate Pro. Editorial Precision.</p>
<div class="flex gap-8 font-['Inter'] text-xs uppercase tracking-widest text-stone-400">
<a class="hover:text-stone-900 dark:hover:text-stone-100 transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
<a class="hover:text-stone-900 dark:hover:text-stone-100 transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a>
<a class="hover:text-stone-900 dark:hover:text-stone-100 transition-colors opacity-80 hover:opacity-100" href="#">Help Center</a>
</div>
</div>
</footer>
</body></html>

<!-- Claim Decision (User) -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>ClaimAdjudicate - Submit Claim</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-primary-fixed-variant": "#920029",
                        "surface-variant": "#e5e2e1",
                        "surface-container-lowest": "#ffffff",
                        "tertiary-fixed": "#80f9bd",
                        "on-surface-variant": "#5c3f41",
                        "secondary": "#a73544",
                        "surface-bright": "#fcf9f8",
                        "surface-container-low": "#f6f3f2",
                        "on-secondary-fixed-variant": "#871d2f",
                        "secondary-fixed-dim": "#ffb2b6",
                        "on-background": "#1b1c1c",
                        "surface": "#fcf9f8",
                        "primary": "#ba0036",
                        "on-tertiary": "#ffffff",
                        "inverse-primary": "#ffb2b6",
                        "background": "#fcf9f8",
                        "surface-container-high": "#eae7e7",
                        "on-primary": "#ffffff",
                        "secondary-container": "#fd7682",
                        "primary-container": "#e21e4a",
                        "error-container": "#ffdad6",
                        "primary-fixed": "#ffdada",
                        "on-error-container": "#93000a",
                        "inverse-on-surface": "#f3f0ef",
                        "tertiary": "#006a45",
                        "on-error": "#ffffff",
                        "on-primary-container": "#fffbff",
                        "on-tertiary-fixed-variant": "#005234",
                        "surface-container": "#f0eded",
                        "on-secondary-fixed": "#40000d",
                        "primary-fixed-dim": "#ffb2b6",
                        "on-secondary-container": "#710920",
                        "outline": "#906f70",
                        "secondary-fixed": "#ffdada",
                        "surface-dim": "#dcd9d9",
                        "inverse-surface": "#303030",
                        "tertiary-container": "#008558",
                        "tertiary-fixed-dim": "#62dca3",
                        "on-tertiary-container": "#f6fff6",
                        "on-secondary": "#ffffff",
                        "surface-tint": "#be0038",
                        "on-surface": "#1b1c1c",
                        "error": "#ba1a1a",
                        "on-primary-fixed": "#40000d",
                        "outline-variant": "#e5bdbe",
                        "on-tertiary-fixed": "#002113",
                        "surface-container-highest": "#e5e2e1"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "2xl": "1.25rem",
                        "full": "9999px"
                    },
                    "fontFamily": {
                        "headline": ["Inter"],
                        "body": ["Inter"],
                        "label": ["Inter"]
                    }
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-nav {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
        }
    </style>
</head>
<body class="bg-surface text-on-surface font-body min-h-screen flex flex-col">
<!-- TopNavBar -->
<header class="fixed top-0 w-full z-50 border-b border-stone-200/20 bg-[#fcf9f8]/90 dark:bg-stone-950/90 backdrop-blur-md shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
<div class="flex justify-between items-center px-8 h-20 max-w-[1440px] mx-auto">
<div class="flex items-center gap-12">
<span class="text-[#ba0036] font-bold text-2xl tracking-tighter">ClaimAdjudicate</span>
<nav class="hidden md:flex gap-8 items-center">
<a class="text-[#ba0036] font-bold border-b-2 border-[#ba0036] pb-4 font-['Inter'] font-medium text-sm tracking-tight transition-colors duration-200" href="#">Claims</a>
<a class="text-stone-600 dark:text-stone-400 pb-4 font-['Inter'] font-medium text-sm tracking-tight hover:text-[#ba0036] transition-colors duration-200" href="#">Analytics</a>
<a class="text-stone-600 dark:text-stone-400 pb-4 font-['Inter'] font-medium text-sm tracking-tight hover:text-[#ba0036] transition-colors duration-200" href="#">Providers</a>
<a class="text-stone-600 dark:text-stone-400 pb-4 font-['Inter'] font-medium text-sm tracking-tight hover:text-[#ba0036] transition-colors duration-200" href="#">Settings</a>
</nav>
</div>
<div class="flex items-center gap-6">
<button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-all scale-95 active:opacity-80">notifications</button>
<button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-all scale-95 active:opacity-80">account_circle</button>
</div>
</div>
</header>
<main class="flex-grow pt-32 pb-20 px-4 md:px-8 max-w-[1200px] mx-auto w-full">
<!-- Progress Stepper -->
<div class="flex items-center justify-between mb-12 max-w-2xl mx-auto">
<div class="flex flex-col items-center gap-2">
<div class="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shadow-md">1</div>
<span class="text-xs font-bold text-primary uppercase tracking-widest">Documents</span>
</div>
<div class="h-px flex-grow bg-outline-variant mx-4 mb-6"></div>
<div class="flex flex-col items-center gap-2">
<div class="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold">2</div>
<span class="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Information</span>
</div>
<div class="h-px flex-grow bg-outline-variant/30 mx-4 mb-6"></div>
<div class="flex flex-col items-center gap-2">
<div class="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold">3</div>
<span class="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Review</span>
</div>
</div>
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
<!-- Policy Context Panel -->
<div class="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
<div class="bg-surface-container-low p-8 rounded-2xl shadow-[0_0_0_1px_rgba(0,0,0,0.02)]">
<h2 class="text-2xl font-bold text-on-surface mb-4 tracking-tight">Submission Guidelines</h2>
<p class="text-on-surface-variant leading-relaxed mb-6">
                        Ensure all clinical documentation includes the provider's NPI number and a valid ICD-10 code for accelerated adjudication.
                    </p>
<div class="space-y-4">
<div class="flex gap-4">
<span class="material-symbols-outlined text-primary">verified_user</span>
<div>
<p class="font-bold text-sm">Policy ID: PREM-8829</p>
<p class="text-xs text-on-surface-variant uppercase tracking-wider">Premium Care Plus Plan</p>
</div>
</div>
<div class="flex gap-4">
<span class="material-symbols-outlined text-primary">info</span>
<div>
<p class="font-bold text-sm">Max Coverage</p>
<p class="text-xs text-on-surface-variant uppercase tracking-wider">Up to $50,000 per incident</p>
</div>
</div>
</div>
<div class="mt-8 pt-8 border-t border-outline-variant/20">
<img class="w-full h-40 object-cover rounded-xl grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700" data-alt="Modern minimalist office space with warm wooden desk, organized paper documents and professional workspace aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_lHTsVj3iL_79vLE5VDq0LBoHnXf5L3eqw-wmFQijKzsgzp_g5SyqR7yBR6pJgrP4jbXtJZgjGp5BIkh-h6j_sPMn1SB2zL_QPpnnA9ik-30qVokpXskbsELbAJe6drpf1qJwpf3M-nCr9XnsJ4FF8znT68v4bY0-h_azMMapS208L1yzHdpxo0yYvhhwE27qhPOmlzdG0iFMLGyW5huLXQ_6DM9xsEjltkkREfpEOx2W0z3lpsdhFmLPEACNu1YOfXMCRHC_geU"/>
</div>
</div>
</div>
<!-- Form Content -->
<div class="lg:col-span-8 space-y-8">
<!-- Step 1: Upload Documents -->
<section class="bg-surface-container-lowest p-8 md:p-10 rounded-2xl shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
<div class="mb-8">
<h1 class="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Upload Claim Documents</h1>
<p class="text-on-surface-variant">Please provide digital copies of invoices, prescriptions, or clinical notes.</p>
</div>
<div class="group relative flex flex-col items-center justify-center border-2 border-dashed border-outline-variant rounded-2xl p-12 bg-surface-container-low/30 hover:bg-surface-container-low/50 hover:border-primary transition-all duration-300 cursor-pointer">
<div class="bg-surface-container-lowest w-16 h-16 rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
<span class="material-symbols-outlined text-primary text-3xl">upload_file</span>
</div>
<h3 class="text-lg font-bold mb-2">Drag and drop files here</h3>
<p class="text-on-surface-variant text-sm mb-6">Or click to browse from your computer</p>
<span class="text-[10px] uppercase font-bold tracking-[0.2em] text-on-surface-variant opacity-50">Supported: PDF, JPG, PNG (Max 10MB)</span>
</div>
<div class="mt-8 space-y-3">
<div class="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-primary">description</span>
<div>
<p class="text-sm font-bold">hospital_invoice_042.pdf</p>
<p class="text-xs text-on-surface-variant">2.4 MB • Uploaded</p>
</div>
</div>
<button class="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors">close</button>
</div>
</div>
</section>
<!-- Step 2: Basic Info (Quick Preview for Wizard context) -->
<section class="bg-surface-container-lowest p-8 md:p-10 rounded-2xl shadow-[0_2px_6px_rgba(0,0,0,0.04)] opacity-50">
<div class="flex items-center justify-between mb-8">
<h2 class="text-2xl font-bold tracking-tight text-on-surface">Basic Information</h2>
<span class="text-xs font-bold text-on-surface-variant uppercase bg-surface-container-high px-3 py-1 rounded-full">Locked</span>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="space-y-2">
<label class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Provider Name</label>
<div class="w-full h-12 bg-surface-container-low rounded-lg"></div>
</div>
<div class="space-y-2">
<label class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Date of Service</label>
<div class="w-full h-12 bg-surface-container-low rounded-lg"></div>
</div>
<div class="md:col-span-2 space-y-2">
<label class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Description of Symptoms</label>
<div class="w-full h-24 bg-surface-container-low rounded-lg"></div>
</div>
</div>
</section>
<!-- Action Bar -->
<div class="flex items-center justify-between pt-4">
<button class="px-8 py-3 rounded-lg font-bold text-on-surface hover:bg-surface-container-high transition-all">
                        Cancel Submission
                    </button>
<button class="bg-gradient-to-r from-primary to-primary-container text-on-primary px-10 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] transition-all">
                        Next: Claim Details
                    </button>
</div>
</div>
</div>
</main>
<!-- Footer -->
<footer class="w-full border-t border-stone-100 dark:border-stone-800 bg-[#fcf9f8] dark:bg-stone-950 mt-auto">
<div class="flex flex-col md:flex-row justify-between items-center px-8 py-12 w-full max-w-[1440px] mx-auto">
<p class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400">© 2024 Adjudicate Pro. Editorial Precision.</p>
<div class="flex gap-8 mt-6 md:mt-0">
<a class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
<a class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a>
<a class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors opacity-80 hover:opacity-100" href="#">Help Center</a>
</div>
</div>
</footer>
</body></html>

<!-- Claim Submission -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Claim Details Confirmation | ClaimAdjudicate</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-primary-fixed-variant": "#920029",
                    "surface-variant": "#e5e2e1",
                    "surface-container-lowest": "#ffffff",
                    "tertiary-fixed": "#80f9bd",
                    "on-surface-variant": "#5c3f41",
                    "secondary": "#a73544",
                    "surface-bright": "#fcf9f8",
                    "surface-container-low": "#f6f3f2",
                    "on-secondary-fixed-variant": "#871d2f",
                    "secondary-fixed-dim": "#ffb2b6",
                    "on-background": "#1b1c1c",
                    "surface": "#fcf9f8",
                    "primary": "#ba0036",
                    "on-tertiary": "#ffffff",
                    "inverse-primary": "#ffb2b6",
                    "background": "#fcf9f8",
                    "surface-container-high": "#eae7e7",
                    "on-primary": "#ffffff",
                    "secondary-container": "#fd7682",
                    "primary-container": "#e21e4a",
                    "error-container": "#ffdad6",
                    "primary-fixed": "#ffdada",
                    "on-error-container": "#93000a",
                    "inverse-on-surface": "#f3f0ef",
                    "tertiary": "#006a45",
                    "on-error": "#ffffff",
                    "on-primary-container": "#fffbff",
                    "on-tertiary-fixed-variant": "#005234",
                    "surface-container": "#f0eded",
                    "on-secondary-fixed": "#40000d",
                    "primary-fixed-dim": "#ffb2b6",
                    "on-secondary-container": "#710920",
                    "outline": "#906f70",
                    "secondary-fixed": "#ffdada",
                    "surface-dim": "#dcd9d9",
                    "inverse-surface": "#303030",
                    "tertiary-container": "#008558",
                    "tertiary-fixed-dim": "#62dca3",
                    "on-tertiary-container": "#f6fff6",
                    "on-secondary": "#ffffff",
                    "surface-tint": "#be0038",
                    "on-surface": "#1b1c1c",
                    "error": "#ba1a1a",
                    "on-primary-fixed": "#40000d",
                    "outline-variant": "#e5bdbe",
                    "on-tertiary-fixed": "#002113",
                    "surface-container-highest": "#e5e2e1"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Inter"],
                    "body": ["Inter"],
                    "label": ["Inter"]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .tonal-layering-no-borders {
            border: none !important;
        }
        .signature-shadow {
            box-shadow: rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px;
        }
    </style>
</head>
<body class="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container">
<!-- TopNavBar -->
<nav class="fixed top-0 w-full z-50 bg-[#fcf9f8]/90 dark:bg-stone-950/90 backdrop-blur-md tonal-layering-no-borders shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
<div class="flex justify-between items-center px-8 h-20 max-w-[1440px] mx-auto">
<div class="flex items-center gap-8">
<span class="text-[#ba0036] font-bold text-2xl tracking-tighter">ClaimAdjudicate</span>
<div class="hidden md:flex items-center gap-6">
<a class="text-[#ba0036] font-bold border-b-2 border-[#ba0036] pb-4 font-['Inter'] text-sm tracking-tight" href="#">Claims</a>
<a class="text-stone-600 dark:text-stone-400 pb-4 font-['Inter'] text-sm tracking-tight hover:text-[#ba0036] transition-colors duration-200" href="#">Analytics</a>
<a class="text-stone-600 dark:text-stone-400 pb-4 font-['Inter'] text-sm tracking-tight hover:text-[#ba0036] transition-colors duration-200" href="#">Providers</a>
<a class="text-stone-600 dark:text-stone-400 pb-4 font-['Inter'] text-sm tracking-tight hover:text-[#ba0036] transition-colors duration-200" href="#">Settings</a>
</div>
</div>
<div class="flex items-center gap-4">
<button class="p-2 text-stone-600 hover:text-primary transition-all scale-95 active:opacity-80">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button class="p-2 text-stone-600 hover:text-primary transition-all scale-95 active:opacity-80">
<span class="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</button>
</div>
</div>
</nav>
<main class="pt-28 pb-12 px-8 max-w-[1440px] mx-auto min-h-screen">
<header class="mb-10 flex justify-between items-end">
<div class="max-w-2xl">
<span class="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Step 2 of 3</span>
<h1 class="text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-4">Confirm Claim Details</h1>
<p class="text-lg text-stone-500 font-medium leading-relaxed">Our AI has extracted the following information from your document. Please verify the accuracy before final submission.</p>
</div>
<div class="hidden lg:flex gap-3">
<button class="px-6 py-3 rounded-xl bg-surface-container-high text-on-surface font-bold hover:bg-surface-container transition-all">Cancel</button>
<button class="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold shadow-md hover:opacity-90 transition-all">Submit for Review</button>
</div>
</header>
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
<!-- Left: Document Viewer (Asymmetric Bleed) -->
<section class="lg:col-span-7 relative group">
<div class="bg-surface-container-low rounded-2xl overflow-hidden signature-shadow relative min-h-[700px] flex items-center justify-center border border-stone-100">
<img class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" data-alt="close-up of a high-quality medical prescription document on clean white paper with handwritten notes and official medical seals" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcDh1Ej5LYoL2mvx3AEdF5JsZexN6c-qq-IEGepM09t8MPMEf42izM5YG_HUNyA0v-hZQlJZCzsC7ni-c836vmkahZXSkCUn_o_vROII4Ju6RsIzkWJaU7GXcSuZmqMoA_-xb2RFixxkUQEFWBnkMngBJBF2L0x4sJMr2FQd246pSrEFrwfefKGpkQVYyIStu20U1Opkj6JkFRlTJUd0zXE4iYLt0FUoo91Qts4vaq3lHDsVMXfTeG641HIouhWYg6amBPhNve8eU"/>
<!-- Extraction Highlights (Simulated) -->
<div class="absolute top-[12%] left-[15%] w-[30%] h-[5%] border-2 border-primary/60 bg-primary/10 rounded-md shadow-[0_0_0_2px_rgba(186,0,54,0.1)] flex items-center px-2">
<span class="text-[10px] bg-primary text-white px-1 rounded absolute -top-4 left-0 font-bold">DOCTOR</span>
</div>
<div class="absolute top-[25%] left-[60%] w-[25%] h-[4%] border-2 border-primary/60 bg-primary/10 rounded-md shadow-[0_0_0_2px_rgba(186,0,54,0.1)] flex items-center px-2">
<span class="text-[10px] bg-primary text-white px-1 rounded absolute -top-4 left-0 font-bold">DATE</span>
</div>
<div class="absolute bottom-[20%] right-[10%] w-[20%] h-[8%] border-2 border-primary/60 bg-primary/10 rounded-md shadow-[0_0_0_2px_rgba(186,0,54,0.1)] flex items-center px-2">
<span class="text-[10px] bg-primary text-white px-1 rounded absolute -top-4 left-0 font-bold">AMOUNT</span>
</div>
<!-- Overlay Tools -->
<div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center bg-white/80 backdrop-blur-md px-4 py-2 rounded-full gap-4 signature-shadow">
<button class="p-2 hover:bg-stone-100 rounded-full transition-colors"><span class="material-symbols-outlined" data-icon="zoom_in">zoom_in</span></button>
<div class="w-px h-4 bg-stone-200"></div>
<button class="p-2 hover:bg-stone-100 rounded-full transition-colors"><span class="material-symbols-outlined" data-icon="zoom_out">zoom_out</span></button>
<div class="w-px h-4 bg-stone-200"></div>
<button class="p-2 hover:bg-stone-100 rounded-full transition-colors"><span class="material-symbols-outlined" data-icon="rotate_right">rotate_right</span></button>
</div>
</div>
<div class="mt-4 flex items-center gap-2 text-stone-400">
<span class="material-symbols-outlined text-sm" data-icon="info">info</span>
<span class="text-xs font-medium uppercase tracking-wider">Document: INV-2024-089.pdf • Confidence Score: 98.4%</span>
</div>
</section>
<!-- Right: Extracted Data Form (Tonal Nesting) -->
<section class="lg:col-span-5 flex flex-col gap-6">
<div class="bg-surface-container-lowest rounded-2xl p-8 signature-shadow relative overflow-hidden">
<div class="absolute top-0 left-0 w-2 h-full bg-primary"></div>
<div class="flex items-center justify-between mb-8">
<h2 class="text-2xl font-bold tracking-tight">Extracted Information</h2>
<span class="bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
<span class="material-symbols-outlined text-xs" data-icon="verified" style="font-variation-settings: 'FILL' 1;">verified</span>
                            AI VERIFIED
                        </span>
</div>
<div class="space-y-8">
<!-- Doctor Name -->
<div class="group">
<div class="flex justify-between items-center mb-2">
<label class="text-xs font-bold uppercase tracking-widest text-stone-400">Doctor Name</label>
<button class="text-primary text-xs font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
</div>
<div class="p-4 bg-surface-container-low rounded-xl border-b-2 border-outline-variant focus-within:border-primary transition-all">
<p class="text-lg font-semibold text-on-surface">Dr. Julianne Abernathy</p>
</div>
</div>
<!-- Date -->
<div class="group">
<div class="flex justify-between items-center mb-2">
<label class="text-xs font-bold uppercase tracking-widest text-stone-400">Consultation Date</label>
<button class="text-primary text-xs font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
</div>
<div class="p-4 bg-surface-container-low rounded-xl border-b-2 border-outline-variant focus-within:border-primary transition-all">
<p class="text-lg font-semibold text-on-surface">October 24, 2023</p>
</div>
</div>
<!-- Diagnosis -->
<div class="group">
<div class="flex justify-between items-center mb-2">
<label class="text-xs font-bold uppercase tracking-widest text-stone-400">Diagnosis / Description</label>
<button class="text-primary text-xs font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
</div>
<div class="p-4 bg-surface-container-low rounded-xl border-b-2 border-outline-variant focus-within:border-primary transition-all">
<p class="text-lg font-semibold text-on-surface">Acute Respiratory Infection (ICD-10 J06.9)</p>
</div>
</div>
<!-- Amount -->
<div class="group">
<div class="flex justify-between items-center mb-2">
<label class="text-xs font-bold uppercase tracking-widest text-stone-400">Total Amount</label>
<button class="text-primary text-xs font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
</div>
<div class="p-4 bg-surface-container-low rounded-xl border-b-2 border-outline-variant focus-within:border-primary transition-all flex items-baseline gap-1">
<span class="text-sm font-bold text-stone-500">$</span>
<p class="text-3xl font-extrabold text-on-surface">425.00</p>
</div>
</div>
</div>
</div>
<!-- Summary Breakdown (Glass Card) -->
<div class="bg-surface-container-high/50 backdrop-blur-md rounded-2xl p-6 signature-shadow">
<h3 class="text-sm font-bold uppercase tracking-widest text-stone-500 mb-4">Coverage Estimate</h3>
<div class="space-y-3">
<div class="flex justify-between items-center text-sm">
<span class="text-stone-600">Plan Coverage (80%)</span>
<span class="font-bold text-on-surface">$340.00</span>
</div>
<div class="flex justify-between items-center text-sm">
<span class="text-stone-600">Deductible Applied</span>
<span class="font-bold text-on-surface">-$0.00</span>
</div>
<div class="pt-3 border-t border-stone-200 flex justify-between items-center">
<span class="text-on-surface font-bold">Estimated Reimbursement</span>
<span class="text-2xl font-black text-primary">$340.00</span>
</div>
</div>
</div>
<!-- Footer Action (Mobile Only Visible) -->
<div class="flex flex-col gap-3 lg:hidden mt-4">
<button class="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold shadow-lg text-lg">Confirm and Submit</button>
<button class="w-full py-4 rounded-xl bg-surface-container-high text-on-surface font-bold">Save Draft</button>
</div>
</section>
</div>
</main>
<!-- Footer -->
<footer class="w-full border-t border-stone-100 dark:border-stone-800 bg-[#fcf9f8] dark:bg-stone-950 mt-auto">
<div class="flex flex-col md:flex-row justify-between items-center px-8 py-12 w-full max-w-[1440px] mx-auto">
<div class="flex items-center gap-6 mb-6 md:mb-0">
<span class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400">© 2024 Adjudicate Pro. Editorial Precision.</span>
</div>
<div class="flex gap-8">
<a class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-all opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
<a class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-all opacity-80 hover:opacity-100" href="#">Terms of Service</a>
<a class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-all opacity-80 hover:opacity-100" href="#">Help Center</a>
</div>
</div>
</footer>
</body></html>

<!-- Details Confirmation -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>ClaimAdjudicate | Admin Dashboard</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-primary-fixed-variant": "#920029",
                        "surface-variant": "#e5e2e1",
                        "surface-container-lowest": "#ffffff",
                        "tertiary-fixed": "#80f9bd",
                        "on-surface-variant": "#5c3f41",
                        "secondary": "#a73544",
                        "surface-bright": "#fcf9f8",
                        "surface-container-low": "#f6f3f2",
                        "on-secondary-fixed-variant": "#871d2f",
                        "secondary-fixed-dim": "#ffb2b6",
                        "on-background": "#1b1c1c",
                        "surface": "#fcf9f8",
                        "primary": "#ba0036",
                        "on-tertiary": "#ffffff",
                        "inverse-primary": "#ffb2b6",
                        "background": "#fcf9f8",
                        "surface-container-high": "#eae7e7",
                        "on-primary": "#ffffff",
                        "secondary-container": "#fd7682",
                        "primary-container": "#e21e4a",
                        "error-container": "#ffdad6",
                        "primary-fixed": "#ffdada",
                        "on-error-container": "#93000a",
                        "inverse-on-surface": "#f3f0ef",
                        "tertiary": "#006a45",
                        "on-error": "#ffffff",
                        "on-primary-container": "#fffbff",
                        "on-tertiary-fixed-variant": "#005234",
                        "surface-container": "#f0eded",
                        "on-secondary-fixed": "#40000d",
                        "primary-fixed-dim": "#ffb2b6",
                        "on-secondary-container": "#710920",
                        "outline": "#906f70",
                        "secondary-fixed": "#ffdada",
                        "surface-dim": "#dcd9d9",
                        "inverse-surface": "#303030",
                        "tertiary-container": "#008558",
                        "tertiary-fixed-dim": "#62dca3",
                        "on-tertiary-container": "#f6fff6",
                        "on-secondary": "#ffffff",
                        "surface-tint": "#be0038",
                        "on-surface": "#1b1c1c",
                        "error": "#ba1a1a",
                        "on-primary-fixed": "#40000d",
                        "outline-variant": "#e5bdbe",
                        "on-tertiary-fixed": "#002113",
                        "surface-container-highest": "#e5e2e1"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "fontFamily": {
                        "headline": ["Inter"],
                        "body": ["Inter"],
                        "label": ["Inter"]
                    }
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body { font-family: 'Inter', sans-serif; background-color: #fcf9f8; color: #1b1c1c; }
        .glass-nav { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        .tonal-lift { box-shadow: rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e5e2e1; border-radius: 10px; }
    </style>
</head>
<body class="bg-surface text-on-surface overflow-x-hidden">
<!-- TopNavBar -->
<nav class="fixed top-0 w-full z-50 border-b border-stone-200/20 bg-[#fcf9f8]/90 backdrop-blur-md shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
<div class="flex justify-between items-center px-8 h-20 max-w-[1440px] mx-auto">
<div class="flex items-center gap-8">
<span class="text-[#ba0036] font-bold text-2xl tracking-tighter">ClaimAdjudicate</span>
<div class="hidden md:flex gap-6 items-center pt-4">
<a class="text-[#ba0036] font-bold border-b-2 border-[#ba0036] pb-4 font-['Inter'] font-medium text-sm tracking-tight transition-colors duration-200" href="#">Claims</a>
<a class="text-stone-600 dark:text-stone-400 pb-4 font-['Inter'] font-medium text-sm tracking-tight hover:text-[#ba0036] transition-colors duration-200" href="#">Analytics</a>
<a class="text-stone-600 dark:text-stone-400 pb-4 font-['Inter'] font-medium text-sm tracking-tight hover:text-[#ba0036] transition-colors duration-200" href="#">Providers</a>
<a class="text-stone-600 dark:text-stone-400 pb-4 font-['Inter'] font-medium text-sm tracking-tight hover:text-[#ba0036] transition-colors duration-200" href="#">Settings</a>
</div>
</div>
<div class="flex items-center gap-4">
<button class="p-2 text-stone-600 hover:text-[#ba0036] transition-all scale-95 active:opacity-80">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="p-2 text-stone-600 hover:text-[#ba0036] transition-all scale-95 active:opacity-80">
<span class="material-symbols-outlined">account_circle</span>
</button>
</div>
</div>
</nav>
<div class="pt-24 pb-12 flex max-w-[1440px] mx-auto min-h-screen">
<!-- SideNavBar -->
<aside class="hidden md:flex flex-col w-64 p-4 space-y-2 bg-[#f6f3f2] rounded-xl m-4 h-[calc(100vh-120px)] shadow-[0_4_8px_rgba(0,0,0,0.1)] sticky top-24">
<div class="px-4 py-6">
<h2 class="font-['Inter'] font-semibold text-sm text-[#ba0036]">Claim Types</h2>
<p class="text-xs text-stone-500">Adjudication Categories</p>
</div>
<div class="space-y-1">
<div class="flex items-center gap-3 p-3 bg-white text-[#ba0036] rounded-lg shadow-sm font-['Inter'] font-semibold text-sm cursor-pointer hover:translate-x-1 transition-transform">
<span class="material-symbols-outlined">medical_services</span>
<span>Consultation</span>
</div>
<div class="flex items-center gap-3 p-3 text-stone-500 hover:bg-stone-200/50 rounded-lg font-['Inter'] font-semibold text-sm cursor-pointer hover:translate-x-1 transition-transform">
<span class="material-symbols-outlined">medication</span>
<span>Pharmacy</span>
</div>
<div class="flex items-center gap-3 p-3 text-stone-500 hover:bg-stone-200/50 rounded-lg font-['Inter'] font-semibold text-sm cursor-pointer hover:translate-x-1 transition-transform">
<span class="material-symbols-outlined">biotech</span>
<span>Lab Test</span>
</div>
</div>
</aside>
<!-- Main Content -->
<main class="flex-1 px-8">
<!-- Header Section -->
<div class="mb-10">
<h1 class="text-4xl font-extrabold tracking-tight mb-2">Manager Overview</h1>
<p class="text-stone-500 text-lg">System-wide performance and high-priority claim queue.</p>
</div>
<!-- Bento Grid Metrics -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
<div class="bg-surface-container-lowest p-8 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.04)] border border-stone-200/20 relative overflow-hidden group">
<div class="flex justify-between items-start mb-4">
<span class="material-symbols-outlined text-primary text-3xl">assignment</span>
<span class="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">+12%</span>
</div>
<p class="text-stone-500 font-medium text-sm mb-1 uppercase tracking-wider">Total Claims</p>
<h3 class="text-4xl font-bold">14,282</h3>
<div class="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined text-8xl">assessment</span>
</div>
</div>
<div class="bg-surface-container-lowest p-8 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.04)] border border-stone-200/20 group">
<div class="flex justify-between items-start mb-4">
<span class="material-symbols-outlined text-tertiary text-3xl">auto_awesome</span>
<span class="bg-tertiary/10 text-tertiary text-xs font-bold px-2 py-1 rounded">Optimal</span>
</div>
<p class="text-stone-500 font-medium text-sm mb-1 uppercase tracking-wider">AI Success Rate</p>
<h3 class="text-4xl font-bold">98.4%</h3>
<div class="mt-4 w-full bg-stone-100 h-2 rounded-full overflow-hidden">
<div class="bg-tertiary h-full rounded-full w-[98.4%]"></div>
</div>
</div>
<div class="bg-surface-container-lowest p-8 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.04)] border border-stone-200/20 group">
<div class="flex justify-between items-start mb-4">
<span class="material-symbols-outlined text-secondary text-3xl">pending_actions</span>
<span class="bg-error-container text-error text-xs font-bold px-2 py-1 rounded">Urgent</span>
</div>
<p class="text-stone-500 font-medium text-sm mb-1 uppercase tracking-wider">Pending Review</p>
<h3 class="text-4xl font-bold">142</h3>
<p class="text-xs text-stone-400 mt-2">Avg. wait time: 4.2 mins</p>
</div>
</div>
<!-- Dashboard Body: Asymmetric Layout -->
<div class="flex flex-col lg:flex-row gap-8">
<!-- Main Claim List (Filtered) -->
<div class="flex-1">
<div class="bg-surface-container-lowest rounded-xl shadow-[0_4px_8px_rgba(0,0,0,0.1)] overflow-hidden">
<div class="p-6 border-b border-stone-100 flex justify-between items-center bg-white/50">
<h2 class="text-xl font-bold">High Priority Queue</h2>
<div class="flex gap-2">
<button class="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low text-xs font-bold rounded-lg hover:bg-surface-container-high transition-colors">
<span class="material-symbols-outlined text-sm">filter_list</span>
                                    High Risk
                                </button>
<button class="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low text-xs font-bold rounded-lg hover:bg-surface-container-high transition-colors">
<span class="material-symbols-outlined text-sm">tune</span>
                                    Low Confidence
                                </button>
</div>
</div>
<div class="divide-y divide-stone-100">
<!-- Claim Row 1 -->
<div class="p-6 hover:bg-stone-50/50 transition-colors cursor-pointer group">
<div class="flex items-start justify-between">
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
<span class="material-symbols-outlined text-stone-400">person</span>
</div>
<div>
<h4 class="font-bold text-lg">Claim #94821 — Alexander Chen</h4>
<p class="text-sm text-stone-500">Advanced Imaging Services • $1,240.00</p>
</div>
</div>
<div class="flex flex-col items-end gap-2">
<span class="bg-error-container text-error text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">High Risk</span>
<span class="text-xs text-stone-400">2 mins ago</span>
</div>
</div>
<div class="mt-4 flex gap-4">
<div class="flex items-center gap-1.5 text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">
<span class="material-symbols-outlined text-sm">warning</span>
                                        AI Confidence: 42%
                                    </div>
<div class="flex items-center gap-1.5 text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">
<span class="material-symbols-outlined text-sm">history</span>
                                        Multiple Submissions
                                    </div>
</div>
</div>
<!-- Claim Row 2 -->
<div class="p-6 hover:bg-stone-50/50 transition-colors cursor-pointer group">
<div class="flex items-start justify-between">
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
<span class="material-symbols-outlined text-stone-400">person</span>
</div>
<div>
<h4 class="font-bold text-lg">Claim #94819 — Elena Rodriguez</h4>
<p class="text-sm text-stone-500">Specialist Consultation • $350.00</p>
</div>
</div>
<div class="flex flex-col items-end gap-2">
<span class="bg-surface-container-high text-stone-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">Low Confidence</span>
<span class="text-xs text-stone-400">14 mins ago</span>
</div>
</div>
<div class="mt-4 flex gap-4">
<div class="flex items-center gap-1.5 text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">
<span class="material-symbols-outlined text-sm">analytics</span>
                                        AI Confidence: 68%
                                    </div>
</div>
</div>
<!-- Claim Row 3 -->
<div class="p-6 hover:bg-stone-50/50 transition-colors cursor-pointer group">
<div class="flex items-start justify-between">
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
<span class="material-symbols-outlined text-stone-400">person</span>
</div>
<div>
<h4 class="font-bold text-lg">Claim #94802 — Marcus Sterling</h4>
<p class="text-sm text-stone-500">Pharmacy Prescription • $89.00</p>
</div>
</div>
<div class="flex flex-col items-end gap-2">
<span class="bg-error-container text-error text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">High Risk</span>
<span class="text-xs text-stone-400">45 mins ago</span>
</div>
</div>
<div class="mt-4 flex gap-4">
<div class="flex items-center gap-1.5 text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">
<span class="material-symbols-outlined text-sm">security</span>
                                        Duplicate Provider Flag
                                    </div>
</div>
</div>
</div>
<div class="p-4 bg-stone-50 text-center">
<button class="text-primary text-sm font-bold hover:underline">View All Active Claims</button>
</div>
</div>
</div>
<!-- Secondary Column (Insights) -->
<div class="lg:w-80 space-y-8">
<!-- Provider Insight Card -->
<div class="bg-primary p-6 rounded-xl text-white shadow-xl relative overflow-hidden">
<div class="relative z-10">
<h3 class="font-bold text-xl mb-2">AI Performance</h3>
<p class="text-primary-fixed/80 text-sm mb-6">Our latest model update has reduced manual review by 15% this week.</p>
<button class="w-full bg-white text-primary font-bold py-3 rounded-lg shadow-lg hover:scale-[1.02] transition-transform">Update Model Weights</button>
</div>
<div class="absolute -right-8 -top-8 opacity-20">
<span class="material-symbols-outlined text-[160px]">psychology</span>
</div>
</div>
<!-- Risk heatmap placeholder -->
<div class="bg-surface-container-low p-6 rounded-xl">
<h4 class="font-bold text-sm mb-4 uppercase tracking-widest text-stone-400">Regional Risk Density</h4>
<div class="aspect-square bg-stone-200 rounded-lg overflow-hidden relative">
<img alt="Risk Map" class="w-full h-full object-cover grayscale opacity-50" data-alt="stylized monochrome map showing geographical regions with subtle red heat spots indicating high risk claim concentrations" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1gvsh3FtqjQ8ZrPRm9qZJpvGiBp9YciSX7Nr0q_An4a7wTix0ed220WYN4oteqfflGuRPkWP0lWdP6jUCTEkqsQ8vyEpRMuF4Xr4WBe_QqhjWVenuZTCUUcIOFZZ-j671h-j0mD7rtbwqFN1C0MIXEMMid4WCHaVmWegZDP76lSCn0mgkFGI1p3-EqEB9S0InJPk1GZtby3mz7W43RZ-kvELVggAi3Ifr47f27kM1dPBORqDMYlKabETDoBWXeCPXXE_IhcgAIzY"/>
<div class="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent"></div>
<div class="absolute bottom-4 left-4">
<span class="bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded-full text-stone-900 shadow-sm flex items-center gap-1">
<span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    Live Monitoring
                                </span>
</div>
</div>
</div>
<!-- Team Performance -->
<div>
<h4 class="font-bold text-sm mb-4 uppercase tracking-widest text-stone-400">Team Status</h4>
<div class="space-y-4">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-stone-200 border-2 border-white shadow-sm overflow-hidden">
<img alt="User" data-alt="professional male portrait with confident smile in office attire" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCuVqzxSnW7ivQAYmyu4hgftFzF3ilPip9YdEg_PcUAifDbkDDahzZuR8PpD-rZlaNNSg1ojk2NGHOQg05BRP-Kt26foiM8uu1H3VBz0uDoprWoAB2w9cP69kliGF_5vBmnG-u-sbEJefrJ-1GseY5oJRZTUNwsxN9gvDcqDQKCQk2lUW80AEy_boqeF9caIFYrw6O0u1-0LZ744eDU0Jw3YZ9mxiv_KNwyCQnsxABK_RsgFDMuPnq6oFuwt5k52wT_jC0gSSu4WY"/>
</div>
<div class="flex-1">
<p class="text-sm font-bold">David Wright</p>
<div class="w-full h-1 bg-stone-200 rounded-full mt-1">
<div class="w-3/4 h-full bg-tertiary rounded-full"></div>
</div>
</div>
<span class="text-xs font-bold text-tertiary">Active</span>
</div>
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-stone-200 border-2 border-white shadow-sm overflow-hidden">
<img alt="User" data-alt="professional female portrait with friendly smile in a modern bright setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjFoqXWlIZI0bpSxe7kaY8UFVHHlW5Z9ftbXNccZCbRwscVlzpI2q70_MAxPC6UUIzFhLFuxyqxbwwKjFgCNvg8_aQEqga1mXMt2HD0k0egw2QtTwPIueL_sZfmPIyybhcHFKAQ0jYmae05YmfmvBk4yCvoGNhcUY-WSlhL_gdptxgxix1lTl1haGnNS790P73CxCmSGBvZX31ltz_cls6M69eFiGGt9EC1AXOrFTY8hdvopRcB1Oi6Wp-H0Al-ogMKo2OMVqh2gw"/>
</div>
<div class="flex-1">
<p class="text-sm font-bold">Sarah Jenkins</p>
<div class="w-full h-1 bg-stone-200 rounded-full mt-1">
<div class="w-1/2 h-full bg-stone-400 rounded-full"></div>
</div>
</div>
<span class="text-xs font-bold text-stone-400">Break</span>
</div>
</div>
</div>
</div>
</div>
</main>
</div>
<!-- Footer -->
<footer class="w-full border-t border-stone-100 dark:border-stone-800 bg-[#fcf9f8] mt-auto">
<div class="flex flex-col md:flex-row justify-between items-center px-8 py-12 w-full max-w-[1440px] mx-auto">
<p class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400 mb-4 md:mb-0">© 2024 Adjudicate Pro. Editorial Precision.</p>
<div class="flex gap-8">
<a class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
<a class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a>
<a class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors opacity-80 hover:opacity-100" href="#">Help Center</a>
</div>
</div>
</footer>
</body></html>

<!-- Admin Dashboard -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>AI Manual Review | ClaimAdjudicate</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-primary-fixed-variant": "#920029",
                    "surface-variant": "#e5e2e1",
                    "surface-container-lowest": "#ffffff",
                    "tertiary-fixed": "#80f9bd",
                    "on-surface-variant": "#5c3f41",
                    "secondary": "#a73544",
                    "surface-bright": "#fcf9f8",
                    "surface-container-low": "#f6f3f2",
                    "on-secondary-fixed-variant": "#871d2f",
                    "secondary-fixed-dim": "#ffb2b6",
                    "on-background": "#1b1c1c",
                    "surface": "#fcf9f8",
                    "primary": "#ba0036",
                    "on-tertiary": "#ffffff",
                    "inverse-primary": "#ffb2b6",
                    "background": "#fcf9f8",
                    "surface-container-high": "#eae7e7",
                    "on-primary": "#ffffff",
                    "secondary-container": "#fd7682",
                    "primary-container": "#e21e4a",
                    "error-container": "#ffdad6",
                    "primary-fixed": "#ffdada",
                    "on-error-container": "#93000a",
                    "inverse-on-surface": "#f3f0ef",
                    "tertiary": "#006a45",
                    "on-error": "#ffffff",
                    "on-primary-container": "#fffbff",
                    "on-tertiary-fixed-variant": "#005234",
                    "surface-container": "#f0eded",
                    "on-secondary-fixed": "#40000d",
                    "primary-fixed-dim": "#ffb2b6",
                    "on-secondary-container": "#710920",
                    "outline": "#906f70",
                    "secondary-fixed": "#ffdada",
                    "surface-dim": "#dcd9d9",
                    "inverse-surface": "#303030",
                    "tertiary-container": "#008558",
                    "tertiary-fixed-dim": "#62dca3",
                    "on-tertiary-container": "#f6fff6",
                    "on-secondary": "#ffffff",
                    "surface-tint": "#be0038",
                    "on-surface": "#1b1c1c",
                    "error": "#ba1a1a",
                    "on-primary-fixed": "#40000d",
                    "outline-variant": "#e5bdbe",
                    "on-tertiary-fixed": "#002113",
                    "surface-container-highest": "#e5e2e1"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "xxl": "1.25rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Inter"],
                    "body": ["Inter"],
                    "label": ["Inter"]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-nav {
            backdrop-filter: blur(12px);
        }
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-surface text-on-surface">
<!-- TopNavBar -->
<nav class="fixed top-0 w-full z-50 border-b border-stone-200/20 bg-[#fcf9f8]/90 dark:bg-stone-950/90 backdrop-blur-md shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
<div class="flex justify-between items-center px-8 h-20 max-w-[1440px] mx-auto">
<div class="flex items-center gap-12">
<span class="text-[#ba0036] font-bold text-2xl tracking-tighter">ClaimAdjudicate</span>
<div class="hidden md:flex items-center gap-8 font-['Inter'] font-medium text-sm tracking-tight">
<a class="text-[#ba0036] font-bold border-b-2 border-[#ba0036] pb-4" href="#">Claims</a>
<a class="text-stone-600 dark:text-stone-400 pb-4 hover:text-[#ba0036] transition-colors duration-200" href="#">Analytics</a>
<a class="text-stone-600 dark:text-stone-400 pb-4 hover:text-[#ba0036] transition-colors duration-200" href="#">Providers</a>
<a class="text-stone-600 dark:text-stone-400 pb-4 hover:text-[#ba0036] transition-colors duration-200" href="#">Settings</a>
</div>
</div>
<div class="flex items-center gap-4">
<button class="p-2 text-stone-600 hover:text-[#ba0036] transition-all active:opacity-80 scale-95">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="p-2 text-stone-600 hover:text-[#ba0036] transition-all active:opacity-80 scale-95">
<span class="material-symbols-outlined">account_circle</span>
</button>
</div>
</div>
</nav>
<main class="pt-20 pb-12 min-h-screen flex">
<!-- SideNavBar -->
<aside class="hidden lg:flex flex-col w-64 p-4 space-y-2 bg-[#f6f3f2] dark:bg-stone-900 rounded-xl m-4 h-[calc(100vh-120px)] sticky top-24 shadow-[0_4_8px_rgba(0,0,0,0.1)]">
<div class="px-4 py-6">
<h2 class="font-['Inter'] font-semibold text-sm text-[#ba0036] uppercase tracking-wider">Claim Types</h2>
<p class="text-xs text-stone-500 mt-1">Adjudication Categories</p>
</div>
<nav class="space-y-1">
<div class="flex items-center gap-3 px-4 py-3 bg-white dark:bg-stone-800 text-[#ba0036] rounded-lg shadow-sm font-['Inter'] font-semibold text-sm cursor-pointer hover:translate-x-1 transition-transform">
<span class="material-symbols-outlined">medical_services</span>
<span>Consultation</span>
</div>
<div class="flex items-center gap-3 px-4 py-3 text-stone-500 hover:bg-stone-200/50 rounded-lg font-['Inter'] font-semibold text-sm cursor-pointer hover:translate-x-1 transition-transform">
<span class="material-symbols-outlined">medication</span>
<span>Pharmacy</span>
</div>
<div class="flex items-center gap-3 px-4 py-3 text-stone-500 hover:bg-stone-200/50 rounded-lg font-['Inter'] font-semibold text-sm cursor-pointer hover:translate-x-1 transition-transform">
<span class="material-symbols-outlined">biotech</span>
<span>Lab Test</span>
</div>
</nav>
</aside>
<!-- Main Canvas -->
<div class="flex-1 px-8 py-6">
<!-- Header Section with Asymmetry -->
<div class="mb-10 flex justify-between items-end">
<div>
<span class="text-xs font-bold text-primary tracking-widest uppercase mb-2 block">Action Required</span>
<h1 class="text-5xl font-extrabold tracking-tight text-on-surface mb-2">Claim ID: #772-BXR</h1>
<p class="text-lg text-on-surface-variant max-w-xl">A manual review is required due to ambiguous billing codes in the submitted surgical report. Please reconcile against Policy Clause 12.4.</p>
</div>
<div class="text-right">
<div class="flex items-center gap-2 text-stone-500 mb-2 justify-end">
<span class="material-symbols-outlined text-sm">schedule</span>
<span class="text-sm font-medium">Pending since Oct 24, 08:12 AM</span>
</div>
<div class="bg-surface-container-low px-4 py-2 rounded-lg inline-block border border-outline-variant/10">
<span class="text-sm font-semibold">Priority: </span>
<span class="text-primary font-bold">Urgent</span>
</div>
</div>
</div>
<!-- Side-by-Side Review Grid -->
<div class="grid grid-cols-12 gap-8 items-start">
<!-- Left: Document View (The Source) -->
<div class="col-span-12 xl:col-span-7 space-y-6">
<div class="bg-white rounded-xxl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden border border-outline-variant/10">
<div class="flex items-center justify-between px-6 py-4 bg-surface-container-low border-b border-outline-variant/10">
<h3 class="font-bold text-sm tracking-tight flex items-center gap-2">
<span class="material-symbols-outlined text-primary">description</span>
                                SURGICAL_REPORT_DOC_V2.PDF
                            </h3>
<div class="flex gap-2">
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors">
<span class="material-symbols-outlined text-sm">zoom_in</span>
</button>
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors">
<span class="material-symbols-outlined text-sm">download</span>
</button>
</div>
</div>
<div class="p-8 aspect-[3/4] bg-stone-50 relative overflow-y-auto">
<!-- Mock Document Layout -->
<div class="space-y-4 max-w-2xl mx-auto">
<div class="h-8 w-48 bg-stone-200/50 rounded"></div>
<div class="grid grid-cols-3 gap-4">
<div class="h-4 bg-stone-200/50 rounded"></div>
<div class="h-4 bg-stone-200/50 rounded"></div>
<div class="h-4 bg-stone-200/50 rounded"></div>
</div>
<div class="h-px bg-stone-100 my-4"></div>
<div class="space-y-2">
<div class="h-4 w-full bg-stone-200/50 rounded"></div>
<div class="h-4 w-5/6 bg-stone-200/50 rounded"></div>
<div class="h-4 w-4/6 bg-stone-200/50 rounded"></div>
</div>
<!-- Highlighted Area -->
<div class="bg-primary/5 p-4 rounded-lg border-l-4 border-primary mt-8">
<h4 class="text-xs font-bold text-primary mb-2 uppercase">Detected Conflict (Code 453.1)</h4>
<p class="text-sm font-medium leading-relaxed italic text-stone-700">
                                        "Patient presented with severe discomfort. Procedure performed: Arthroscopic repair of the rotator cuff. Use of multi-modal anesthesia noted. Bilateral assessment was inconclusive..."
                                    </p>
</div>
<div class="space-y-2 mt-4">
<div class="h-4 w-full bg-stone-200/50 rounded"></div>
<div class="h-4 w-full bg-stone-200/50 rounded"></div>
<div class="h-4 w-1/2 bg-stone-200/50 rounded"></div>
</div>
<img class="rounded-xl w-full h-48 object-cover mt-8 grayscale opacity-50 contrast-125" data-alt="Close up of medical documentation with charts and medical symbols on a white desk with professional lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDB5tRo4JzpGyVPYiMo2iGk-rNFpeXZiDe17oxOlLvqDbu387uAIo4eZa-QhcAJcEotjcbDjdJGLq1gN73AzReIgBeqtag542HPjGTMgGi9LCKvT8Mk8Ea8eL8q-FT2Gmbx6sD8U_UoNMt_V2jSi-N7kdIdlFkq8BzRp8Du0ygrhYKkISSuhEY6UWabg31TPYLUPFJWWG6i8ZV_wJC-tY1GoAq5KgCyEyl1CEO_krHSERQN1AaRcltrADNtT6J9scn-SCUBOWewr3M"/>
</div>
</div>
</div>
</div>
<!-- Right: AI Reasoning & Confidence -->
<div class="col-span-12 xl:col-span-5 space-y-8">
<!-- Confidence Gauge Card -->
<div class="bg-surface-container-lowest p-8 rounded-xxl shadow-[0_10px_40px_rgba(186,0,54,0.05)] border border-primary/5 relative overflow-hidden">
<div class="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
<div class="flex items-center justify-between mb-6">
<h3 class="font-bold text-lg tracking-tight">AI Confidence Score</h3>
<span class="material-symbols-outlined text-primary" data-weight="fill">bolt</span>
</div>
<div class="flex items-center gap-8">
<div class="relative w-32 h-32">
<svg class="w-full h-full" viewbox="0 0 100 100">
<circle class="text-surface-container-high stroke-current" cx="50" cy="50" fill="transparent" r="42" stroke-width="8"></circle>
<circle class="text-primary stroke-current" cx="50" cy="50" fill="transparent" r="42" stroke-dasharray="264" stroke-dashoffset="74" stroke-linecap="round" stroke-width="8" transform="rotate(-90 50 50)"></circle>
</svg>
<div class="absolute inset-0 flex items-center justify-center">
<span class="text-3xl font-extrabold text-on-surface">72%</span>
</div>
</div>
<div class="flex-1">
<p class="text-sm font-medium text-on-surface-variant mb-2 italic">"Score reduced due to linguistic ambiguity in 'bilateral assessment'."</p>
<div class="flex gap-2">
<span class="px-2 py-1 bg-tertiary-container/10 text-tertiary font-bold text-[10px] rounded uppercase">Semantic Match</span>
<span class="px-2 py-1 bg-error-container/10 text-error font-bold text-[10px] rounded uppercase">Policy Gap</span>
</div>
</div>
</div>
</div>
<!-- AI Insights / Policy Clauses -->
<div class="bg-[#fcf9f8] p-8 rounded-xxl shadow-sm border border-stone-100">
<h3 class="font-bold text-sm tracking-widest text-stone-400 uppercase mb-6">Decision Reasoning</h3>
<div class="space-y-6">
<div class="flex gap-4">
<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-primary text-xl">gavel</span>
</div>
<div>
<h4 class="font-bold text-base mb-1">Clause 12.4 Violation</h4>
<p class="text-sm text-stone-600 leading-relaxed">The claim includes Multi-Modal Anesthesia under a standard Arthroscopic code. Policy 12.4 requires separate justification for specialized pain management.</p>
</div>
</div>
<div class="flex gap-4">
<div class="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-stone-500 text-xl">history</span>
</div>
<div>
<h4 class="font-bold text-base mb-1">Previous Precedents</h4>
<p class="text-sm text-stone-600 leading-relaxed">Similar claims from Provider #990 were approved when surgical notes specified "Complex Case History." Current document is missing this tag.</p>
</div>
</div>
</div>
</div>
<!-- Action Panel -->
<div class="bg-surface-container p-4 rounded-xxl space-y-3">
<button class="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-lg active:scale-[0.98]">
<span class="material-symbols-outlined">check_circle</span>
                            Approve Override
                        </button>
<button class="w-full bg-white border border-outline-variant/30 text-on-surface py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-50 transition-all active:scale-[0.98]">
<span class="material-symbols-outlined text-error">cancel</span>
                            Reject Override
                        </button>
<button class="w-full bg-transparent text-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-all">
<span class="material-symbols-outlined">help</span>
                            Request Clarification
                        </button>
</div>
</div>
</div>
</div>
</main>
<!-- Footer -->
<footer class="w-full border-t border-stone-100 dark:border-stone-800 bg-[#fcf9f8] dark:bg-stone-950 mt-auto">
<div class="flex flex-col md:flex-row justify-between items-center px-8 py-12 w-full max-w-[1440px] mx-auto">
<p class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400">© 2024 Adjudicate Pro. Editorial Precision.</p>
<div class="flex gap-8 mt-6 md:mt-0">
<a class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-opacity opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
<a class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-opacity opacity-80 hover:opacity-100" href="#">Terms of Service</a>
<a class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-opacity opacity-80 hover:opacity-100" href="#">Help Center</a>
</div>
</div>
</footer>
</body></html>

<!-- AI Manual Review -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>AI Evaluation Metrics | ClaimAdjudicate</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "on-primary-fixed-variant": "#920029",
                      "surface-variant": "#e5e2e1",
                      "surface-container-lowest": "#ffffff",
                      "tertiary-fixed": "#80f9bd",
                      "on-surface-variant": "#5c3f41",
                      "secondary": "#a73544",
                      "surface-bright": "#fcf9f8",
                      "surface-container-low": "#f6f3f2",
                      "on-secondary-fixed-variant": "#871d2f",
                      "secondary-fixed-dim": "#ffb2b6",
                      "on-background": "#1b1c1c",
                      "surface": "#fcf9f8",
                      "primary": "#ba0036",
                      "on-tertiary": "#ffffff",
                      "inverse-primary": "#ffb2b6",
                      "background": "#fcf9f8",
                      "surface-container-high": "#eae7e7",
                      "on-primary": "#ffffff",
                      "secondary-container": "#fd7682",
                      "primary-container": "#e21e4a",
                      "error-container": "#ffdad6",
                      "primary-fixed": "#ffdada",
                      "on-error-container": "#93000a",
                      "inverse-on-surface": "#f3f0ef",
                      "tertiary": "#006a45",
                      "on-error": "#ffffff",
                      "on-primary-container": "#fffbff",
                      "on-tertiary-fixed-variant": "#005234",
                      "surface-container": "#f0eded",
                      "on-secondary-fixed": "#40000d",
                      "primary-fixed-dim": "#ffb2b6",
                      "on-secondary-container": "#710920",
                      "outline": "#906f70",
                      "secondary-fixed": "#ffdada",
                      "surface-dim": "#dcd9d9",
                      "inverse-surface": "#303030",
                      "tertiary-container": "#008558",
                      "tertiary-fixed-dim": "#62dca3",
                      "on-tertiary-container": "#f6fff6",
                      "on-secondary": "#ffffff",
                      "surface-tint": "#be0038",
                      "on-surface": "#1b1c1c",
                      "error": "#ba1a1a",
                      "on-primary-fixed": "#40000d",
                      "outline-variant": "#e5bdbe",
                      "on-tertiary-fixed": "#002113",
                      "surface-container-highest": "#e5e2e1"
              },
              "borderRadius": {
                      "DEFAULT": "0.25rem",
                      "lg": "0.5rem",
                      "xl": "0.75rem",
                      "full": "9999px"
              },
              "fontFamily": {
                      "headline": ["Inter"],
                      "body": ["Inter"],
                      "label": ["Inter"]
              }
            },
          },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-nav {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
        }
    </style>
</head>
<body class="bg-surface text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
<!-- TopNavBar -->
<header class="fixed top-0 w-full z-50 border-b border-stone-200/20 bg-[#fcf9f8]/90 dark:bg-stone-950/90 backdrop-blur-md shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
<div class="flex justify-between items-center px-8 h-20 max-w-[1440px] mx-auto">
<div class="flex items-center gap-8">
<span class="text-[#ba0036] font-bold text-2xl tracking-tighter">ClaimAdjudicate</span>
<nav class="hidden md:flex gap-6 items-center h-full pt-4">
<a class="text-stone-600 dark:text-stone-400 pb-4 font-['Inter'] font-medium text-sm tracking-tight hover:text-[#ba0036] transition-colors duration-200" href="#">Claims</a>
<a class="text-[#ba0036] font-bold border-b-2 border-[#ba0036] pb-4 font-['Inter'] font-medium text-sm tracking-tight" href="#">Analytics</a>
<a class="text-stone-600 dark:text-stone-400 pb-4 font-['Inter'] font-medium text-sm tracking-tight hover:text-[#ba0036] transition-colors duration-200" href="#">Providers</a>
<a class="text-stone-600 dark:text-stone-400 pb-4 font-['Inter'] font-medium text-sm tracking-tight hover:text-[#ba0036] transition-colors duration-200" href="#">Settings</a>
</nav>
</div>
<div class="flex items-center gap-4">
<button class="p-2 rounded-full hover:bg-surface-container-high transition-all active:scale-95 text-stone-600">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button class="p-2 rounded-full hover:bg-surface-container-high transition-all active:scale-95 text-stone-600">
<span class="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</button>
</div>
</div>
</header>
<main class="pt-28 pb-20 px-4 md:px-8 max-w-[1440px] mx-auto flex flex-col md:flex-row gap-8">
<!-- SideNavBar -->
<aside class="hidden md:flex flex-col w-64 p-4 space-y-2 bg-[#f6f3f2] dark:bg-stone-900 rounded-xl h-[calc(100vh-140px)] sticky top-28 shadow-[0_4_8px_rgba(0,0,0,0.1)]">
<div class="px-4 py-6">
<h2 class="font-['Inter'] font-semibold text-sm text-[#ba0036]">Claim Types</h2>
<p class="text-xs text-stone-500 mt-1 uppercase tracking-wider">Adjudication Categories</p>
</div>
<div class="space-y-1">
<div class="flex items-center gap-3 p-3 bg-white dark:bg-stone-800 text-[#ba0036] rounded-lg shadow-sm font-['Inter'] font-semibold text-sm cursor-pointer transition-transform hover:translate-x-1">
<span class="material-symbols-outlined" data-icon="medical_services">medical_services</span>
<span>Consultation</span>
</div>
<div class="flex items-center gap-3 p-3 text-stone-500 hover:bg-stone-200/50 rounded-lg font-['Inter'] font-semibold text-sm cursor-pointer transition-transform hover:translate-x-1">
<span class="material-symbols-outlined" data-icon="medication">medication</span>
<span>Pharmacy</span>
</div>
<div class="flex items-center gap-3 p-3 text-stone-500 hover:bg-stone-200/50 rounded-lg font-['Inter'] font-semibold text-sm cursor-pointer transition-transform hover:translate-x-1">
<span class="material-symbols-outlined" data-icon="biotech">biotech</span>
<span>Lab Test</span>
</div>
</div>
<div class="mt-auto p-4 bg-primary-container/10 rounded-xl border border-primary/10">
<p class="text-xs font-bold text-primary mb-1">AI PERFORMANCE</p>
<div class="flex items-center justify-between">
<span class="text-2xl font-bold">98.2%</span>
<span class="material-symbols-outlined text-primary" data-icon="trending_up">trending_up</span>
</div>
<p class="text-[10px] text-stone-500 mt-1">Accuracy last 24h</p>
</div>
</aside>
<!-- Content Canvas -->
<div class="flex-1 space-y-8">
<!-- Header Section -->
<section class="flex flex-col md:flex-row md:items-end justify-between gap-6">
<div class="space-y-2">
<span class="text-primary font-bold tracking-[0.2em] text-xs uppercase">System Intelligence</span>
<h1 class="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-background">AI Evaluation <br class="hidden md:block"/> Metrics</h1>
<p class="text-body-lg text-stone-500 max-w-xl">Deep-dive performance analysis of the Adjudicate Pro engine across core clinical decision pathways.</p>
</div>
<div class="flex items-center gap-3">
<button class="bg-surface-container-high px-6 py-2.5 rounded-lg text-sm font-bold text-on-surface hover:bg-surface-container-highest transition-all flex items-center gap-2">
<span class="material-symbols-outlined text-lg" data-icon="calendar_today">calendar_today</span>
                        Last 30 Days
                    </button>
<button class="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
                        Export Report
                    </button>
</div>
</section>
<!-- Metric Bento Grid -->
<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
<!-- Accuracy Main -->
<div class="md:col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.04)] border border-stone-100 flex flex-col justify-between relative overflow-hidden group">
<div class="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
<div class="relative z-10">
<div class="flex items-center justify-between mb-4">
<span class="text-sm font-bold text-stone-400 uppercase tracking-widest">Decision Accuracy</span>
<span class="px-2 py-1 bg-tertiary-container/20 text-tertiary text-xs font-bold rounded">+2.4%</span>
</div>
<div class="flex items-baseline gap-2">
<span class="text-6xl font-extrabold tracking-tighter text-on-background">99.4</span>
<span class="text-2xl font-bold text-stone-400">%</span>
</div>
</div>
<div class="relative z-10 mt-8 h-16 flex items-end gap-1">
<div class="flex-1 bg-primary/20 h-[40%] rounded-t-sm"></div>
<div class="flex-1 bg-primary/20 h-[55%] rounded-t-sm"></div>
<div class="flex-1 bg-primary/20 h-[45%] rounded-t-sm"></div>
<div class="flex-1 bg-primary/40 h-[70%] rounded-t-sm"></div>
<div class="flex-1 bg-primary/50 h-[85%] rounded-t-sm"></div>
<div class="flex-1 bg-primary h-full rounded-t-sm"></div>
</div>
</div>
<!-- Response Time -->
<div class="bg-surface-container-lowest p-8 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.04)] border border-stone-100">
<div class="p-3 bg-secondary/10 w-fit rounded-full mb-6">
<span class="material-symbols-outlined text-secondary" data-icon="bolt">bolt</span>
</div>
<h3 class="text-stone-400 text-sm font-bold uppercase tracking-widest mb-1">Avg Latency</h3>
<p class="text-4xl font-extrabold tracking-tight">124<span class="text-lg text-stone-400 ml-1">ms</span></p>
<p class="text-xs text-stone-500 mt-4">95th Percentile: 240ms</p>
</div>
<!-- Manual Triggers -->
<div class="bg-[#2a1a2f] p-8 rounded-xl shadow-xl text-white flex flex-col justify-between overflow-hidden relative">
<div class="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
<div>
<h3 class="text-white/60 text-sm font-bold uppercase tracking-widest mb-4">Manual Reviews</h3>
<p class="text-5xl font-extrabold tracking-tight">1.2<span class="text-lg text-white/40 ml-1">%</span></p>
</div>
<p class="text-xs text-white/50 mt-4 leading-relaxed italic relative z-10">Historical low for Q3 processing period.</p>
</div>
</div>
<!-- Visualization Grid -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
<!-- Decision Distribution -->
<div class="md:col-span-2 bg-surface-container-low p-8 rounded-xl flex flex-col">
<div class="flex justify-between items-start mb-10">
<div>
<h3 class="text-xl font-bold tracking-tight">Distribution: Approved vs Rejected</h3>
<p class="text-sm text-stone-500">Volume breakdown by adjudication outcome</p>
</div>
<div class="flex gap-4">
<div class="flex items-center gap-2">
<div class="w-3 h-3 rounded-full bg-primary"></div>
<span class="text-xs font-bold text-stone-600">Approved</span>
</div>
<div class="flex items-center gap-2">
<div class="w-3 h-3 rounded-full bg-[#5c3f41]"></div>
<span class="text-xs font-bold text-stone-600">Rejected</span>
</div>
</div>
</div>
<div class="flex-1 flex items-end gap-6 h-64 px-4">
<div class="flex-1 flex flex-col-reverse h-full">
<div class="bg-[#5c3f41] h-[15%] w-full rounded-b-md"></div>
<div class="bg-primary h-[85%] w-full rounded-t-md"></div>
<span class="text-[10px] text-center mt-4 font-bold text-stone-400">MON</span>
</div>
<div class="flex-1 flex flex-col-reverse h-full">
<div class="bg-[#5c3f41] h-[10%] w-full rounded-b-md"></div>
<div class="bg-primary h-[90%] w-full rounded-t-md"></div>
<span class="text-[10px] text-center mt-4 font-bold text-stone-400">TUE</span>
</div>
<div class="flex-1 flex flex-col-reverse h-full">
<div class="bg-[#5c3f41] h-[25%] w-full rounded-b-md"></div>
<div class="bg-primary h-[75%] w-full rounded-t-md"></div>
<span class="text-[10px] text-center mt-4 font-bold text-stone-400">WED</span>
</div>
<div class="flex-1 flex flex-col-reverse h-full">
<div class="bg-[#5c3f41] h-[18%] w-full rounded-b-md"></div>
<div class="bg-primary h-[82%] w-full rounded-t-md"></div>
<span class="text-[10px] text-center mt-4 font-bold text-stone-400">THU</span>
</div>
<div class="flex-1 flex flex-col-reverse h-full">
<div class="bg-[#5c3f41] h-[12%] w-full rounded-b-md"></div>
<div class="bg-primary h-[88%] w-full rounded-t-md"></div>
<span class="text-[10px] text-center mt-4 font-bold text-stone-400">FRI</span>
</div>
<div class="flex-1 flex flex-col-reverse h-full opacity-40">
<div class="bg-[#5c3f41] h-[5%] w-full rounded-b-md"></div>
<div class="bg-primary h-[95%] w-full rounded-t-md"></div>
<span class="text-[10px] text-center mt-4 font-bold text-stone-400">SAT</span>
</div>
</div>
</div>
<!-- Right vs Wrong / Human Overrides -->
<div class="bg-white p-8 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.04)] flex flex-col">
<h3 class="text-xl font-bold tracking-tight mb-2">Human Validation</h3>
<p class="text-sm text-stone-500 mb-8">Manual overrides vs AI Consensus</p>
<div class="relative w-48 h-48 mx-auto mb-8">
<svg class="w-full h-full transform -rotate-90" viewbox="0 0 36 36">
<path class="text-stone-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="transparent" stroke="currentColor" stroke-width="3"></path>
<path class="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="transparent" stroke="currentColor" stroke-dasharray="98, 100" stroke-linecap="round" stroke-width="3"></path>
</svg>
<div class="absolute inset-0 flex flex-col items-center justify-center">
<span class="text-3xl font-extrabold">98.1%</span>
<span class="text-[10px] font-bold text-stone-400">CORRECT</span>
</div>
</div>
<div class="space-y-4">
<div class="flex items-center justify-between text-sm">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-tertiary text-lg" data-icon="check_circle">check_circle</span>
<span class="font-medium">Consensus</span>
</div>
<span class="font-bold">14,203</span>
</div>
<div class="flex items-center justify-between text-sm">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-lg" data-icon="error">error</span>
<span class="font-medium">Overrides</span>
</div>
<span class="font-bold">241</span>
</div>
<div class="flex items-center justify-between text-sm border-t border-stone-100 pt-4 opacity-50">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-stone-400 text-lg" data-icon="history">history</span>
<span class="font-medium">Appeals</span>
</div>
<span class="font-bold">12</span>
</div>
</div>
</div>
</div>
<!-- Asymmetric Insight Card -->
<div class="flex flex-col md:flex-row bg-surface-container-highest/30 rounded-2xl overflow-hidden border border-stone-100">
<div class="md:w-1/3 bg-[#ba0036] p-10 text-white flex flex-col justify-between">
<div>
<span class="material-symbols-outlined text-4xl mb-6" data-icon="lightbulb">lightbulb</span>
<h4 class="text-2xl font-bold leading-tight mb-4">Optimization Insight</h4>
<p class="text-white/80 text-sm leading-relaxed">The high rejection rate on Wednesdays is correlated with a specific pharmacy group's batch processing cycles.</p>
</div>
<button class="text-sm font-bold flex items-center gap-2 mt-8 group">
                        VIEW DETAILED LOGS 
                        <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
<div class="flex-1 p-10 flex flex-col md:flex-row gap-10">
<div class="flex-1">
<h5 class="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">Regional Distribution</h5>
<div class="space-y-6">
<div>
<div class="flex justify-between text-xs font-bold mb-2">
<span>North East</span>
<span>84% Efficiency</span>
</div>
<div class="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
<div class="bg-primary h-full w-[84%]"></div>
</div>
</div>
<div>
<div class="flex justify-between text-xs font-bold mb-2">
<span>Central</span>
<span>92% Efficiency</span>
</div>
<div class="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
<div class="bg-primary h-full w-[92%]"></div>
</div>
</div>
<div>
<div class="flex justify-between text-xs font-bold mb-2">
<span>Pacific Coast</span>
<span>79% Efficiency</span>
</div>
<div class="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
<div class="bg-primary h-full w-[79%]"></div>
</div>
</div>
</div>
</div>
<div class="hidden lg:block w-px bg-stone-200"></div>
<div class="flex-1">
<h5 class="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">Contextual Accuracy</h5>
<img class="w-full aspect-video object-cover rounded-xl shadow-lg grayscale hover:grayscale-0 transition-all duration-500" data-alt="abstract data visualization with flowing vibrant red and purple lines on a clean light background representing machine learning nodes" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4KMcH2O6h1Z6xBWWvU5emcDMJNpZ_S8FZUYTeroB5as1Til0kM41vUBsCaAeTVxvoiNgJTtdYruUPkFb28HMl_kCgqmArxe1iPY5-sK6wd25GCMZC8-vx5MPeoFnyxKSuLTjBYUSFVaDXlNyJqIS_0yjghcqGUiUlffDd1iBPMTe1TDd1mehHzfevium7Faocre1PYFieh80Q-oAJ2xAgaPuqwMnnM4xc4APb_Ukt2AvWNCdeLSsBZKw0kaOyPNvKGM6G5TN05IU"/>
</div>
</div>
</div>
</div>
</main>
<!-- Footer -->
<footer class="w-full border-t border-stone-100 dark:border-stone-800 bg-[#fcf9f8] dark:bg-stone-950 mt-auto">
<div class="flex flex-col md:flex-row justify-between items-center px-8 py-12 w-full max-w-[1440px] mx-auto">
<span class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400 mb-6 md:mb-0">© 2024 Adjudicate Pro. Editorial Precision.</span>
<div class="flex gap-8">
<a class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
<a class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a>
<a class="font-['Inter'] text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors opacity-80 hover:opacity-100" href="#">Help Center</a>
</div>
</div>
</footer>
</body></html>