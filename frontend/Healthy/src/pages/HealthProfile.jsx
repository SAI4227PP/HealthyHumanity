import React, { useState } from 'react';
import { 
  User, 
  Edit2, 
  Save, 
  Activity, 
  Scale, // Use Scale instead of Weight
  Ruler, // Use Ruler instead of Height
  Heart, // Add Heart for vitals
  Calendar 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function HealthProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Mohan',
    age: 28,
    gender: 'Male',
    bloodGroup: 'A+',
    height: '175',
    weight: '70',
    bloodPressure: '120/80',
    sugarLevel: '80',
    pulseRate: '72'
  });

  const [editableProfile, setEditableProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editableProfile);
    setIsEditing(false);
    // TODO: Add API call to save profile
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-teal-700 flex items-center">
          <User className="mr-2" />
          Health Profile
        </h1>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
        >
          {isEditing ? (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="w-5 h-5 mr-2" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <ProfileField
              label="Name"
              value={editableProfile.name}
              isEditing={isEditing}
              onChange={(value) => setEditableProfile({...editableProfile, name: value})}
            />
            <ProfileField
              label="Age"
              value={editableProfile.age}
              isEditing={isEditing}
              type="number"
              onChange={(value) => setEditableProfile({...editableProfile, age: value})}
            />
            <ProfileField
              label="Gender"
              value={editableProfile.gender}
              isEditing={isEditing}
              onChange={(value) => setEditableProfile({...editableProfile, gender: value})}
            />
            <ProfileField
              label="Blood Group"
              value={editableProfile.bloodGroup}
              isEditing={isEditing}
              onChange={(value) => setEditableProfile({...editableProfile, bloodGroup: value})}
            />
          </div>
        </motion.div>

        {/* Vital Stats */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Heart className="mr-2 text-teal-600" />
            Vital Statistics
          </h2>
          <div className="space-y-4">
            <ProfileField
              icon={<Ruler className="w-4 h-4 text-teal-600" />}
              label="Height (cm)"
              value={editableProfile.height}
              isEditing={isEditing}
              type="number"
              onChange={(value) => setEditableProfile({...editableProfile, height: value})}
            />
            <ProfileField
              icon={<Scale className="w-4 h-4 text-teal-600" />}
              label="Weight (kg)"
              value={editableProfile.weight}
              isEditing={isEditing}
              type="number"
              onChange={(value) => setEditableProfile({...editableProfile, weight: value})}
            />
            <ProfileField
              label="Blood Pressure"
              value={editableProfile.bloodPressure}
              isEditing={isEditing}
              onChange={(value) => setEditableProfile({...editableProfile, bloodPressure: value})}
            />
            <ProfileField
              label="Sugar Level"
              value={editableProfile.sugarLevel}
              isEditing={isEditing}
              onChange={(value) => setEditableProfile({...editableProfile, sugarLevel: value})}
            />
            <ProfileField
              label="Pulse Rate"
              value={editableProfile.pulseRate}
              isEditing={isEditing}
              onChange={(value) => setEditableProfile({...editableProfile, pulseRate: value})}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ProfileField({ label, value, isEditing, type = "text", onChange, icon }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 mb-1 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </label>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="p-2 border rounded-md focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
        />
      ) : (
        <p className="text-gray-800 font-medium">{value}</p>
      )}
    </div>
  );
}
