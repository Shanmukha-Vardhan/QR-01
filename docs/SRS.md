# Software Requirements Specification (SRS)
## Premium Zero-Track QR Code Generator

**Version:** 1.0  
**Date:** February 15, 2026  
**Author:** Portfolio Project  
**Status:** Draft  

---

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to define the functional and non-functional requirements for the **Premium Zero-Track QR Generator**. This web application is designed as a high-performance portfolio project that demonstrates advanced frontend engineering skills while addressing privacy concerns inherent in many existing free QR code generators.

**Intended Audience:**
*   Development Team (Implementation Reference)
*   Stakeholders and Portfolio Reviewers
*   UX/UI Designers
*   QA Testers

### 1.2 Scope
**Product Name:** Premium Zero-Track QR Generator  

**Product Overview:**  
A client-side web application that generates QR codes without server-side data collection or user tracking. The system emphasizes premium user experience, real-time customization, and transparent privacy practices.

**Key Benefits:**
*   **Complete Client-Side Processing:** Zero server tracking.
*   **Premium UI/UX:** Advanced animations and interactions.
*   **Real-World Simulation:** Tools for testing QR code scanability.
*   **Professional Customization:** High-quality design options.
*   **High Performance:** Accessible and responsive design.

**Out of Scope:**
*   Dynamic QR codes with URL redirection services.
*   User authentication or account management.
*   Server-side analytics or tracking.
*   Mobile native applications (web-only).
*   Batch QR code generation for enterprise.

### 1.3 Definitions, Acronyms, and Abbreviations
| Term | Definition |
| :--- | :--- |
| **QR Code** | Quick Response Code - 2D barcode readable by cameras. |
| **Client-Side** | Processing that occurs in the user's browser. |
| **ECL** | Error Correction Level (L, M, Q, H). |
| **SVG** | Scalable Vector Graphics. |
| **PWA** | Progressive Web Application. |
| **DPI** | Dots Per Inch. |
| **Glassmorphism** | UI design trend using translucent elements. |

### 1.4 References
1.  LinkedIn. (2025). *Free QR Code Generator Risks: How a $500 Mistake Exposed Hidden Costs*.
2.  Lucid Privacy. (2025). *QR Codes: Useful Tool, or Privacy Disaster?*
3.  Perforce. (2025). *How to Write a Software Requirements Specification*.

### 1.5 Overview
The Premium Zero-Track QR Generator is a standalone web application that operates entirely within the user's browser. Unlike traditional QR generators that proxy scan data through tracking servers, this system performs all operations client-side using JavaScript libraries.

**System Context:**
*   Runs in modern web browsers (Chrome, Firefox, Safari, Edge).
*   No backend server required for core functionality.
*   Deployed as a static site on edge CDN (Vercel/Netlify).
*   Optional PWA installation for offline usage.

---

## 2. Overall Description

### 2.1 Product Perspective
**Core Functions:**
1.  **QR Code Generation:** Generate QR codes from URLs, text, WiFi credentials, contact cards.
2.  **Visual Customization:** Color picker, gradients, shape morphing, logo embedding, custom eye frames.
3.  **Privacy Dashboard:** Visual audit showing zero data collection, comparison with tracking-enabled generators.
4.  **Real-World Simulator:** Mockup templates, distance/lighting/angle simulation, scan success estimation.
5.  **Export Suite:** PNG export (multiple DPI), SVG export, color variant batch export, dark mode optimization.

### 2.2 Product Functions
Detailed in Section 3.

### 2.3 User Classes and Characteristics
| User Class | Characteristics | Technical Expertise |
| :--- | :--- | :--- |
| **Designers** | Need high-quality exports, branding control. | Medium |
| **Small Business** | Menu/poster QR codes, ease of use. | Low |
| **Marketers** | Campaign codes, mockup previews. | Medium |
| **Developers** | API integration, SVG manipulation. | High |
| **Privacy-Conscious** | Zero-tracking requirement. | Medium-High |

### 2.4 Operating Environment
**Client Requirements:**
*   Modern browser with ES6+ JavaScript support.
*   Minimum screen resolution: 375px width (mobile).
*   Canvas API support.
*   Local storage support (5MB minimum).

**Recommended Environment:**
*   **Desktop:** 1920x1080 or higher.
*   **Mobile:** iOS 14+ / Android 10+.
*   **Network:** Optional (offline-capable after first load).

### 2.5 Design and Implementation Constraints
**Technical:**
*   Must operate entirely client-side.
*   QR encoding limited by browser memory (~10KB data per code).
*   Logo size limited to prevent error correction failure.

**Design:**
*   Maintain WCAG 2.1 AA accessibility standards.
*   Support high-contrast mode.
*   Respect `prefers-reduced-motion`.
*   Bundle size limits (<500KB initial).

**Regulatory:**
*   GDPR compliance.

### 2.6 Assumptions and Dependencies
*   Users have JavaScript enabled.
*   Users grant camera permission for simulator feature.
*   Dependencies: `qrcode`/`qrcode.react`, Next.js 14+, Tailwind CSS, Framer Motion/GSAP.

---

## 3. Functional Requirements

### 3.1 QR Code Generation Module

**FR-1.1: URL Input and Validation**
*   **Priority:** High
*   **Description:** The system shall accept URL input and validate format before encoding.
*   **Acceptance Criteria:**
    *   Validates URL format (http, https, ftp).
    *   Displays error message for invalid URLs within 500ms.
    *   Allows up to 2048 characters.

**FR-1.2: Text Input Support**
*   **Priority:** High
*   **Description:** The system shall accept plain text input up to 4,296 alphanumeric characters.
*   **Acceptance Criteria:**
    *   Multi-line textarea.
    *   Real-time character count.
    *   Warns when approaching limit.

**FR-1.3: WiFi Configuration**
*   **Priority:** Medium
*   **Description:** The system shall generate WiFi configuration QR codes.
*   **Acceptance Criteria:**
    *   Fields for SSID, Password, Encryption (WEP/WPA/WPA2/None).
    *   Generates `WIFI:` format string.
    *   Masks password input with toggle.

**FR-1.4: Contact Card (vCard)**
*   **Priority:** Medium
*   **Description:** The system shall generate vCard QR codes.
*   **Acceptance Criteria:**
    *   Fields for Name, Org, Phone, Email, URL, Address.
    *   Generates vCard 3.0 string.
    *   Optional profile photo upload (<100KB).

**FR-1.5: Real-Time Preview**
*   **Priority:** High
*   **Description:** The system shall display QR code preview that updates within 100ms.
*   **Acceptance Criteria:**
    *   Renders on canvas.
    *   Updates debounced at 100ms.
    *   Maintains aspect ratio.
    *   Displays "Empty" state when no input.

**FR-1.6: Error Correction Level Selection**
*   **Priority:** Medium
*   **Description:** The system shall allow users to select Error Correction Level (L, M, Q, H).
*   **Acceptance Criteria:**
    *   Selection UI for L (7%), M (15%), Q (25%), H (30%).
    *   Defaults to M.
    *   Warns when logo size requires higher ECL.

### 3.2 Customization Module

**FR-2.1: Color Picker - Foreground**
*   **Priority:** High
*   **Description:** Customize QR module color (Hex, RGB, Gradient).
*   **Acceptance Criteria:**
    *   Color picker UI.
    *   Gradient editor.
    *   Applies changes within 50ms.

**FR-2.2: Color Picker - Background**
*   **Priority:** High
*   **Description:** Customize background color (including transparency).
*   **Acceptance Criteria:**
    *   Supports transparency.
    *   Warns if contrast ratio < 3:1.
    *   "Transparent" quick option.

**FR-2.3: Shape Morphing - Modules**
*   **Priority:** Medium
*   **Description:** Change QR module shape (square, rounded, dots, circles).
*   **Acceptance Criteria:**
    *   Preset shape options.
    *   Maintains scanability.
    *   Smooth transitions (300ms).

**FR-2.4: Shape Morphing - Eye Frames**
*   **Priority:** Medium
*   **Description:** Customize eye frame design.
*   **Acceptance Criteria:**
    *   Presets (square, rounded, leaf, circle).
    *   Independent customization of 3 eyes.
    *   Real-time preview.

**FR-2.5: Logo Upload and Embedding**
*   **Priority:** High
*   **Description:** Upload and embed logo in QR center.
*   **Acceptance Criteria:**
    *   Accepts PNG, JPG, SVG (<5MB).
    *   Auto-scales to safe size (max 30%).
    *   Applies white padding.
    *   Logo positioning controls.

**FR-2.6: Size and Margin Control**
*   **Priority:** Medium
*   **Description:** Adjust QR output size and quiet zone.
*   **Acceptance Criteria:**
    *   Size slider (128px - 2048px).
    *   Margin slider (0 - 10 modules).

### 3.3 Privacy Dashboard Module

**FR-3.1: Privacy Audit Visualization**
*   **Priority:** High
*   **Description:** Display visual flowchart showing client-side processing.
*   **Acceptance Criteria:**
    *   Animated flowchart (Input -> Browser -> Download).
    *   Comparison with tracking generators.

**FR-3.2: Data Transparency Statement**
*   **Priority:** High
*   **Description:** Clear privacy statement on main page.
*   **Acceptance Criteria:**
    *   "100% Client-Side" statement.
    *   Link to privacy details.

**FR-3.3: Educational Tooltips**
*   **Priority:** Low
*   **Description:** Edu-content about privacy risks.
*   **Acceptance Criteria:**
    *   Tooltips for technical terms.
    *   Explains static vs dynamic codes.

### 3.4 Real-World Simulator Module

**FR-4.1: Mockup Templates**
*   **Priority:** Medium
*   **Description:** Provide realistic mockup templates.
*   **Acceptance Criteria:**
    *   Templates: Business card, poster, etc.
    *   Drag-and-drop overlay.
    *   Scale/Rotation controls.

**FR-4.2: Environmental Simulation**
*   **Priority:** Medium
*   **Description:** Simulate scan conditions (Lighting, Distance, Angle).
*   **Acceptance Criteria:**
    *   Lighting, Distance, Angle sliders.
    *   Camera shake toggle.

**FR-4.3: Scan Success Rate Estimation**
*   **Priority:** Low
*   **Description:** Estimate success rate based on design.
*   **Acceptance Criteria:**
    *   Formula considering contrast, logo coverage, ECL.
    *   Display percentage (0-100%) with color coding.

### 3.5 Export Module

**FR-5.1: PNG Export**
*   **Priority:** High
*   **Acceptance Criteria:**
    *   72, 150, 300, 600 DPI options.
    *   Proper file naming.

**FR-5.2: SVG Export**
*   **Priority:** High
*   **Acceptance Criteria:**
    *   Clean XML structure.
    *   Optimized paths.

**FR-5.3: Batch Export (Variants)**
*   **Priority:** Low
*   **Acceptance Criteria:**
    *   Define 2-5 color schemes.
    *   Download as ZIP.

**FR-5.4: Dark Mode Optimization**
*   **Priority:** Medium
*   **Acceptance Criteria:**
    *   "Export for dark background" toggle.
    *   Invert colors/add glow.

### 3.6 Progressive Web App (PWA) Features

**FR-6.1: Offline Capability**
*   **Priority:** Medium
*   **Acceptance Criteria:**
    *   Service worker caching.
    *   Full offline functionality.

**FR-6.2: Install Prompt**
*   **Priority:** Low
*   **Acceptance Criteria:**
    *   Install banner logic.
    *   Standalone mode operation.

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements
**NFR-1.1: Initial Load Time**
*   Load within 2 seconds (4G).
*   Lighthouse Performance >= 90.
*   FCP < 1.2s.

**NFR-1.2: QR Generation Speed**
*   Complete within 100ms.
*   95th percentile < 150ms.

**NFR-1.3: Animation Frame Rate**
*   60 FPS (Desktop), 30 FPS (Mobile).

**NFR-1.4: Memory Usage**
*   < 100MB typical usage.
*   No memory leaks.

### 4.2 Security Requirements
**NFR-2.1: Client-Side Only Processing**
*   No API calls for generation.
*   Privacy audit pass.

**NFR-2.2: Input Sanitization**
*   Prevent XSS (URL validation, escaping).

**NFR-2.3: Secure External Resources**
*   All assets over HTTPS.
*   SRI hashes.

### 4.3 Usability Requirements
**NFR-3.1: Accessibility**
*   WCAG 2.1 Level AA.
*   Contrast ratio requirements.
*   Keyboard accessible.

**NFR-3.2: Responsive Design**
*   Optimized for Mobile, Tablet, Desktop.

**NFR-3.3: Reduced Motion**
*   Respect `prefers-reduced-motion`.

**NFR-3.4: Error Handling**
*   Clear, specific inline error messages.

### 4.4 Reliability and Availability
**NFR-4.1: Uptime**
*   99.9% (via Vercel/Netlify).

**NFR-4.2: Browser Compatibility**
*   Latest 2 versions of Chrome, Firefox, Safari, Edge.

### 4.5 Maintainability and Scalability
**NFR-5.1: Code Quality**
*   ESLint (zero errors).
*   Prettier.
*   TypeScript strict mode.

**NFR-5.2: Component Architecture**
*   Atomic design.
*   Reusable components (Shadcn UI).

**NFR-5.3: Deployment Pipeline**
*   CI/CD (GitHub Actions).

---

## 5. System Interfaces

### 5.1 User Interfaces
*   **Header:** Logo, Navigation.
*   **Left Panel:** Input & Customization.
*   **Center Panel:** Live Preview Canvas.
*   **Right Panel:** Dashboard & Simulator.
*   **Footer:** Credits, Version.
*   **Layout:** Responsive (Stacked on mobile, Multi-column on desktop).

### 5.2 Software Interfaces
*   **SI-1 QR Encoding Library:** `qrcode` npm package.
*   **SI-2 Browser APIs:** Canvas API, Download API, LocalStorage, Service Worker.

### 5.3 Communication Interfaces
*   **CI-1 Static Asset Loading:** HTTPS for fonts/icons.

---

## 6. Verification and Validation

### 6.1 Testing Approach
*   **Unit Testing:** Jest + RTL.
*   **Integration Testing:** End-to-end flows.
*   **Accessibility:** Axe DevTools, Screen Readers (NVDA/VoiceOver).
*   **Performance:** Lighthouse CI.
*   **Cross-Browser:** BrowserStack.

### 6.2 Acceptance Criteria
*   [ ] All FRs implemented.
*   [ ] Lighthouse Performance >= 90.
*   [ ] Lighthouse Accessibility 100.
*   [ ] Zero critical bugs.
*   [ ] Documentation complete.
*   [ ] Portfolio showcase ready.

---

## 7. Appendices

### 7.1 Glossary
(See Section 1.3)

### 7.2 Technology Stack Summary
| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 14+ (React 18+) |
| **Styling** | Tailwind CSS + Shadcn UI |
| **Animations** | Framer Motion or GSAP |
| **QR Library** | `qrcode` npm package |
| **State** | React Context or Zustand |
| **Deployment** | Vercel or Netlify |
| **Testing** | Jest, Playwright |
| **Language** | TypeScript (strict) |

### 7.3 Revision History
| Version | Date | Author | Changes |
| :--- | :--- | :--- | :--- |
| 1.0 | Feb 15, 2026 | Portfolio Project | Initial draft |

**End of Document**
