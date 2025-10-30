'use client';

import React from 'react';
import { Check, MapPin } from 'lucide-react';

export default function Confirmation() {
  const referenceId = 'HUF56&SO';

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
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
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

          {/* Search Button */}
          <button style={{
            padding: '12px 32px',
            backgroundColor: '#FFD643',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            Search
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '80px 124px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 72px)'
      }}>
        {/* Success Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#10B981',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px'
        }}>
          <Check style={{ width: '48px', height: '48px', color: '#FFFFFF', strokeWidth: 3 }} />
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: 700,
          color: '#000000',
          margin: '0 0 16px 0',
          textAlign: 'center'
        }}>
          Booking Confirmed
        </h1>

        {/* Reference ID */}
        <p style={{
          fontSize: '16px',
          color: '#6B7280',
          margin: '0 0 32px 0',
          textAlign: 'center'
        }}>
          Ref ID: {referenceId}
        </p>

        {/* Back to Home Button */}
        <button
          onClick={() => window.location.href = '/'}
          style={{
            padding: '12px 32px',
            backgroundColor: '#E9E9E9',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#000000',
            cursor: 'pointer'
          }}
        >
          Back to Home
        </button>
      </main>
    </div>
  );
}