# Ashok Cement Works – Smart Invoice Generator

A complete, mobile-first, installable Progressive Web App (PWA) Smart Invoice Generator designed and engineered specifically for **Ashok Cement Works** (Readymade Compound Wall specialists in Kumbakonam, Tamil Nadu).

Recreated directly from the original printed invoice format, this frontend-only application empowers the business owner to dynamically enter wall measurements, automatically calculate square feet and amounts, customize predefined & custom charges, and download high-resolution A4 invoices in PDF, PNG, JPG, or print directly from mobile and desktop devices.

---

## 🌟 Key Features

1. **Pixel-Perfect Original Invoice Replication**
   - High-fidelity reproduction of the original Ashok Cement Works printed bill layout.
   - Vector company emblem / logo artwork with crisp rendering.
   - Preserves blue & crimson brand hierarchy (`#0866B5`, `#073B78`, `#A31D1D`).
   - Classic pre-printed invoice look with authentic double borders, bill pills, dotted guidelines, and decorative bottom frames.

2. **Smart Measurement Calculator**
   - Enter Length (L) and Height (H) in feet.
   - Automatically computes Square Feet (SL = L × H) and row amounts (Amount = SL × Rate).
   - Allows switching between automatic calculation and manual square feet entry.
   - Real-time updates for Total Square Feet and Total Measurement Amount.
   - Add and remove measurement rows dynamically.

3. **Predefined & Custom Charges Management**
   - Prepopulated default charges:
     1. **M Sand**
     2. **Jalli (Stone Aggregate)** *(M Sand and Jalli are separate; "Jelly" is never used)*
     3. **Cement Pack**
     4. **Labour Charge**
   - Instant enable/disable switches for every charge.
   - Remove unused charges (disappears completely from invoice calculations and preview).
   - One-click restore button for removed predefined charges.
   - Add unlimited custom charges (e.g. Crane Transport, Foundation Pillar, Unloading) with custom names and amounts.

4. **Live Synchronization & Automatic Calculations**
   - **Measurement Total** = Sum of all measurement rows.
   - **Additional Charges** = Sum of all enabled charges.
   - **Grand Total** = Measurement Total + Additional Charges.
   - **Balance Due** = Grand Total − Advance Payment.
   - Complete Indian numbering system (e.g., ₹66,710) and automatic English "Amount in Words" conversion.

5. **Multi-Format Export & Printing**
   - **Download PDF**: Vector-crisp standard A4 portrait format via `jsPDF` with optimal margins.
   - **Download PNG**: High-resolution 2.5x raster export with white background via `html-to-image`.
   - **Download JPG**: High-quality compressed image export.
   - **Print Invoice**: Dedicated `@media print` styling compatible with Android printing, iOS AirPrint, and desktop print dialogs.

6. **100% Professional English**
   - Completely English interface and bill content without Tamil text.
   - Strict adherence to official business terminology.

7. **Zero Backend / Privacy First (Strict Client-Side)**
   - No backend, no database, no login or registration.
   - Temporary React state: no persistent LocalStorage or IndexedDB data leakage.
   - Invoices are generated, exported, and saved straight to the user's mobile device or computer.

8. **Progressive Web App (PWA)**
   - Web App Manifest (`manifest.json`) with `#0866B5` theme color and standalone display.
   - Service Worker (`sw.js`) for instant loading and offline shell caching.
   - Custom SVG and PNG icons (`icon-192.png`, `icon-512.png`, `apple-touch-icon.png`).
   - In-app **Install App** button with native prompt on Android/Chrome and guided modal for iOS Safari (*Share → Add to Home Screen*).

---

## 🛠 Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Export Engines**: [html-to-image](https://github.com/bubkoo/html-to-image) & [jsPDF](https://github.com/parallax/jsPDF)
- **Platform**: Progressive Web App (PWA) with Service Worker

---

## 📱 Mobile-First Responsive Design

- **Mobile Viewport**:
  - Intuitive tab switcher between **Edit Form** and **Live Preview**.
  - Touch-friendly numeric inputs and large action buttons.
  - Sticky bottom action bar with Grand Total summary, preview toggle, and instant PDF download.
- **Desktop / Tablet Viewport**:
  - Two-column ergonomic workspace:
    - **Left Column**: Customer Information, Measurement Calculator, Charges Manager, and Payment Editor.
    - **Right Column**: Sticky real-time A4 Invoice Preview reflecting changes instantaneously.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm (or pnpm/yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ashok-cement-works.git

# Navigate into the project folder
cd ashok-cement-works

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build the production bundle
npm run build

# Start the production server
npm start
```

---

## ☁️ Deployment

### Deploy to Vercel (Recommended)

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import the repository into [Vercel](https://vercel.com).
3. The framework preset will automatically be detected as **Next.js**.
4. Click **Deploy**. No environment variables or database setup required!

---

## 🏢 Business Information

- **Company**: ASHOK CEMENT WORKS
- **Specialty**: READYMADE COMPOUND WALL
- **Address**: 2/2, Singarampillai Toppu, Chennai Road, Kumbakonam – 612 001.
- **Proprietor**: A. Arun Kumar
- **Contact**: Cell : 77087888086

---

## 📄 License

Proprietary commercial application designed for Ashok Cement Works.
