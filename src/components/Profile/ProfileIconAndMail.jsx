import UserIcon from "../../icons/UserIcon";
import MailIcon from "../../icons/MailIcon";
const ProfileIconAndMail = ({ profileName, profileSurname, profileEmail }) => {
    return (
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-4">
              <UserIcon className="w-12 h-12 text-gray-600" />
            </div>
            <p className="text-gray-500 text-2xl font-normal">
              {profileName} {profileSurname}
            </p>
            <p className="text-gray-400 text-sm mt-2 flex items-center justify-center gap-2">
              <MailIcon className="w-4 h-4" />
              {profileEmail}
            </p>
          </div>
        </div>
    );
}
export default ProfileIconAndMail;
