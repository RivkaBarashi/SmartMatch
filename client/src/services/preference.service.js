import api from '../api/axios';
import { register as registerUser } from './auth.service';
import { createProfile, updateProfile } from './profile.service';

const addIfFilled = (target, key, value) => {
  if (value !== undefined && value !== null && value !== '') {
    target[key] = value;
  }
};

export const completeRegistration = async (registrationData, preferencesData, files = {}) => {
  const normalizedIdNumber = registrationData.idNumber;

  if (!registrationData.name || !normalizedIdNumber || !registrationData.password || !registrationData.gender) {
    throw new Error('חסרים פרטי הרשמה בסיסיים. חזרי לעמוד ההרשמה ומלאי את הפרטים מחדש.');
  }

  // Step 1: Register user
  const userPayload = {
    name: registrationData.name,
    idNumber: normalizedIdNumber,
    email: registrationData.email,
    password: registrationData.password,
  };

  const registerRes = await registerUser(userPayload);
  const { token, user } = registerRes.data;

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));

  // Step 2: Create profile
  const profileFields = [
    'gender', 'age', 'city', 'height', 'style', 'appearance', 'ethnicity',
    'description', 'yeshiva', 'financialRequirement', 'seminar', 'occupation',
    'financialCapabilities',
  ];

  let profilePayload;
  if (files.resumePDF || files.profileImage) {
    profilePayload = new FormData();
    profileFields.forEach((key) => {
      if (registrationData[key] !== undefined && registrationData[key] !== '')
        profilePayload.append(key, registrationData[key]);
    });
    if (files.resumePDF) profilePayload.append('resumePdf', files.resumePDF);
    if (files.profileImage) profilePayload.append('image', files.profileImage);
  } else {
    profilePayload = {};
    profileFields.forEach((key) => {
      addIfFilled(profilePayload, key, registrationData[key]);
    });
  }

  try {
    await createProfile(profilePayload);
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message === 'Profile already exists') {
      await updateProfile(profilePayload);
    } else {
      throw error;
    }
  }

  // Step 3: Create preferences
  const preferencePayload = {};
  addIfFilled(preferencePayload, 'ageMin', preferencesData.ageMin);
  addIfFilled(preferencePayload, 'ageMax', preferencesData.ageMax);
  addIfFilled(preferencePayload, 'heightMin', preferencesData.heightMin);
  addIfFilled(preferencePayload, 'heightMax', preferencesData.heightMax);
  addIfFilled(preferencePayload, 'style', preferencesData.preferenceStyle);
  addIfFilled(preferencePayload, 'ethnicity', preferencesData.preferenceEthnicity);
  addIfFilled(preferencePayload, 'appearance', preferencesData.preferenceAppearance);

  try {
    await api.post('/preference', preferencePayload);
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message === 'Preference already exists') {
      await api.put('/preference', preferencePayload);
    } else {
      throw error;
    }
  }
};

export const createPreference = (data) => {
  return api.post('/preference', data);
};

export const getPreferences = () => {
  return api.get('/preference/me');
};

export const updatePreferences = (data) => {
  return api.put('/preference', data);
};
