const REGISTRATION_DRAFT_KEY = 'smartmatch_registration_draft';

let fileDraft = {
  resumePDF: null,
  profileImage: null,
};

export const saveRegistrationDraft = (data, files = {}) => {
  sessionStorage.setItem(REGISTRATION_DRAFT_KEY, JSON.stringify(data));
  fileDraft = {
    resumePDF: files.resumePDF || null,
    profileImage: files.profileImage || null,
  };
};

export const getRegistrationDraft = () => {
  const rawDraft = sessionStorage.getItem(REGISTRATION_DRAFT_KEY);

  return {
    data: rawDraft ? JSON.parse(rawDraft) : null,
    files: fileDraft,
  };
};

export const clearRegistrationDraft = () => {
  sessionStorage.removeItem(REGISTRATION_DRAFT_KEY);
  fileDraft = {
    resumePDF: null,
    profileImage: null,
  };
};
