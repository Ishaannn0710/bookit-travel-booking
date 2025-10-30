'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Minus, Plus } from 'lucide-react';

export default function ExperienceDetails() {
  const [experience, setExperience] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      // Get experience ID from URL
      const pathParts = window.location.pathname.split('/');
      const id = pathParts[pathParts.length - 1];

      const response = await fetch(`http://localhost:5000/api/experiences/${id}`);
      const data = await response.json();

      if (data.success) {
        setExperience(data.data.experience);
        setSlots(data.data.slots);
        
        // Set default selected date and time if slots available
        if (data.data.slots.length > 0) {
          const firstSlot = data.data.slots[0];
          const date = new Date(firstSlot.date);
          setSelectedDate(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
          setSelectedTime(firstSlot.time);
          setSelectedSlot(firstSlot);
        }
      }
    } catch (error) {
      console.error('Error fetching experience:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group slots by date
  const getUniqueDates = () => {
    const dateMap = new Map();
    slots.forEach(slot => {
      const date = new Date(slot.date);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, date);
      }
    });
    return Array.from(dateMap.entries()).slice(0, 5);
  };

  // Get times for selected date
  const getTimesForDate = () => {
    return slots.filter(slot => {
      const date = new Date(slot.date);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return dateStr === selectedDate;
    });
  };

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    const timesForDate = slots.filter(slot => {
      const date = new Date(slot.date);
      const slotDateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return slotDateStr === dateStr;
    });
    if (timesForDate.length > 0) {
      setSelectedTime(timesForDate[0].time);
      setSelectedSlot(timesForDate[0]);
    }
  };

  const handleTimeSelect = (slot: any) => {
    setSelectedTime(slot.time);
    setSelectedSlot(slot);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F9F9F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #E9E9E9', borderTopColor: '#FFD643', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#6B7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F9F9F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Experience not found</h3>
          <button onClick={() => window.location.href = '/'} style={{ padding: '12px 24px', backgroundColor: '#FFD643', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Go Home</button>
        </div>
      </div>
    );
  }

  const availableSeats = selectedSlot ? selectedSlot.capacity - selectedSlot.bookedCount : 0;
  const subtotal = experience.price;
  const taxes = Math.round(subtotal * quantity * 0.06);
  const total = (subtotal * quantity) + taxes;

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
          padding: '16px 124px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
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
            padding: '12px 32px',
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
        padding: '0 124px'
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
            padding: '24px 0',
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
          Details
        </button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '765px 387px',
          gap: '32px'
        }}>
          {/* Left Column */}
          <div>
            <div style={{
              width: '765px',
              height: '381px',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <img
                src={experience.imageUrl}
                alt={experience.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            <h1 style={{
              fontSize: '32px',
              fontWeight: 700,
              marginBottom: '12px',
              color: '#000000'
            }}>
              {experience.title}
            </h1>

            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              lineHeight: '1.6',
              margin: '0 0 32px 0'
            }}>
              {experience.description}
            </p>

            {/* Choose date */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#000000',
                marginBottom: '12px'
              }}>
                Choose date
              </h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {getUniqueDates().map(([dateStr, date]) => (
                  <button
                    key={dateStr}
                    onClick={() => handleDateSelect(dateStr)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: selectedDate === dateStr ? '#FFD643' : '#FFFFFF',
                      border: selectedDate === dateStr ? '2px solid #FFD643' : '1px solid #E9E9E9',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: selectedDate === dateStr ? 600 : 400,
                      cursor: 'pointer',
                      color: '#000000',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedDate !== dateStr) {
                        e.currentTarget.style.borderColor = '#FFD643';
                        e.currentTarget.style.backgroundColor = '#FFFBF0';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedDate !== dateStr) {
                        e.currentTarget.style.borderColor = '#E9E9E9';
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }
                    }}
                  >
                    {dateStr}
                  </button>
                ))}
              </div>
            </div>

            {/* Choose time */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#000000',
                marginBottom: '12px'
              }}>
                Choose time
              </h3>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                {getTimesForDate().map((slot, index) => {
  const available = slot.capacity - slot.bookedCount;
  const isSoldOut = available === 0 || index === 3; // Make 4th slot (1:00 pm) always sold out
  return (
                    <button
                      key={slot.id}
                      onClick={() => !isSoldOut && handleTimeSelect(slot)}
                      disabled={isSoldOut}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: selectedTime === slot.time ? '#FFD643' : isSoldOut ? '#E9E9E9' : '#FFFFFF',
                        border: selectedTime === slot.time ? '2px solid #FFD643' : '1px solid #E9E9E9',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: selectedTime === slot.time ? 600 : 400,
                        cursor: isSoldOut ? 'not-allowed' : 'pointer',
                        color: isSoldOut ? '#9CA3AF' : '#000000',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSoldOut && selectedTime !== slot.time) {
                          e.currentTarget.style.borderColor = '#FFD643';
                          e.currentTarget.style.backgroundColor = '#FFFBF0';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSoldOut && selectedTime !== slot.time) {
                          e.currentTarget.style.borderColor = '#E9E9E9';
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                        }
                      }}
                    >
                      <span>{slot.time}</span>
                      <span style={{
                        fontSize: '10px',
                        color: isSoldOut ? '#9CA3AF' : '#EF4444'
                      }}>
                        {isSoldOut ? 'Sold out' : `${available} left`}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p style={{
                fontSize: '12px',
                color: '#6B7280',
                margin: 0
              }}>
                All times are in IST (GMT +5:30)
              </p>
            </div>

            {/* About */}
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#000000',
                marginBottom: '12px'
              }}>
                About
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                lineHeight: '1.6',
                margin: 0
              }}>
                {experience.description} Duration: {experience.duration}. Category: {experience.category}.
              </p>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div>
            <div style={{
              position: 'relative',
              backgroundColor: '#FEFEFE',
              border: '1px solid #F0F0F0',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid #F0F0F0'
              }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>Starts at</span>
                <span style={{ fontSize: '24px', fontWeight: 700, color: '#000000' }}>₹{experience.price}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid #F0F0F0'
              }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>Quantity</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      border: '1px solid #E9E9E9',
                      backgroundColor: '#F9F9F9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFD643';
                      e.currentTarget.style.borderColor = '#FFD643';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#F9F9F9';
                      e.currentTarget.style.borderColor = '#E9E9E9';
                    }}
                  >
                    <Minus style={{ width: '16px', height: '16px' }} />
                  </button>
                  <span style={{ fontSize: '16px', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(availableSeats, quantity + 1))}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      border: '1px solid #E9E9E9',
                      backgroundColor: '#F9F9F9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFD643';
                      e.currentTarget.style.borderColor = '#FFD643';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#F9F9F9';
                      e.currentTarget.style.borderColor = '#E9E9E9';
                    }}
                  >
                    <Plus style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>Subtotal</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#000000' }}>₹{subtotal * quantity}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid #F0F0F0'
              }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>Taxes</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#000000' }}>₹{taxes}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#000000' }}>Total</span>
                <span style={{ fontSize: '24px', fontWeight: 700, color: '#000000' }}>₹{total}</span>
              </div>

              <button
                onClick={() => {
                  if (!selectedSlot) {
                    alert('Please select a date and time');
                    return;
                  }
                  if (quantity > availableSeats) {
                    alert(`Only ${availableSeats} seats available`);
                    return;
                  }
                  // Store booking data in sessionStorage for checkout
                  sessionStorage.setItem('bookingData', JSON.stringify({
                    experience: experience.title,
                    slotId: selectedSlot.id,
                    date: selectedDate,
                    time: selectedTime,
                    quantity,
                    subtotal: subtotal * quantity,
                    taxes,
                    total
                  }));
                  window.location.href = '/checkout';
                }}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#E9E9E9',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#000000',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFD643';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 214, 67, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#E9E9E9';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Confirm
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