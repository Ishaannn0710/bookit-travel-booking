'use client';

import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface Experience {
  id: string;
  title: string;
  location: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

const mockExperiences: Experience[] = [
  {
    id: '1',
    title: 'Kayaking',
    location: 'Udupi',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 999,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
    category: 'Water Sports'
  },
  {
    id: '2',
    title: 'Nandi Hills Sunrise',
    location: 'Bangalore',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 899,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    category: 'Adventure'
  },
  {
    id: '3',
    title: 'Coffee Trail',
    location: 'Coorg',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 1299,
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
    category: 'Nature'
  },
  {
    id: '4',
    title: 'Kayaking',
    location: 'Udupi, Karnataka',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 999,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
    category: 'Water Sports'
  },
  {
    id: '5',
    title: 'Nandi Hills Sunrise',
    location: 'Bangalore',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 899,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    category: 'Adventure'
  },
  {
    id: '6',
    title: 'Boat Cruise',
    location: 'Sunderban',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 999,
    imageUrl: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=600&h=400&fit=crop',
    category: 'Water Sports'
  },
  {
    id: '7',
    title: 'Bunjee Jumping',
    location: 'Manali',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 999,
    imageUrl: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=600&h=400&fit=crop',
    category: 'Adventure'
  },
  {
    id: '8',
    title: 'Coffee Trail',
    location: 'Coorg',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 1299,
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
    category: 'Nature'
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredExperiences(experiences);
    } else {
      const filtered = experiences.filter(exp =>
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredExperiences(filtered);
    }
  }, [searchQuery, experiences]);

  const fetchExperiences = async () => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const response = await fetch(`${API_URL}/api/experiences`);
    const data = await response.json();
    // Use backend data if available AND has 8+ items, otherwise use mock
    if (data.data && data.data.length >= 8) {
      setExperiences(data.data);
      setFilteredExperiences(data.data);
    } else {
      setExperiences(mockExperiences);
      setFilteredExperiences(mockExperiences);
    }
  } catch (error) {
    console.error('Error:', error);
    setExperiences(mockExperiences);
    setFilteredExperiences(mockExperiences);
  } finally {
    setIsLoading(false);
  }
};
  const handleCardClick = (id: string) => {
    window.location.href = `/experiences/${id}`;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9F9F9', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #E9E9E9',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ 
          maxWidth: '1440px', 
          margin: '0 auto',
          padding: '16px clamp(16px, 5vw, 124px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              backgroundColor: '#000',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MapPin style={{ width: '20px', height: '20px', color: '#FFD643' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
              <span style={{ fontWeight: 700, fontSize: '14px' }}>highway</span>
              <span style={{ fontWeight: 700, fontSize: '14px' }}>delite</span>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            flex: '1',
            maxWidth: '600px',
            minWidth: '200px'
          }}>
            <input
              type="text"
              placeholder="Search experiences"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                backgroundColor: '#F9F9F9',
                border: '1px solid #E9E9E9',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button style={{
              padding: '12px 32px',
              backgroundColor: '#FFD643',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap'
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
            }}>
              Search
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '32px clamp(16px, 5vw, 124px)',
        flex: 1,
        width: '100%'
      }}>
        {isLoading ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '24px',
            width: '100%'
          }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ 
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <div style={{ height: '192px', backgroundColor: '#E9E9E9' }} />
                <div style={{ padding: '16px' }}>
                  <div style={{ height: '16px', backgroundColor: '#E9E9E9', borderRadius: '4px', marginBottom: '8px' }} />
                  <div style={{ height: '12px', backgroundColor: '#E9E9E9', borderRadius: '4px', width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredExperiences.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
              No experiences found
            </h3>
            <p style={{ color: '#6B7280' }}>Try a different search term</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '24px',
            width: '100%'
          }}>
            {filteredExperiences.map((exp, index) => (
              <div
                key={`${exp.id}-${index}`}
                onClick={() => handleCardClick(exp.id)}
                style={{
                  backgroundColor: '#FEFEFE',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid #F5F5F5'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                }}
              >
                {/* Image */}
                <div style={{ 
                  height: '192px', 
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img 
                    src={exp.imageUrl} 
                    alt={exp.title}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                </div>

                {/* Content */}
                <div style={{ padding: '16px' }}>
                  {/* Title & Location Badge */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'start', 
                    marginBottom: '8px',
                    gap: '8px'
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ 
                        fontSize: '16px', 
                        fontWeight: 700, 
                        marginBottom: '4px',
                        color: '#000',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {exp.title}
                      </h3>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        fontSize: '12px',
                        color: '#6B7280'
                      }}>
                        <MapPin style={{ width: '12px', height: '12px', flexShrink: 0 }} />
                        <span style={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>{exp.location}</span>
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: '#F5F5F5',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#6B7280',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}>
                      {exp.location.split(',')[0]}
                    </span>
                  </div>

                  {/* Description */}
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#6B7280',
                    marginBottom: '16px',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '36px'
                  }}>
                    {exp.description}
                  </p>

                  {/* Price & Button */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div>
                      <span style={{ fontSize: '12px', color: '#6B7280' }}>From </span>
                      <span style={{ fontSize: '18px', fontWeight: 700, color: '#000' }}>
                        ₹{exp.price}
                      </span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(exp.id);
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#FFD643',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFC833';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFD643';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: 'white', 
        borderTop: '1px solid #E9E9E9',
        marginTop: 'auto'
      }}>
        <div style={{ 
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '32px clamp(16px, 5vw, 124px)',
          textAlign: 'center'
        }}>
          <p style={{ 
            fontSize: '14px', 
            color: '#6B7280',
            margin: 0
          }}>
            © 2025 Highway Delite. Built with ❤️ for adventure seekers.
          </p>
        </div>
      </footer>
    </div>
  );
}