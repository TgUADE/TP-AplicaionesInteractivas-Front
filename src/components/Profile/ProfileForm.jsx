import Button from "../UI/Button";
import Input from "../UI/Input";
import MailIcon from "../../icons/MailIcon";



const ProfileForm = ({ profile, editedData, isEditing, handleInputChange, handleSave, handleEdit, handleCancel, handleLogout }) => {
    return (
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
    );
}
export default ProfileForm;