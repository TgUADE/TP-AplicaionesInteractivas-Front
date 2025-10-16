import { useState, useEffect } from "react";
import { useAuth } from "../hook/useAuth";
import { useUserProfile } from "../hook/useUserProfile";
import { useNavigate } from "react-router-dom";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import UserIcon from "../icons/UserIcon";
import MailIcon from "../icons/MailIcon";

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
    logout();
    navigate("/home");
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
          <div className="text-4xl mb-4">⚠️</div>
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
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-4">
              <UserIcon className="w-12 h-12 text-gray-600" />
            </div>
            <p className="text-gray-500 text-2xl font-normal">
              {profile?.name} {profile?.surname}
            </p>
            <p className="text-gray-400 text-sm mt-2 flex items-center justify-center gap-2">
              <MailIcon className="w-4 h-4" />
              {profile?.email}
            </p>
          </div>

          {/* Profile Form */}
          <form className="space-y-6" onSubmit={(e) => { 
            e.preventDefault(); 
            if (isEditing) {
              handleSave();
            }
          }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* First Name */}
                <div className="relative">
                  <Input
                    type="text"
                    value={editedData?.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="First Name"
                    disabled={!isEditing}
                    className="w-full h-14 px-6 rounded-full border-2 border-gray-300 bg-white focus:bg-white focus:border-gray-400 focus:ring-0 text-base placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>

                {/* Last Name */}
                <div className="relative">
                  <Input
                    type="text"
                    value={editedData?.surname || ""}
                    onChange={(e) => handleInputChange("surname", e.target.value)}
                    placeholder="Last Name"
                    disabled={!isEditing}
                    className="w-full h-14 px-6 rounded-full border-2 border-gray-300 bg-white focus:bg-white focus:border-gray-400 focus:ring-0 text-base placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>

                {/* Email (Read-only) */}
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <MailIcon className="w-5 h-5" />
                  </div>
                  <Input
                    type="email"
                    value={profile?.email || ""}
                    placeholder="Email Address"
                    disabled
                    className="w-full h-14 pl-14 pr-6 rounded-full border-2 border-gray-300 bg-gray-50 text-gray-600 text-base placeholder-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Phone & Address */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      type="tel"
                      value={editedData?.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Phone"
                      disabled={!isEditing}
                      className="w-full h-14 px-6 rounded-full border-2 border-gray-300 bg-white focus:bg-white focus:border-gray-400 focus:ring-0 text-base placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>
                  <div className="relative">
                    <Input
                      type="text"
                      value={editedData?.address || ""}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Address"
                      disabled={!isEditing}
                      className="w-full h-14 px-6 rounded-full border-2 border-gray-300 bg-white focus:bg-white focus:border-gray-400 focus:ring-0 text-base placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>
                </div>

                {/* City & State */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      type="text"
                      value={editedData?.city || ""}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="City"
                      disabled={!isEditing}
                      className="w-full h-14 px-6 rounded-full border-2 border-gray-300 bg-white focus:bg-white focus:border-gray-400 focus:ring-0 text-base placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>
                  <div className="relative">
                    <Input
                      type="text"
                      value={editedData?.state || ""}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      placeholder="State"
                      disabled={!isEditing}
                      className="w-full h-14 px-6 rounded-full border-2 border-gray-300 bg-white focus:bg-white focus:border-gray-400 focus:ring-0 text-base placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>
                </div>

                {/* ZIP & Country */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      type="text"
                      value={editedData?.zip || ""}
                      onChange={(e) => handleInputChange("zip", e.target.value)}
                      placeholder="ZIP Code"
                      disabled={!isEditing}
                      className="w-full h-14 px-6 rounded-full border-2 border-gray-300 bg-white focus:bg-white focus:border-gray-400 focus:ring-0 text-base placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>
                  <div className="relative">
                    <Input
                      type="text"
                      value={editedData?.country || ""}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      placeholder="Country"
                      disabled={!isEditing}
                      className="w-full h-14 px-6 rounded-full border-2 border-gray-300 bg-white focus:bg-white focus:border-gray-400 focus:ring-0 text-base placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 lg:col-span-2">
              <div className="max-w-md mx-auto space-y-4">
                {!isEditing ? (
                  <>
                    <Button
                      type="button"
                      onClick={handleEdit}
                      className="w-full h-14 bg-black text-white rounded-full hover:bg-gray-800 text-base font-medium"
                    >
                      Edit Profile
                    </Button>
                    <Button
                      type="button"
                      onClick={handleLogout}
                      className="w-full h-14 bg-white text-black border-2 border-black rounded-full hover:bg-gray-50 text-base font-medium"
                    >
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="submit"
                      className="w-full h-14 bg-black text-white rounded-full hover:bg-gray-800 text-base font-medium"
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancel}
                      className="w-full h-14 bg-white text-black border-2 border-gray-300 rounded-full hover:bg-gray-50 text-base font-medium"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </form>

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
