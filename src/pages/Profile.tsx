import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [distance, setDistance] = useState(10);
  const [preferences, setPreferences] = useState({
    dining: true,
    outdoor: true,
    entertainment: true,
    cultural: false,
    adventure: false
  });

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences({
      ...preferences,
      [e.target.name]: e.target.checked
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ priceRange, distance, preferences });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body">
              {/* User Info Section */}
              <div className="text-center mb-4">
                <div className="display-6 mb-3">Welcome, {user?.name || 'User'}</div>
                <p className="text-muted">{user?.email}</p>
              </div>

              <hr className="my-4" />

              {/* Preferences Form */}
              <form onSubmit={handleSubmit}>
                {/* Price Range Slider */}
                <div className="mb-4">
                  <label className="form-label">
                    Price Range (${priceRange[0]} - ${priceRange[1]})
                  </label>
                  <div className="price-range-container position-relative mb-4">
                    <RangeSlider
                      min={0}
                      max={200}
                      step={5}
                      value={priceRange}
                      onInput={handlePriceChange}
                      className="price-range-slider"
                    />
                  </div>
                </div>

                {/* Distance Slider */}
                <div className="mb-4">
                  <label className="form-label">
                    Maximum Distance ({distance} miles)
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min="1"
                    max="50"
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                  />
                </div>

                {/* Date Preferences */}
                <div className="mb-4">
                  <h5 className="mb-3">Date Preferences</h5>
                  <div className="d-flex flex-wrap gap-3">
                    {Object.entries(preferences).map(([key, value]) => (
                      <div className="form-check" key={key}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={key}
                          name={key}
                          checked={value}
                          onChange={handlePreferenceChange}
                        />
                        <label className="form-check-label" htmlFor={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Save Preferences
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 