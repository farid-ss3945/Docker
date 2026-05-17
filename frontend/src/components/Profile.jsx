import { useState, useEffect } from 'react';
import userService from '../services/userService';
import './Profile.css';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    address: '',
    phoneNumber: '',
  });
  const [changePassword, setChangePassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User not authenticated. Please login first.');
      setLoading(false);
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      // Normalize the data to ensure all fields have empty strings instead of null/undefined
      setProfile({
        name: response.data.name || '',
        email: response.data.email || '',
        address: response.data.address || '',
        phoneNumber: response.data.phoneNumber || '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setChangePassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);
      await userService.updateProfile({ 
        name: profile.name,
        address: profile.address,
        phoneNumber: profile.phoneNumber,
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (changePassword.newPassword !== changePassword.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);
      await userService.changePassword({
        currentPassword: changePassword.currentPassword,
        newPassword: changePassword.newPassword,
      });
      setSuccess('Password changed successfully!');
      setChangePassword({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="profile-card">
        <h3>Profile Information</h3>
        <form onSubmit={updateProfile}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name || ''}
              onChange={handleProfileChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email || ''}
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number (Optional)</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={profile.phoneNumber || ''}
              onChange={handleProfileChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address (Optional)</label>
            <input
              type="text"
              id="address"
              name="address"
              value={profile.address || ''}
              onChange={handleProfileChange}
            />
          </div>

          <button type="submit" disabled={updating} className="btn-update">
            {updating ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      <div className="password-card">
        {!showPasswordForm ? (
          <button 
            onClick={() => setShowPasswordForm(true)}
            className="btn-show-password"
          >
            Change Password
          </button>
        ) : (
          <>
            <h3>Change Password</h3>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={changePassword.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={changePassword.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={changePassword.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="password-buttons">
                <button type="submit" disabled={updating} className="btn-change">
                  {updating ? 'Changing...' : 'Change Password'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="btn-cancel-password"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
