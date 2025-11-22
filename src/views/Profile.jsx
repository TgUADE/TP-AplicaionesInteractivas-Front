import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../hook/useAuth";
import { useUserProfile } from "../hook/useUserProfile";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUserProfile } from "../redux/slices/userSlice";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ProfileIconAndMail from "../components/Profile/ProfileIconAndMail";
import ProfileForm from "../components/Profile/ProfileForm";
import Toast from "../components/UI/Toast";
import useToast from "../hook/useToast";
import DeleteAccountModal from "../components/Profile/DeleteAccountModal";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const { toast, showToast, dismissToast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  
  // Callbacks para auth (logout)
  const authCallbacks = useMemo(() => ({
    onLogoutSuccess: () => {
      showToast("Logged out successfully", "success");
    },
  }), [showToast]);
  
  // Callbacks para profile
  const profileCallbacks = useMemo(() => ({
    onUpdateSuccess: () => {
      setIsEditing(false);
      showToast("Profile updated successfully", "success");
      console.log("✅ Profile updated successfully");
    },
    onUpdateError: (error) => {
      console.error("❌ Error updating profile:", error);
      showToast("Error updating profile. Please try again.", "error");
    },
    onDeleteSuccess: () => {
      setShowDeleteModal(false);
      setIsDeletingAccount(false);
      setIsLoggingOut(true);
      showToast("Account deleted successfully", "success");
      console.log("✅ Account deleted successfully - redirecting to home");
      
      // Limpiar perfil inmediatamente
      dispatch(clearUserProfile());
    },
    onDeleteError: (error) => {
      console.error("❌ Error deleting account:", error);
      setIsDeletingAccount(false);
      setIsLoggingOut(false);
      showToast("Error deleting account. Please try again.", "error");
    },
  }), [showToast, dispatch]);
  
  const { isLoggedIn, logout, isInitialized } = useAuth(authCallbacks);
  const { profile, isLoading, error, isInitialized: profileInitialized, updateProfile, deleteAccount } = useUserProfile(profileCallbacks);

  useEffect(() => {
    if (profile) {
      setEditedData(profile);
    }
  }, [profile]);

  useEffect(() => {
    if (isInitialized && !isLoggedIn && !isLoggingOut) {
      navigate("/auth");
    }
  }, [isLoggedIn, isInitialized, navigate, isLoggingOut]);

  // Manejar logout después de eliminar cuenta
  useEffect(() => {
    if (isLoggingOut && !profile) {
      
        logout();
        navigate("/home");
      
    }
  }, [isLoggingOut, profile, logout, navigate]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    showToast("Logged out successfully", "success");
    setTimeout(() => {
      dispatch(clearUserProfile());
      logout();
      navigate("/home");
    }, 1500);
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

  const handleSave = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("💾 Saving profile changes");
    // El toast se mostrará automáticamente por callbacks de Redux
    updateProfile(editedData);
  };

  const handleDeleteAccount = () => {
    setIsDeletingAccount(true);
    // El toast se mostrará automáticamente por callbacks de Redux
    deleteAccount();
  };

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isInitialized || !profileInitialized || (isLoading && !profile)) {
    return (
      <div className="min-h-screen bg-white w-full flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading profile..." />
      </div>
    );
  }

  if (!isLoggedIn && !isLoggingOut) {
    return null;
  }

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
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-black mb-4">
            {isEditing ? "Edit Your Profile" : "Your Profile"}
          </h1>
        </div>

        <div className="max-w-6xl mx-auto">
          <ProfileIconAndMail 
            profileName={profile?.name}
            profileSurname={profile?.surname}
            profileEmail={profile?.email}
          />  

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

          <div className="text-center mt-8 pb-12">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-red-500 hover:text-red-600 text-sm font-normal underline"
            >
              Delete Account
            </button>
          </div>
        </div>
      </section>
      
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        isLoading={isDeletingAccount}
      />
      
      <Toast toast={toast} onClose={dismissToast} />
    </div>
  );
};

export default Profile;