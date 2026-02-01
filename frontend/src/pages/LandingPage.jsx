import { Link, useNavigate } from "react-router-dom";
import { FiVideo, FiBook, FiZap, FiCheck, FiArrowRight, FiPlay } from "react-icons/fi";
import { useEffect, useState } from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const features = [
    {
      icon: FiVideo,
      title: "Video-Based Learning",
      description: "Learn from any YouTube video with our integrated player and smart controls."
    },
    {
      icon: FiBook,
      title: "Smart Note-Taking",
      description: "Rich text editor with formatting, lists, and links to organize your thoughts."
    },
    {
      icon: FiZap,
      title: "AI Tutor Assistant",
      description: "Get instant help from our AI tutor powered by Google Gemini."
    }
  ];

  const benefits = [
    "Unlimited study sessions",
    "Save and download your notes",
    "AI-powered learning assistance",
    "Progress tracking",
    "Free forever"
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '400px',
          height: '400px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'float 8s ease-in-out infinite reverse'
        }} />

        {/* Navigation */}
        <nav style={{
          padding: '20px 60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiVideo size={24} style={{ color: 'white' }} />
            </div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '800',
              color: 'white',
              margin: 0
            }}>
              StudySpace
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            {isLoggedIn ? (
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: '12px 28px',
                  background: 'white',
                  color: '#667EEA',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                }}
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    padding: '12px 28px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'inline-block',
                    transition: 'all 0.3s'
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  style={{
                    padding: '12px 28px',
                    background: 'white',
                    color: '#667EEA',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'inline-block',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Hero Content */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '100px 60px 120px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10
        }}>
          <h1 style={{
            fontSize: '64px',
            fontWeight: '900',
            color: 'white',
            marginBottom: '24px',
            lineHeight: '1.1',
            textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)'
          }}>
            Learn Smarter with AI
          </h1>
          <p style={{
            fontSize: '22px',
            color: 'rgba(255, 255, 255, 0.95)',
            marginBottom: '48px',
            maxWidth: '700px',
            margin: '0 auto 48px',
            lineHeight: '1.6'
          }}>
            Transform any YouTube video into an interactive study session with AI-powered assistance and smart note-taking.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link
              to={isLoggedIn ? "/dashboard" : "/register"}
              style={{
                padding: '18px 36px',
                background: 'white',
                color: '#667EEA',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)'
              }}
            >
              <FiPlay size={20} />
              {isLoggedIn ? "Go to Dashboard" : "Start Learning Free"}
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: '60px',
            justifyContent: 'center',
            marginTop: '80px'
          }}>
            {[
              { number: '100%', label: 'Free Forever' },
              { number: 'AI', label: 'Powered Tutoring' },
              { number: '∞', label: 'Unlimited Sessions' }
            ].map((stat, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  color: 'white',
                  marginBottom: '8px'
                }}>
                  {stat.number}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: '500'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '100px 60px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: '800',
            color: '#111827',
            marginBottom: '16px'
          }}>
            Everything You Need to Learn
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#6B7280',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Powerful features designed to enhance your learning experience
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '40px'
        }}>
          {features.map((feature, idx) => (
            <div key={idx} style={{
              background: 'white',
              padding: '40px',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.3s',
              border: '1px solid #E5E7EB'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)';
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <feature.icon size={28} style={{ color: 'white' }} />
              </div>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '12px'
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '15px',
                color: '#6B7280',
                lineHeight: '1.6',
                margin: 0
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
        padding: '100px 60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10
        }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: '800',
            color: 'white',
            marginBottom: '24px'
          }}>
            Ready to Start Learning?
          </h2>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.95)',
            marginBottom: '24px'
          }}>
            Join thousands of learners using AI to master new skills
          </p>

          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '40px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '16px',
              textAlign: 'left'
            }}>
              {benefits.map((benefit, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FiCheck size={14} />
                  </div>
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          <Link
            to={isLoggedIn ? "/dashboard" : "/register"}
            style={{
              padding: '18px 40px',
              background: 'white',
              color: '#667EEA',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.3s',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)'
            }}
          >
            {isLoggedIn ? "Go to Dashboard" : "Get Started Free"}
            <FiArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: '#111827',
        padding: '40px 60px',
        textAlign: 'center'
      }}>
        <p style={{
          color: '#9CA3AF',
          fontSize: '14px',
          margin: 0
        }}>
          © 2026 StudySpace. Powered by AI • Made with ❤️ for learners
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
