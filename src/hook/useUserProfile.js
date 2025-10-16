import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";

const API_BASE_URL = "/api";

export const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const { token, isLoggedIn } = useAuth();

  // Decode JWT to get user ID (for updates and deletes)
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const id = payload.sub || payload.userId || payload.id;
        console.log("👤 User ID from token:", id);
        setUserId(id);
      } catch (err) {
        console.error("❌ Error decoding token:", err);
      }
    } else {
      setUserId(null);
    }
  }, [token]);

  // Fetch user profile using /me endpoint
  const fetchProfile = useCallback(async () => {
    if (!isLoggedIn || !token) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = `${API_BASE_URL}/users/me`;
      console.log("🔄 Fetching user profile from /me endpoint...");
      console.log("📍 Full URL:", url);
      console.log("🔑 Token present:", !!token);
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 Response status:", response.status);
      console.log("📡 Response URL:", response.url);

      if (!response.ok) {
        if (response.status === 404) {
          const errorText = await response.text();
          console.error("❌ 404 Error details:", errorText);
          throw new Error("Profile not found - proxy might not be working");
        }
        const errorText = await response.text();
        console.error("❌ Error details:", errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Profile loaded:", data);
      setProfile(data);
      
      // Extract user ID from profile for updates/deletes
      if (data.id) {
        setUserId(data.id);
      }
    } catch (err) {
      console.error("❌ Error fetching profile:", err);
      setError(err.message);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, token]);

  // Update user profile
  const updateProfile = useCallback(async (updatedData) => {
    if (!isLoggedIn || !token || !profile?.id) {
      setError("User not authenticated or profile not loaded");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔄 Updating user profile:", profile.id);
      
      // Remove fields that shouldn't be sent to backend
      const { id, email, createdAt, ...dataToSend } = updatedData;
      
      console.log("📤 Data to send:", dataToSend);
      
      const response = await fetch(`${API_BASE_URL}/users/${profile.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Profile updated:", data);
      setProfile(data);
      return true;
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, token, profile]);

  // Delete user account
  const deleteAccount = useCallback(async () => {
    if (!isLoggedIn || !token || !profile?.id) {
      setError("User not authenticated or profile not loaded");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔄 Deleting user account:", profile.id);
      const response = await fetch(`${API_BASE_URL}/users/${profile.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      console.log("✅ Account deleted");
      setProfile(null);
      return true;
    } catch (err) {
      console.error("❌ Error deleting account:", err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, token, profile]);

  // Load profile on mount and when auth changes
  useEffect(() => {
    if (isLoggedIn && token) {
      fetchProfile();
    } else {
      setProfile(null);
      setIsLoading(false);
    }
  }, [isLoggedIn, token, fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    deleteAccount,
  };
};
