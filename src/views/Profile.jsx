import { useState, useEffect } from "react";
import { useAuth } from "../hook/useAuth";
import { useUserProfile } from "../hook/useUserProfile";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ProfileIconAndMail from "../components/Profile/ProfileIconAndMail";
import ProfileForm from "../components/Profile/ProfileForm";

const Profile = () => {
  const { isLoggedIn, logout, isInitialized } = useAuth();
  const { profile, isLoading, error, isInitialized: profileInitialized, updateProfile, deleteAccount } = useUserProfile();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  // Update editedData when profile loads
  useEffect(() => {
    if (profile) {
      setEditedData(profile);
    }
  }, [profile]);

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      navigate("/auth");
    }
  }, [isLoggedIn, isInitialized, navigate]);

  const handleLogout = () => {
    // Navegar inmediatamente antes de hacer logout para evitar ver el perfil vacío
    navigate("/home");
    // Logout se ejecuta después de navegar
    setTimeout(() => {
      logout();
    }, 50);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🔧 Activating edit mode");
    setIsEditing(true);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("❌ Canceling edit mode");
    setIsEditing(false);
    setEditedData(profile);
  };

  const handleSave = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("💾 Saving profile changes");
    const success = await updateProfile(editedData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      const success = await deleteAccount();
      if (success) {
        logout();
        navigate("/home");
      } else {
        alert("Error deleting account. Please try again.");
      }
    }
  };

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  // Show loading while auth is initializing OR profile is loading/initializing
  if (!isInitialized || !profileInitialized || (isLoading && !profile)) {
    return (
      <div className="min-h-screen bg-white w-full flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading profile..." />
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  // Handle profile error
  if (error) {
    return (
      <div className="min-h-screen bg-white w-full flex items-center justify-center">
        <div className="text-center">
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error loading profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white w-full">
      <section className="py-15 bg-white w-full px-10 lg:py-10 lg:px-5 md:py-8 md:px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-black mb-4">
            {isEditing ? "Edit Your Profile" : "Your Profile"}
          </h1>
        </div>

        {/* Profile Container */}
        <div className="max-w-6xl mx-auto">
          <ProfileIconAndMail 
            profileName={profile?.name}
            profileSurname={profile?.surname}
            profileEmail={profile?.email}
          />  

          {/* Profile Form */}
          <ProfileForm
            profile={profile}
            editedData={editedData}
            isEditing={isEditing}
            handleInputChange={handleInputChange}
            handleSave={handleSave}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
            handleLogout={handleLogout}
          />

          {/* Delete Account */}
          <div className="text-center mt-8 pb-12">
            <button
              onClick={handleDeleteAccount}
              className="text-red-500 hover:text-red-600 text-sm font-normal underline"
            >
              Delete Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
