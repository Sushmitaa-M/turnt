'use client'
/**
 * EventBookingPage.jsx  — 3-step flow
 *
 * Step 1: Event details + Registration form
 * Step 2: Payment page (Razorpay demo wired up)
 * Step 3: Success screen with downloadable ticket
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import '../styles/EventBookingPage.css';

/* ─── Fallback event data ──────────────────────────────────── */
const DEFAULT_EVENT = {
  id: 1,
  week: 'WEEK 12',
  name: 'Saturday Run',
  subtitle: 'ft. nxtface',
  date: 'Saturday, 7th June',
  time: '6:00 – 8:00 AM',
  location: 'Bessyy',
  locationFull: 'Besant Nagar Beach, Chennai',
  status: 'open',
  statusLabel: 'Registration Open',
  tag: 'OPEN TO ALL',
  about:
    "A chill run w games — waves & vibes, 3km run and amazing games. We're definitely getting inside the water and stuff!!",
  accent: '#FF6B00',
  posterLabel: 'SATURDAY\nRUN',
  bgWord: 'ANVA',
  image:
    'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&auto=format&fit=crop&q=80',
  fee: '₹1,000',
  feeAmount: 100000, // in paise (₹1,000 × 100)
  category: 'Community Run',
  organizer: 'ANVA Run Club',
  agenda: [
    { time: '5:45 AM', title: 'Assembly & Warm-up' },
    { time: '6:00 AM', title: '3 km Run Begins' },
    { time: '6:45 AM', title: 'Beach Games & Activities' },
    { time: '7:30 AM', title: 'Cool-down & Group Photo' },
    { time: '8:00 AM', title: 'Wrap-up & Refreshments' },
  ],
  highlights: [
    'Scenic 3 km beachside route',
    'Curated playlist by nxtface',
    'Community games on the sand',
    'Water entry allowed — bring a change of clothes!',
    'Open to all fitness levels',
  ],
};

/* ─── Offer definitions ─────────────────────────────────────── */
const OFFERS = [
  {
    id: 'EARLY10',
    star: '★',
    label: 'EARLY10',
    desc: '10% off — Early bird',
    discount: 0.10,
    badge: 'EARLY BIRD',
  },
  {
    id: 'SQUAD20',
    star: '★★',
    label: 'SQUAD20',
    desc: '20% off — Group of 3+',
    discount: 0.20,
    badge: 'GROUP DEAL',
  },
  {
    id: 'FIRST50',
    star: '★★★',
    label: 'FIRST50',
    desc: '50% off — First 50 registrations',
    discount: 0.50,
    badge: 'HOT 🔥',
  },
];

/* ─── Razorpay loader ───────────────────────────────────────── */
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/* ─── SVG Icons ─────────────────────────────────────────────── */
const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="eb-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const TagIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

/* ─── Step indicator ─────────────────────────────────────────── */
function StepBar({ step, accent }) {
  const steps = ['Details', 'Payment', 'Ticket'];
  return (
    <div className="eb-stepbar">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = step > idx;
        const active = step === idx;
        return (
          <div key={label} className="eb-stepbar__item">
            <div
              className={`eb-stepbar__circle ${active ? 'eb-stepbar__circle--active' : ''} ${done ? 'eb-stepbar__circle--done' : ''}`}
              style={{
                borderColor: active || done ? accent : 'rgba(255,255,255,0.15)',
                background: done ? accent : active ? `${accent}22` : 'transparent',
                color: done ? '#fff' : active ? accent : 'rgba(255,255,255,0.3)',
              }}
            >
              {done ? <CheckIcon /> : idx}
            </div>
            <span
              className="eb-stepbar__label"
              style={{ color: active ? accent : done ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)' }}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <div
                className="eb-stepbar__line"
                style={{ background: done ? accent : 'rgba(255,255,255,0.1)' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Validation ─────────────────────────────────────────────── */
const VALIDATORS = {
  fullName:    (v) => v.trim().length < 2 ? 'Please enter your full name' : '',
  email:       (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email address' : '',
  phone:       (v) => !/^\+?[\d\s\-]{8,15}$/.test(v) ? 'Enter a valid phone number' : '',
  institution: (v) => v.trim().length < 2 ? 'College / Company name is required' : '',
  department:  () => '',
  yearOfStudy: () => '',
  eventSelection: () => '',
  notes:       () => '',
};

const INITIAL_FORM = {
  fullName: '', email: '', phone: '', institution: '',
  department: '', yearOfStudy: '', eventSelection: '', notes: '',
};

function generateBookingId() {
  return 'ANVA-' + Math.random().toString(36).toUpperCase().slice(2, 8);
}

/* ═══════════════════════════════════════════════════════════
   OffersStrip  — shown above payment card
══════════════════════════════════════════════════════════ */
function OffersStrip({ event, selectedOffer, onSelect }) {
  return (
    <div className="eb-offers-strip">
      <div className="eb-offers-strip__header">
        <TagIcon />
        <span>Available Offers</span>
      </div>
      <div className="eb-offers-strip__list">
        {OFFERS.map((offer) => {
          const active = selectedOffer?.id === offer.id;
          const discountedAmount = Math.round((event.feeAmount / 100) * (1 - offer.discount));
          const savings = Math.round((event.feeAmount / 100) * offer.discount);
          return (
            <button
              key={offer.id}
              type="button"
              className={`eb-offer-card${active ? ' eb-offer-card--active' : ''}`}
              style={active ? {
                borderColor: event.accent,
                background: `${event.accent}12`,
                boxShadow: `0 0 0 1px ${event.accent}55, 0 4px 20px ${event.accent}22`,
              } : {}}
              onClick={() => onSelect(active ? null : offer)}
            >
              {/* Star tier badge */}
              <div
                className="eb-offer-card__star"
                style={{ color: active ? event.accent : 'rgba(255,200,100,0.7)' }}
              >
                {offer.star}
              </div>

              {/* Badge label */}
              <div
                className="eb-offer-card__badge"
                style={{
                  background: active ? event.accent : 'rgba(255,255,255,0.06)',
                  color: active ? '#fff' : 'rgba(255,255,255,0.4)',
                }}
              >
                {offer.badge}
              </div>

              {/* Code */}
              <div className="eb-offer-card__code"
                style={{ color: active ? event.accent : 'rgba(255,255,255,0.85)' }}>
                {offer.label}
              </div>

              {/* Description */}
              <div className="eb-offer-card__desc">{offer.desc}</div>

              {/* Pricing */}
              <div className="eb-offer-card__pricing">
                <span className="eb-offer-card__new"
                  style={{ color: active ? event.accent : 'rgba(255,255,255,0.9)' }}>
                  ₹{discountedAmount.toLocaleString('en-IN')}
                </span>
                <span className="eb-offer-card__save">save ₹{savings.toLocaleString('en-IN')}</span>
              </div>

              {/* Active tick */}
              {active && (
                <div className="eb-offer-card__tick" style={{ background: event.accent }}>
                  <CheckIcon />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HeroBanner
══════════════════════════════════════════════════════════ */
function HeroBanner({ event, visible }) {
  return (
    <div className={`eb-hero${visible ? ' eb-hero--visible' : ''}`}>
      <img src={event.image} alt={event.name} className="eb-hero__bg" />
      <div
        className="eb-hero__grad"
        style={{
          background: `linear-gradient(to bottom,
            rgba(5,5,5,0.35) 0%,
            transparent 30%,
            transparent 55%,
            rgba(5,5,5,0.85) 80%,
            #050505 100%),
            radial-gradient(ellipse 70% 50% at 50% 90%, ${event.accent}44 0%, transparent 70%)`,
        }}
      />
      <div className="eb-hero__noise" />
      <div className="eb-hero__content">
        <div className="eb-hero__week-chip"
          style={{ background: `linear-gradient(135deg, ${event.accent}, ${event.accent}cc)` }}>
          {event.week}
        </div>
        <h1 className="eb-hero__title" style={{ color: event.accent }}>{event.name}</h1>
        <p className="eb-hero__subtitle">{event.subtitle}</p>
        <div className="eb-hero__meta-row">
          <div className="eb-hero__meta-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={event.accent} strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {event.date}
          </div>
          <div className="eb-hero__meta-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={event.accent} strokeWidth="2">
              <circle cx="12" cy="12" r="9" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {event.time}
          </div>
          <div className="eb-hero__meta-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={event.accent} strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {event.locationFull}
          </div>
          <div className="eb-hero__meta-pill eb-hero__meta-pill--accent"
            style={{ borderColor: `${event.accent}66`, color: event.accent }}>
            {event.fee}
          </div>
          <div className="eb-hero__meta-pill">{event.category}</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EventDetails (left column on step 1)
══════════════════════════════════════════════════════════ */
function EventDetails({ event, visible }) {
  return (
    <div className={`eb-details${visible ? ' eb-details--visible' : ''}`}>
      <div className="eb-card eb-details__about">
        <div className="eb-card__eyebrow">ABOUT THE EVENT</div>
        <p className="eb-details__desc">{event.about}</p>
      </div>
      <div className="eb-card">
        <div className="eb-card__eyebrow">AGENDA</div>
        <div className="eb-agenda">
          {(event.agenda || []).map((item, i) => (
            <div key={i} className="eb-agenda__row">
              <div className="eb-agenda__time" style={{ color: event.accent }}>{item.time}</div>
              <div className="eb-agenda__dot" style={{ background: event.accent }} />
              <div className="eb-agenda__title">{item.title}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="eb-card">
        <div className="eb-card__eyebrow">HIGHLIGHTS</div>
        <ul className="eb-highlights">
          {(event.highlights || []).map((h, i) => (
            <li key={i} className="eb-highlights__item">
              <span className="eb-highlights__dot" style={{ background: event.accent }} />
              {h}
            </li>
          ))}
        </ul>
      </div>
      <div className="eb-card eb-details__organizer">
        <div className="eb-card__eyebrow">ORGANIZER</div>
        <div className="eb-organizer">
          <div className="eb-organizer__avatar"
            style={{ background: `linear-gradient(135deg, ${event.accent}, ${event.accent}66)` }}>
            {event.organizer?.charAt(0)}
          </div>
          <div>
            <div className="eb-organizer__name">{event.organizer}</div>
            <div className="eb-organizer__sub">Official Event Host</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SummaryCard  (sticky sidebar)
══════════════════════════════════════════════════════════ */
function SummaryCard({ event, visible }) {
  return (
    <aside className={`eb-summary${visible ? ' eb-summary--visible' : ''}`}>
      <div className="eb-card eb-summary__inner">
        <div className="eb-card__eyebrow">REGISTRATION SUMMARY</div>
        <div className="eb-summary__event-img-wrap">
          <img src={event.image} alt={event.name} className="eb-summary__event-img" />
          <div className="eb-summary__img-grad"
            style={{ background: 'linear-gradient(to top, #0d0a09 0%, transparent 70%)' }} />
          <div className="eb-summary__img-label">{event.week}</div>
        </div>
        <div className="eb-summary__event-name">{event.name}</div>
        <div className="eb-summary__event-sub">{event.subtitle}</div>
        <div className="eb-summary__divider" />
        <div className="eb-summary__row">
          <span className="eb-summary__key">Ticket Type</span>
          <span className="eb-summary__val">General Entry</span>
        </div>
        <div className="eb-summary__row">
          <span className="eb-summary__key">Date</span>
          <span className="eb-summary__val">{event.date}</span>
        </div>
        <div className="eb-summary__row">
          <span className="eb-summary__key">Venue</span>
          <span className="eb-summary__val">{event.location}</span>
        </div>
        <div className="eb-summary__row">
          <span className="eb-summary__key">Registration Fee</span>
          <span className="eb-summary__val" style={{ color: event.accent, fontWeight: 700 }}>{event.fee}</span>
        </div>
        <div className="eb-summary__divider" />
        <div className="eb-summary__total-row">
          <span className="eb-summary__total-label">TOTAL</span>
          <span className="eb-summary__total-val" style={{ color: event.accent }}>{event.fee}</span>
        </div>
        <div className="eb-summary__status">
          <span className="eb-status-dot"
            style={{
              background: event.status === 'open' ? '#4ade80' : '#fb923c',
              boxShadow: `0 0 6px ${event.status === 'open' ? '#4ade8066' : '#fb923c66'}`,
            }} />
          {event.statusLabel}
        </div>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════════
   STEP 1 — RegistrationForm
══════════════════════════════════════════════════════════ */
function RegistrationForm({ event, onSuccess, visible }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (name, value) => VALIDATORS[name]?.(value) || '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const required = ['fullName', 'email', 'phone', 'institution'];
    const newErrors = {};
    const newTouched = { ...touched };
    required.forEach((k) => { newTouched[k] = true; newErrors[k] = validate(k, form[k]); });
    setTouched(newTouched);
    setErrors(newErrors);
    if (required.some((k) => newErrors[k])) return;
    onSuccess(form);
  };

  const fieldClass = (name) =>
    `eb-input${touched[name] && errors[name] ? ' eb-input--error' : ''}`;

  return (
    <form
      className={`eb-form${visible ? ' eb-form--visible' : ''}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="eb-card">
        <div className="eb-card__eyebrow">REGISTRATION FORM</div>

        <div className="eb-form__row">
          <div className="eb-form__field">
            <label className="eb-label">Full Name <span className="eb-label__req">*</span></label>
            <input className={fieldClass('fullName')} name="fullName" type="text"
              placeholder="Your full name" value={form.fullName}
              onChange={handleChange} onBlur={handleBlur} />
            {touched.fullName && errors.fullName && <p className="eb-error">{errors.fullName}</p>}
          </div>
          <div className="eb-form__field">
            <label className="eb-label">Email Address <span className="eb-label__req">*</span></label>
            <input className={fieldClass('email')} name="email" type="email"
              placeholder="you@example.com" value={form.email}
              onChange={handleChange} onBlur={handleBlur} />
            {touched.email && errors.email && <p className="eb-error">{errors.email}</p>}
          </div>
        </div>

        <div className="eb-form__row">
          <div className="eb-form__field">
            <label className="eb-label">Phone Number <span className="eb-label__req">*</span></label>
            <input className={fieldClass('phone')} name="phone" type="tel"
              placeholder="+91 98765 43210" value={form.phone}
              onChange={handleChange} onBlur={handleBlur} />
            {touched.phone && errors.phone && <p className="eb-error">{errors.phone}</p>}
          </div>
          <div className="eb-form__field">
            <label className="eb-label">College / Company <span className="eb-label__req">*</span></label>
            <input className={fieldClass('institution')} name="institution" type="text"
              placeholder="Institution or workplace" value={form.institution}
              onChange={handleChange} onBlur={handleBlur} />
            {touched.institution && errors.institution && <p className="eb-error">{errors.institution}</p>}
          </div>
        </div>

        <div className="eb-form__row">
          <div className="eb-form__field">
            <label className="eb-label">Department</label>
            <input className="eb-input" name="department" type="text"
              placeholder="CS / MBA / Marketing…" value={form.department} onChange={handleChange} />
          </div>
          <div className="eb-form__field">
            <label className="eb-label">Year of Study</label>
            <select className="eb-input eb-select" name="yearOfStudy"
              value={form.yearOfStudy} onChange={handleChange}>
              <option value="">Select year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="pg">Post Graduate</option>
              <option value="working">Working Professional</option>
            </select>
          </div>
        </div>

        <div className="eb-form__field">
          <label className="eb-label">Event Selection</label>
          <select className="eb-input eb-select" name="eventSelection"
            value={form.eventSelection} onChange={handleChange}>
            <option value="">Choose your slot / category</option>
            <option value="3km">3 km Run</option>
            <option value="fun">Fun Walk + Games</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </div>

        <div className="eb-form__field">
          <label className="eb-label">Additional Notes</label>
          <textarea className="eb-input eb-textarea" name="notes"
            placeholder="Any dietary restrictions, accessibility needs, or just say hi…"
            rows={3} value={form.notes} onChange={handleChange} />
        </div>

        <button
          type="submit"
          className="eb-submit-btn"
          style={{
            background: `linear-gradient(135deg, ${event.accent}, ${event.accent}cc)`,
            boxShadow: `0 8px 32px ${event.accent}44`,
          }}
        >
          Proceed to Payment
          <span className="eb-submit-btn__arrow">→</span>
        </button>
      </div>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════
   STEP 2 — PaymentPage  (Razorpay wired)
══════════════════════════════════════════════════════════ */
function PaymentPage({ event, formData, onSuccess, onBack, visible }) {
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [paying, setPaying] = useState(false);
  const [rzError, setRzError] = useState('');

  /* Compute final amount */
  const baseAmount = event.feeAmount || 100000; // paise
  const finalAmount = selectedOffer
    ? Math.round(baseAmount * (1 - selectedOffer.discount))
    : baseAmount;
  const finalDisplay = `₹${(finalAmount / 100).toLocaleString('en-IN')}`;
  const saving = baseAmount - finalAmount;

  const handlePay = async () => {
    setRzError('');
    setPaying(true);

    const loaded = await loadRazorpay();
    if (!loaded) {
      setRzError('Could not load Razorpay. Check your internet connection and try again.');
      setPaying(false);
      return;
    }

    /* ── Razorpay options ─────────────────────────────────────
       For production:
         1. Hit your backend → POST /api/create-order → returns order_id
         2. Replace `order_id` below with that value
         3. Verify signature on your backend in the `handler`
       For DEMO: Razorpay test key opens the checkout UI as-is.
    ─────────────────────────────────────────────────────── */
    const options = {
      key: 'rzp_test_1DP5mmOlF5G5ag', // Razorpay public test key
      amount: finalAmount,             // in paise
      currency: 'INR',
      name: event.organizer,
      description: `${event.name} — General Entry`,
      image: event.image,
      // order_id: '<from your backend>',  // uncomment in production

      prefill: {
        name:    formData.fullName,
        email:   formData.email,
        contact: formData.phone,
      },

      notes: {
        event_id:    event.id,
        institution: formData.institution,
        offer_code:  selectedOffer?.id || 'NONE',
      },

      theme: {
        color: event.accent,
      },

      modal: {
        ondismiss: () => {
          setPaying(false);
        },
      },

      handler: (response) => {
        /* In production: verify razorpay_signature on your backend first */
        setPaying(false);
        onSuccess({
          ...formData,
          bookingId: response.razorpay_payment_id || generateBookingId(),
          amountPaid: finalDisplay,
          offerUsed: selectedOffer?.id || null,
        });
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        setRzError(`Payment failed: ${resp.error.description}`);
        setPaying(false);
      });
      rzp.open();
    } catch (err) {
      setRzError('Something went wrong launching Razorpay. Please try again.');
      setPaying(false);
    }
  };

  return (
    <div className={`eb-payment-page${visible ? ' eb-payment-page--visible' : ''}`}>
      {/* Back link */}
      <button className="eb-back-btn eb-back-btn--inline" onClick={onBack}>
        <ArrowLeftIcon /> Edit Details
      </button>

      {/* ── Offers strip (above payment card) ── */}
      <OffersStrip event={event} selectedOffer={selectedOffer} onSelect={setSelectedOffer} />

      <div className="eb-payment-layout">
        {/* ── Left: Payment form ── */}
        <div className="eb-payment-left">
          <div className="eb-card">
            <div className="eb-card__eyebrow">PAYMENT</div>

            {/* Amount display */}
            <div className="eb-payment-amount-block">
              <div className="eb-payment-amount-row">
                <div>
                  <div className="eb-payment-amount-label">Amount to Pay</div>
                  {selectedOffer && (
                    <div className="eb-payment-amount-original">{event.fee}</div>
                  )}
                </div>
                <div className="eb-payment-amount-val" style={{ color: event.accent }}>
                  {finalDisplay}
                </div>
              </div>
              {selectedOffer && (
                <div className="eb-payment-saving-badge"
                  style={{ color: event.accent, borderColor: `${event.accent}44`, background: `${event.accent}10` }}>
                  🎉 You save ₹{(saving / 100).toLocaleString('en-IN')} with <strong>{selectedOffer.id}</strong>
                </div>
              )}
              {!selectedOffer && (
                <p className="eb-payment-offer-nudge">
                  ↑ Apply an offer above to get a discount
                </p>
              )}
            </div>

            {/* Error */}
            {rzError && (
              <div className="eb-rz-error">
                ⚠ {rzError}
              </div>
            )}

            {/* Pay button */}
            <button
              className="eb-submit-btn"
              disabled={paying}
              style={{
                background: paying
                  ? 'rgba(255,107,0,0.35)'
                  : `linear-gradient(135deg, ${event.accent}, ${event.accent}cc)`,
                boxShadow: paying ? 'none' : `0 8px 32px ${event.accent}44`,
                marginTop: '0.5rem',
              }}
              onClick={handlePay}
            >
              {paying ? (
                <><SpinnerIcon /> Opening Razorpay…</>
              ) : (
                <>Pay {finalDisplay} via Razorpay <span className="eb-submit-btn__arrow">→</span></>
              )}
            </button>

            <div className="eb-payment__badges">
              <span className="eb-badge"><LockIcon /> SSL Secured</span>
              <span className="eb-badge">⚡ Instant Confirmation</span>
              <span className="eb-badge">↩ Easy Refunds</span>
              <span className="eb-badge">🛡 Razorpay Protected</span>
            </div>
          </div>
        </div>

        {/* ── Right: Order summary ── */}
        <div className="eb-payment-right">
          <div className="eb-card">
            <div className="eb-card__eyebrow">ORDER SUMMARY</div>
            <div className="eb-order-summary">
              <div className="eb-order-summary__img-wrap">
                <img src={event.image} alt={event.name} className="eb-order-summary__img" />
                <div
                  className="eb-order-summary__img-grad"
                  style={{ background: 'linear-gradient(to top, #0d0a09 0%, transparent 70%)' }}
                />
              </div>
              <div className="eb-order-summary__name">{event.name}</div>
              <div className="eb-order-summary__sub">{event.subtitle}</div>
              <div className="eb-summary__divider" style={{ margin: '1rem 0' }} />
              <div className="eb-summary__row">
                <span className="eb-summary__key">Attendee</span>
                <span className="eb-summary__val">{formData.fullName}</span>
              </div>
              <div className="eb-summary__row">
                <span className="eb-summary__key">Email</span>
                <span className="eb-summary__val" style={{ wordBreak: 'break-all' }}>{formData.email}</span>
              </div>
              <div className="eb-summary__row">
                <span className="eb-summary__key">Date</span>
                <span className="eb-summary__val">{event.date}</span>
              </div>
              <div className="eb-summary__row">
                <span className="eb-summary__key">Venue</span>
                <span className="eb-summary__val">{event.location}</span>
              </div>
              {selectedOffer && (
                <div className="eb-summary__row">
                  <span className="eb-summary__key">Offer Applied</span>
                  <span className="eb-summary__val" style={{ color: event.accent }}>{selectedOffer.id}</span>
                </div>
              )}
              <div className="eb-summary__divider" style={{ margin: '1rem 0' }} />
              {selectedOffer && (
                <div className="eb-summary__row">
                  <span className="eb-summary__key">Original</span>
                  <span className="eb-summary__val" style={{ textDecoration: 'line-through', opacity: 0.4 }}>{event.fee}</span>
                </div>
              )}
              <div className="eb-summary__total-row">
                <span className="eb-summary__total-label">TOTAL</span>
                <span className="eb-summary__total-val" style={{ color: event.accent }}>{finalDisplay}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STEP 3 — SuccessScreen (Ticket)
══════════════════════════════════════════════════════════ */
function SuccessScreen({ event, data, onHome }) {
  const [show, setShow] = useState(false);
  const ticketRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleDownload = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>ANVA Ticket — ${event.name}</title>
        <style>
          body { font-family: system-ui, sans-serif; background: #0d0a09; color: #fff; padding: 2rem; }
          .ticket { max-width: 480px; margin: auto; border: 1px solid ${event.accent}44;
            border-radius: 16px; overflow: hidden; }
          .ticket-header { background: ${event.accent}22; padding: 1.5rem; border-bottom: 1px dashed ${event.accent}44; }
          .ticket-header h2 { margin: 0 0 .25rem; color: ${event.accent}; font-size: 1.5rem; }
          .booking-id { font-size: .75rem; color: rgba(255,255,255,.4); letter-spacing: .1em; }
          .booking-id span { color: ${event.accent}; font-weight: 700; }
          .ticket-body { padding: 1.5rem; }
          .ticket-row { display: flex; justify-content: space-between; padding: .6rem 0;
            border-bottom: 1px solid rgba(255,255,255,.06); font-size: .875rem; }
          .ticket-row span:first-child { color: rgba(255,255,255,.4); }
          .ticket-row span:last-child { font-weight: 600; }
          .fee { color: ${event.accent} !important; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="ticket-header">
            <h2>${event.name}</h2>
            <div class="booking-id">Booking ID: <span>${data?.bookingId}</span></div>
          </div>
          <div class="ticket-body">
            <div class="ticket-row"><span>Name</span><span>${data?.fullName}</span></div>
            <div class="ticket-row"><span>Email</span><span>${data?.email}</span></div>
            <div class="ticket-row"><span>Date</span><span>${event.date}</span></div>
            <div class="ticket-row"><span>Venue</span><span>${event.locationFull}</span></div>
            <div class="ticket-row"><span>Time</span><span>${event.time}</span></div>
            <div class="ticket-row"><span>Fee Paid</span><span class="fee">${data?.amountPaid || event.fee}</span></div>
            ${data?.offerUsed ? `<div class="ticket-row"><span>Offer Used</span><span class="fee">${data.offerUsed}</span></div>` : ''}
          </div>
        </div>
        <script>window.onload = () => { window.print(); }<\/script>
      </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className={`eb-success${show ? ' eb-success--visible' : ''}`}>
      <div
        className="eb-success__glow"
        style={{ background: `radial-gradient(ellipse 60% 40% at 50% 40%, ${event.accent}33 0%, transparent 70%)` }}
      />

      <div className="eb-success__icon-wrap"
        style={{ borderColor: `${event.accent}55`, background: `${event.accent}11` }}>
        <div className="eb-success__check-ring" style={{ borderColor: event.accent }}>
          <CheckIcon />
        </div>
      </div>

      <h2 className="eb-success__title" style={{ color: event.accent }}>You're Registered!</h2>
      <p className="eb-success__sub">
        Your spot is confirmed for <strong>{event.name}</strong>. We can't wait to run with you.
      </p>

      {/* Ticket */}
      <div className="eb-success__ticket" ref={ticketRef}>
        <div
          className="eb-success__ticket-header"
          style={{ background: `linear-gradient(135deg, ${event.accent}22, ${event.accent}08)` }}
        >
          <div className="eb-success__ticket-event">{event.name}</div>
          <div className="eb-success__booking-id">
            Booking ID: <span style={{ color: event.accent }}>{data?.bookingId}</span>
          </div>
        </div>
        <div className="eb-success__ticket-body">
          <div className="eb-success__ticket-row"><span>Name</span><span>{data?.fullName}</span></div>
          <div className="eb-success__ticket-row"><span>Email</span><span>{data?.email}</span></div>
          <div className="eb-success__ticket-row"><span>Date</span><span>{event.date}</span></div>
          <div className="eb-success__ticket-row"><span>Venue</span><span>{event.locationFull}</span></div>
          <div className="eb-success__ticket-row"><span>Time</span><span>{event.time}</span></div>
          <div className="eb-success__ticket-row">
            <span>Fee Paid</span>
            <span style={{ color: event.accent }}>{data?.amountPaid || event.fee}</span>
          </div>
          {data?.offerUsed && (
            <div className="eb-success__ticket-row">
              <span>Offer Used</span>
              <span style={{ color: event.accent }}>{data.offerUsed}</span>
            </div>
          )}
        </div>

        {/* Dashed perforation line */}
        <div className="eb-ticket-perf" style={{ borderColor: `${event.accent}33` }}>
          <span className="eb-ticket-perf__notch eb-ticket-perf__notch--left"
            style={{ background: '#050505' }} />
          <span className="eb-ticket-perf__notch eb-ticket-perf__notch--right"
            style={{ background: '#050505' }} />
        </div>

        <div className="eb-success__ticket-footer">
          <div className="eb-ticket-qr" style={{ borderColor: `${event.accent}33` }}>
            <svg viewBox="0 0 80 80" width="64" height="64" fill={event.accent} opacity="0.7">
              <rect x="0" y="0" width="32" height="32" rx="4" fill="none" stroke={event.accent} strokeWidth="4"/>
              <rect x="8" y="8" width="16" height="16" rx="2"/>
              <rect x="48" y="0" width="32" height="32" rx="4" fill="none" stroke={event.accent} strokeWidth="4"/>
              <rect x="56" y="8" width="16" height="16" rx="2"/>
              <rect x="0" y="48" width="32" height="32" rx="4" fill="none" stroke={event.accent} strokeWidth="4"/>
              <rect x="8" y="56" width="16" height="16" rx="2"/>
              <rect x="48" y="48" width="8" height="8" rx="1"/>
              <rect x="60" y="48" width="8" height="8" rx="1"/>
              <rect x="72" y="48" width="8" height="8" rx="1"/>
              <rect x="48" y="60" width="8" height="8" rx="1"/>
              <rect x="72" y="60" width="8" height="8" rx="1"/>
              <rect x="48" y="72" width="8" height="8" rx="1"/>
              <rect x="60" y="72" width="20" height="8" rx="1"/>
            </svg>
          </div>
          <div className="eb-ticket-footer-text" style={{ color: `rgba(255,255,255,0.3)` }}>
            Scan at entry · {event.organizer}
          </div>
        </div>
      </div>

      <div className="eb-success__actions">
        <button
          className="eb-success__dl-btn"
          style={{ borderColor: `${event.accent}55`, color: event.accent }}
          onClick={handleDownload}
        >
          <DownloadIcon /> Download Ticket
        </button>
        <button
          className="eb-success__home-btn"
          style={{
            background: `linear-gradient(135deg, ${event.accent}, ${event.accent}cc)`,
            boxShadow: `0 8px 32px ${event.accent}44`,
          }}
          onClick={onHome}
        >
          <HomeIcon /> Back to Home
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Root — EventBookingPage
══════════════════════════════════════════════════════════ */
export default function EventBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const event = DEFAULT_EVENT; // Next.js: pass event data via query params or use DEFAULT_EVENT



  const [step, setStep]               = useState(1);
  const [formData, setFormData]       = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [visible, setVisible]         = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const goToStep = (n) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setVisible(false);
    setTimeout(() => {
      setStep(n);
      setVisible(true);
    }, 200);
  };

  const handleFormDone    = (data) => { setFormData(data); goToStep(2); };
  const handlePaymentDone = (data) => { setSuccessData(data); goToStep(3); };

  /* ── Step 3: Success / Ticket ── */
  if (step === 3) {
    return (
      <div className="eb-root">
        <div className="eb-ambient"
          style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${event.accent}18 0%, transparent 60%)` }}
        />
        <div className="eb-page eb-page--success">
          <StepBar step={3} accent={event.accent} />
          <SuccessScreen event={event} data={successData} onHome={() => router.push('/')} />
        </div>
      </div>
    );
  }

  /* ── Step 2: Payment ── */
  if (step === 2) {
    return (
      <div className="eb-root">
        <div className="eb-ambient"
          style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${event.accent}18 0%, transparent 60%)` }}
        />
        <div className="eb-page">
          <StepBar step={2} accent={event.accent} />
          <PaymentPage
            event={event}
            formData={formData}
            onSuccess={handlePaymentDone}
            onBack={() => goToStep(1)}
            visible={visible}
          />
        </div>
      </div>
    );
  }

  /* ── Step 1: Details + Form ── */
  return (
    <div className="eb-root">
      <div className="eb-ambient"
        style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${event.accent}18 0%, transparent 60%)` }}
      />

      <div className={`eb-back-wrap${visible ? ' eb-back-wrap--visible' : ''}`}>
        <button className="eb-back-btn" onClick={() => router.back()}>
          <ArrowLeftIcon /> Back
        </button>
      </div>

      <StepBar step={1} accent={event.accent} />
      <HeroBanner event={event} visible={visible} />

      <div className="eb-body">
        <div className="eb-body__main">
          <EventDetails event={event} visible={visible} />
          <RegistrationForm event={event} onSuccess={handleFormDone} visible={visible} />
        </div>
        <SummaryCard event={event} visible={visible} />
      </div>
    </div>
  );
}