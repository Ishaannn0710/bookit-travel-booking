'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';

const API_URL = 'https://bookit-travel-booking-production.up.railway.app';

export default function Checkout() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem('bookingData');
    if (storedData) {
      setBookingDetails(JSON.parse(storedData));
    } else {
      setBookingDetails({
        experience: 'Kayaking',
        date: '2025-10-22',
        time: getCurrentTime(),
        quantity: 1,
        subtotal: 999,
        taxes: 59,
        total: 958
      });
    }
  }, []);

  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  if (!bookingDetails) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F9F9F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #E9E9E9', borderTopColor: '#FFD643', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#6B7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9F9F9' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E9E9E9',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#000000',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MapPin style={{ width: '20px', height: '20px', color: '#FFD643' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#000000' }}>highway</span>
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#000000' }}>delite</span>
            </div>
          </div>
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#FFD643',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FFC833';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFD643';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            Search
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <button
          onClick={() => window.history.back()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            color: '#000000',
            padding: '20px 0',
            marginBottom: '16px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <ArrowLeft style={{ width: '20px', height: '20px' }} />
          Checkout
        </button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth >= 768 ? '1fr 387px' : '1fr',
          gap: '24px'
        }}>
          {/* Left Column - Form */}
          <div style={{
            backgroundColor: '#FEFEFE',
            border: '1px solid #F0F0F0',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth >= 640 ? '1fr 1fr' : '1fr',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#000000',
                  marginBottom: '8px'
                }}>
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#EFEFEF',
                    border: '1px solid #E9E9E9',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#FFD643';
                    e.currentTarget.style.backgroundColor = '#FFFBF0';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E9E9E9';
                    e.currentTarget.style.backgroundColor = '#EFEFEF';
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#000000',
                  marginBottom: '8px'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#EFEFEF',
                    border: '1px solid #E9E9E9',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#FFD643';
                    e.currentTarget.style.backgroundColor = '#FFFBF0';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E9E9E9';
                    e.currentTarget.style.backgroundColor = '#EFEFEF';
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                color: '#000000',
                marginBottom: '8px'
              }}>
                Promo code
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: window.innerWidth < 400 ? 'wrap' : 'nowrap' }}>
                <input
                  type="text"
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  style={{
                    flex: '1',
                    minWidth: window.innerWidth < 400 ? '100%' : '0',
                    padding: '12px 16px',
                    backgroundColor: '#EFEFEF',
                    border: '1px solid #E9E9E9',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#FFD643';
                    e.currentTarget.style.backgroundColor = '#FFFBF0';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E9E9E9';
                    e.currentTarget.style.backgroundColor = '#EFEFEF';
                  }}
                />
                <button 
                  onClick={async () => {
                    if (!promoCode) {
                      alert('Please enter a promo code');
                      return;
                    }

                    if (promoApplied) {
                      alert('Promo code already applied');
                      return;
                    }

                    try {
                      const response = await fetch(`https://bookit-travel-booking-production.up.railway.app/api/promo/validate`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code: promoCode, subtotal: bookingDetails.subtotal })
                      });

                      const data = await response.json();

                      if (data.success && data.data.valid) {
                        setDiscount(data.data.discount);
                        setPromoApplied(true);
                      } else {
                        alert('Invalid promo code');
                      }
                    } catch (error) {
                      console.error('Error validating promo:', error);
                      alert('Failed to validate promo code');
                    }
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    width: window.innerWidth < 400 ? '100%' : 'auto',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#333333';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#000000';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Apply
                </button>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'start',
              gap: '8px'
            }}>
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  marginTop: '2px',
                  cursor: 'pointer',
                  accentColor: '#FFD643'
                }}
              />
              <label htmlFor="terms" style={{
                fontSize: '14px',
                color: '#6B7280',
                cursor: 'pointer'
              }}>
                I agree to the terms and safety policy
              </label>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div>
            <div style={{
              position: 'relative',
              backgroundColor: '#FEFEFE',
              border: '1px solid #F0F0F0',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>Experience</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#000000' }}>{bookingDetails.experience}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>Date</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#000000' }}>{bookingDetails.date}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>Time</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#000000' }}>{bookingDetails.time}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid #F0F0F0'
              }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>Qty</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#000000' }}>{bookingDetails.quantity}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>Subtotal</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#000000' }}>₹{bookingDetails.subtotal}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: discount > 0 ? '12px' : '16px',
                paddingBottom: discount > 0 ? '0' : '16px',
                borderBottom: discount > 0 ? 'none' : '1px solid #F0F0F0'
              }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>Taxes</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#000000' }}>₹{bookingDetails.taxes}</span>
              </div>

              {discount > 0 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #F0F0F0'
                }}>
                  <span style={{ fontSize: '14px', color: '#10B981' }}>Discount</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#10B981' }}>-₹{discount}</span>
                </div>
              )}

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#000000' }}>Total</span>
                <span style={{ fontSize: '24px', fontWeight: 700, color: '#000000' }}>
                  ₹{bookingDetails.subtotal + bookingDetails.taxes - discount}
                </span>
              </div>

              <button
                onClick={() => {
                  if (!fullName || !email) {
                    alert('Please fill all fields');
                    return;
                  }
                  if (!email.includes('@')) {
                    alert('Please enter a valid email address');
                    return;
                  }
                  if (!agreedToTerms) {
                    alert('Please agree to terms');
                    return;
                  }
                  
                  sessionStorage.setItem('confirmationData', JSON.stringify({
                    ...bookingDetails,
                    userName: fullName,
                    userEmail: email
                  }));
                  
                  window.location.href = '/confirmation';
                }}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#FFD643',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#000000',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFC833';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 214, 67, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFD643';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Pay and Confirm
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}