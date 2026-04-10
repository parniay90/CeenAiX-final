import { useState } from 'react';
import { Camera, Upload, Plus, Trash2, ExternalLink, ShieldCheck } from 'lucide-react';
import { MOCK_USER_PROFILE, MOCK_FAMILY_MEMBERS, FamilyMember } from '../../types/settings';

export default function AccountSection() {
  const [profile] = useState(MOCK_USER_PROFILE);
  const [familyMembers] = useState(MOCK_FAMILY_MEMBERS);
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);

  const maskEmiratesId = (id: string) => {
    const parts = id.split('-');
    if (parts.length !== 4) return id;
    return `${parts[0]}-****-****-${parts[3]}`;
  };

  const getRelationshipBadgeColor = (relationship: string) => {
    switch (relationship) {
      case 'child':
        return 'bg-blue-600';
      case 'parent':
        return 'bg-purple-600';
      case 'spouse':
        return 'bg-pink-600';
      default:
        return 'bg-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Profile Photo</h3>
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center text-3xl font-bold text-white">
              {profile.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-teal-600 hover:bg-teal-700 rounded-full flex items-center justify-center transition-colors">
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-400 mb-3">
              Upload a profile photo. Drag and drop or click to browse. Maximum file size: 5MB.
            </p>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold rounded-lg transition-colors">
              <Upload className="w-4 h-4" />
              Upload Photo
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Display Name</label>
            <input
              type="text"
              defaultValue={profile.displayName}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Phone Number</label>
            <input
              type="tel"
              defaultValue={profile.phone}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Email Address</label>
            <input
              type="email"
              defaultValue={profile.email}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Date of Birth</label>
            <input
              type="date"
              defaultValue={profile.dateOfBirth}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Emirates ID</h3>
        <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <div>
              <div className="text-sm font-bold text-white font-mono">{maskEmiratesId(profile.emiratesId)}</div>
              <div className="text-xs text-slate-400">Verified</div>
            </div>
          </div>
          <button className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm font-bold rounded-lg transition-colors">
            Change
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Changing your Emirates ID requires identity verification through UAE PASS.
        </p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Contact Name</label>
            <input
              type="text"
              defaultValue={profile.emergencyContact.name}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Relationship</label>
            <input
              type="text"
              defaultValue={profile.emergencyContact.relationship}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-bold text-slate-400 mb-2">Phone Number</label>
            <input
              type="tel"
              defaultValue={profile.emergencyContact.phone}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Linked Family Accounts</h3>
          <button
            onClick={() => setShowAddFamilyModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Family Member
          </button>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Link accounts for minor children or elderly parents under your guardianship.
        </p>

        <div className="space-y-3">
          {familyMembers.map((member: FamilyMember) => (
            <div key={member.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold">
                  {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{member.name}</span>
                    <span className={`px-2 py-0.5 ${getRelationshipBadgeColor(member.relationship)} text-white text-xs font-bold rounded`}>
                      {member.relationship}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">{maskEmiratesId(member.emiratesId)}</div>
                  <div className="text-xs text-slate-500">Age: {new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-600 rounded-lg transition-colors">
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </button>
                <button className="p-2 hover:bg-rose-600 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-slate-400 hover:text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors">
          Cancel
        </button>
        <button className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors">
          Save Changes
        </button>
      </div>

      {showAddFamilyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Add Family Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Relationship</label>
                <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500">
                  <option>Child</option>
                  <option>Parent</option>
                  <option>Spouse</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Emirates ID</label>
                <input
                  type="text"
                  placeholder="784-YYYY-XXXXXXX-X"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Date of Birth</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddFamilyModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors">
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
