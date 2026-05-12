import { useForm } from 'react-hook-form';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../../services/profile.service';
import { updatePreferences } from '../../services/preference.service';
import './RegisterForm.css';

function DualRangeInput({
  label,
  minName,
  maxName,
  minLimit,
  maxLimit,
  defaultMin,
  defaultMax,
  ticks,
  step = 1,
  unit = '',
  setValue,
}) {
  const trackRef = useRef(null);
  const activeThumbRef = useRef(null);
  const [minValue, setMinValue] = useState(defaultMin);
  const [maxValue, setMaxValue] = useState(defaultMax);
  const range = maxLimit - minLimit;
  const left = ((minValue - minLimit) / range) * 100;
  const right = 100 - ((maxValue - minLimit) / range) * 100;

  useEffect(() => {
    setValue(minName, minValue, { shouldDirty: false });
    setValue(maxName, maxValue, { shouldDirty: false });
  }, [maxName, maxValue, minName, minValue, setValue]);

  const updateMin = (value) => {
    const nextValue = Math.min(Number(value), maxValue - step);
    setMinValue(nextValue);
    setValue(minName, nextValue, { shouldDirty: true, shouldValidate: true });
  };

  const updateMax = (value) => {
    const nextValue = Math.max(Number(value), minValue + step);
    setMaxValue(nextValue);
    setValue(maxName, nextValue, { shouldDirty: true, shouldValidate: true });
  };

  const valueFromPointer = (clientX) => {
    const track = trackRef.current;

    if (!track) {
      return minLimit;
    }

    const rect = track.getBoundingClientRect();
    const percent = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const rawValue = minLimit + percent * range;
    return Math.round(rawValue / step) * step;
  };

  const updateActiveThumb = (thumb, clientX) => {
    const value = valueFromPointer(clientX);

    if (thumb === 'min') {
      updateMin(value);
      return;
    }

    updateMax(value);
  };

  const getClientX = (event) => {
    return event.touches?.[0]?.clientX ?? event.clientX;
  };

  const handleDocumentMove = (event) => {
    if (!activeThumbRef.current) {
      return;
    }

    event.preventDefault();
    updateActiveThumb(activeThumbRef.current, getClientX(event));
  };

  const handleDocumentEnd = () => {
    activeThumbRef.current = null;
    document.removeEventListener('mousemove', handleDocumentMove);
    document.removeEventListener('mouseup', handleDocumentEnd);
    document.removeEventListener('touchmove', handleDocumentMove);
    document.removeEventListener('touchend', handleDocumentEnd);
    document.removeEventListener('touchcancel', handleDocumentEnd);
  };

  const handleDragStart = (event, thumb = null) => {
    event.preventDefault();
    event.stopPropagation();
    const clientX = getClientX(event);
    const value = valueFromPointer(clientX);
    const nextThumb = thumb || (
      Math.abs(value - minValue) <= Math.abs(value - maxValue) ? 'min' : 'max'
    );

    activeThumbRef.current = nextThumb;
    updateActiveThumb(nextThumb, clientX);

    document.addEventListener('mousemove', handleDocumentMove);
    document.addEventListener('mouseup', handleDocumentEnd);
    document.addEventListener('touchmove', handleDocumentMove, { passive: false });
    document.addEventListener('touchend', handleDocumentEnd);
    document.removeEventListener('touchcancel', handleDocumentEnd);
  };

  return (
    <div className="form-group range-field">
      <div className="range-title">
        <span>{label}</span>
        <strong>
          {minValue} - {maxValue}
          {unit && ` ${unit}`}
        </strong>
      </div>

      <div
        ref={trackRef}
        className="dual-range"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div className="range-track" />
        <div
          className="range-selected"
          style={{ left: `${left}%`, right: `${right}%` }}
        />
        <button
          type="button"
          className="range-thumb range-thumb-min"
          style={{ left: `${left}%` }}
          onMouseDown={(event) => handleDragStart(event, 'min')}
          onTouchStart={(event) => handleDragStart(event, 'min')}
          aria-label={`${label} מינימום`}
        />
        <button
          type="button"
          className="range-thumb range-thumb-max"
          style={{ left: `${100 - right}%` }}
          onMouseDown={(event) => handleDragStart(event, 'max')}
          onTouchStart={(event) => handleDragStart(event, 'max')}
          aria-label={`${label} מקסימום`}
        />
        {ticks && (
          <div className="range-ticks">
            {ticks.map((tick) => (
              <div
                key={tick}
                className="range-tick"
                style={{ left: `${((tick - minLimit) / range) * 100}%` }}
              >
                <span>{tick}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfileForm({ user, preferences, onUpdate }) {
  const { register, handleSubmit, watch, setValue, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      // User fields
      name: user?.name || '',
      idNumber: user?.idNumber || '',
      email: user?.email || '',
      gender: user?.gender || 'male',
      age: user?.age || '',
      yeshiva: user?.yeshiva || '',
      financialRequirement: user?.financialRequirement || '',
      seminar: user?.seminar || '',
      occupation: user?.occupation || '',
      financialCapabilities: user?.financialCapabilities || '',
      style: user?.style || '',
      city: user?.city || '',
      ethnicity: user?.ethnicity || '',
      appearance: user?.appearance || '',
      height: user?.height || '',
      description: user?.description || '',
      // Preferences fields
      ageMin: preferences?.ageMin || 25,
      ageMax: preferences?.ageMax || 45,
      heightMin: preferences?.heightMin || 170,
      heightMax: preferences?.heightMax || 180,
      preferenceStyle: preferences?.style || '',
      preferenceEthnicity: preferences?.ethnicity || '',
      preferenceAppearance: preferences?.appearance || '',
    }
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resumePDF, setResumePDF] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const selectedGender = watch('gender');

  // נקה הודעת הצלחה כששדות משתנים
  useEffect(() => {
    if (successMessage && isDirty) {
      setSuccessMessage('');
    }
  }, [isDirty, successMessage]);

  const onSubmit = async (data) => {
    setError('');
    setSuccessMessage('');

    try {
      setLoading(true);

      // --- PUT /api/profile/ ---
      const profileFields = [
        'name', 'gender', 'age', 'yeshiva', 'financialRequirement',
        'seminar', 'occupation', 'financialCapabilities',
        'style', 'city', 'ethnicity', 'appearance', 'height', 'description',
      ];

      let profilePayload;
      if (resumePDF || profileImage) {
        profilePayload = new FormData();
        profileFields.forEach(key => {
          if (data[key] !== '' && data[key] !== undefined && data[key] !== null)
            profilePayload.append(key, data[key]);
        });
        if (resumePDF) profilePayload.append('resumePdf', resumePDF);
        if (profileImage) profilePayload.append('image', profileImage);
      } else {
        profilePayload = {};
        profileFields.forEach(key => {
          if (data[key] !== '' && data[key] !== undefined) profilePayload[key] = data[key];
        });
      }

      const profileRes = await updateProfile(profilePayload);

      // --- PUT /api/preference/ ---
      const preferencePayload = {
        ageMin: data.ageMin,
        ageMax: data.ageMax,
        heightMin: data.heightMin,
        heightMax: data.heightMax,
        style: data.preferenceStyle,
        ethnicity: data.preferenceEthnicity,
        appearance: data.preferenceAppearance,
      };

      const prefRes = await updatePreferences(preferencePayload);

      setSuccessMessage('הפרופיל עודכן בהצלחה');
      if (onUpdate) onUpdate(profileRes.data.profile, prefRes.data.preferences);

      setTimeout(() => navigate('/personal-area'), 2000);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || err.message || 'שגיאה בעדכון הפרופיל');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="register-form">
      <h2>עריכת פרופיל</h2>

      {/* Basic Fields */}
      <fieldset>
        <legend>פרטים בסיסיים</legend>

        <div className="form-group">
          <label htmlFor="name">שם מלא *</label>
          <input
            id="name"
            {...register('name', { required: 'שם נדרש' })}
            placeholder="שם מלא"
          />
          {errors.name && <p className="error">{errors.name.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="idNumber">תעודת זהות *</label>
          <input
            id="idNumber"
            {...register('idNumber', {
              required: 'תעודת זהות נדרשת',
              pattern: {
                value: /^\d{9}$/,
                message: 'תעודת זהות חייבת להיות 9 ספרות'
              }
            })}
            placeholder="תעודת זהות"
          />
          {errors.idNumber && <p className="error">{errors.idNumber.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">דוא״ל *</label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'דוא״ל נדרש',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'דוא״ל לא תקין'
              }
            })}
            placeholder="דוא״ל"
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        <div className="form-group gender-buttons">
          <label>בן/בת *</label>
          <div className="button-group">
            <label className={`gender-label ${selectedGender === 'male' ? 'active' : ''}`}>
              <input
                type="radio"
                {...register('gender', { required: 'יש לבחור בן או בת' })}
                value="male"
              />
              זכר
            </label>
            <label className={`gender-label ${selectedGender === 'female' ? 'active' : ''}`}>
              <input
                type="radio"
                {...register('gender', { required: 'יש לבחור בן או בת' })}
                value="female"
              />
              נקבה
            </label>
          </div>
          {errors.gender && <p className="error">{errors.gender.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="age">גיל</label>
          <input
            id="age"
            type="number"
            {...register('age')}
            placeholder="גיל"
          />
        </div>
      </fieldset>

      {/* Gender-specific fields */}
      {selectedGender === 'male' && (
        <fieldset>
          <legend>פרטים עבור זכר</legend>

          <div className="form-group">
            <label htmlFor="yeshiva">ישיבה</label>
            <input
              id="yeshiva"
              {...register('yeshiva')}
              placeholder="שם הישיבה"
            />
          </div>

          <div className="form-group">
            <label htmlFor="financialRequirement">דרישה כספית</label>
            <input
              id="financialRequirement"
              {...register('financialRequirement')}
              placeholder="דרישה כספית"
            />
          </div>
        </fieldset>
      )}

      {selectedGender === 'female' && (
        <fieldset>
          <legend>פרטים עבור נקבה</legend>

          <div className="form-group">
            <label htmlFor="seminar">סמינר</label>
            <input
              id="seminar"
              {...register('seminar')}
              placeholder="שם הסמינר"
            />
          </div>

          <div className="form-group">
            <label htmlFor="occupation">עיסוק</label>
            <input
              id="occupation"
              {...register('occupation')}
              placeholder="עיסוק"
            />
          </div>

          <div className="form-group">
            <label htmlFor="financialCapabilities">יכולות כספיות</label>
            <input
              id="financialCapabilities"
              {...register('financialCapabilities')}
              placeholder="יכולות כספיות"
            />
          </div>
        </fieldset>
      )}

      {/* Common fields */}
      <fieldset>
        <legend>פרטים כלליים</legend>

        <div className="form-group">
          <label htmlFor="style">סגנון</label>
          <select id="style" {...register('style')}>
            <option value="">בחר סגנון</option>
            <option value="conservative">שמור</option>
            <option value="modern">קלאס</option>
            <option value="open">פתוח</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="city">עיר</label>
          <input
            id="city"
            {...register('city')}
            placeholder="עיר"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ethnicity">עדה</label>
          <select id="ethnicity" {...register('ethnicity')}>
            <option value="">בחר עדה</option>
            <option value="ashkenazi">אשכנזי</option>
            <option value="sephardic">ספרדי</option>
            <option value="yemenite">תימני</option>
            <option value="other">אחר</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="appearance">מראה חיצוני</label>
          <select id="appearance" {...register('appearance')}>
            <option value="">בחר מראה</option>
            <option value="slim">רזה</option>
            <option value="average">קלאסי</option>
            <option value="full">מלא</option>
            <option value="chubby">שמן</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="height">גובה (ס״מ)</label>
          <input
            id="height"
            type="number"
            {...register('height')}
            placeholder="גובה בסנטימטרים"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">תיאור כללי ותכונות אופי</label>
          <textarea
            id="description"
            {...register('description')}
            placeholder="תיאור עצמי ותכונות אופי"
            rows={5}
          />
        </div>

        <div className="form-group">
          <label htmlFor="resumePDF">קורות חיים (PDF)</label>
          <input
            id="resumePDF"
            name="resumePDF"
            type="file"
            accept=".pdf"
            onChange={(e) => setResumePDF(e.target.files?.[0])}
          />
        </div>

        <div className="form-group">
          <label htmlFor="profileImage">תמונה</label>
          <input
            id="profileImage"
            name="profileImage"
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files?.[0])}
          />
        </div>
      </fieldset>

      {/* Preferences */}
      <fieldset>
        <legend>דרישות התאמה</legend>

        <input type="hidden" {...register('ageMin')} />
        <input type="hidden" {...register('ageMax')} />
        <input type="hidden" {...register('heightMin')} />
        <input type="hidden" {...register('heightMax')} />

        <DualRangeInput
          label="גיל מועדף"
          minName="ageMin"
          maxName="ageMax"
          minLimit={18}
          maxLimit={60}
          defaultMin={preferences?.ageMin || 25}
          defaultMax={preferences?.ageMax || 45}
          ticks={[18, 25, 45, 60]}
          setValue={setValue}
        />

        <div className="form-group">
          <label htmlFor="preferenceStyle">סגנון</label>
          <select id="preferenceStyle" {...register('preferenceStyle')}>
            <option value="">בחר סגנון</option>
            <option value="conservative">שמור</option>
            <option value="modern">קלאס</option>
            <option value="open">פתוח</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="preferenceEthnicity">עדה</label>
          <select id="preferenceEthnicity" {...register('preferenceEthnicity')}>
            <option value="">בחר עדה</option>
            <option value="ashkenazi">אשכנזי</option>
            <option value="sephardic">ספרדי</option>
            <option value="yemenite">תימני</option>
            <option value="other">אחר</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="preferenceAppearance">מראה חיצוני</label>
          <select id="preferenceAppearance" {...register('preferenceAppearance')}>
            <option value="">בחר מראה</option>
            <option value="slim">רזה</option>
            <option value="average">קלאסי</option>
            <option value="full">מלא</option>
            <option value="chubby">שמן</option>
          </select>
        </div>

        <DualRangeInput
          label="גובה מועדף"
          minName="heightMin"
          maxName="heightMax"
          minLimit={140}
          maxLimit={210}
          defaultMin={preferences?.heightMin || 170}
          defaultMax={preferences?.heightMax || 180}
          ticks={[140, 165, 190, 210]}
          step={1}
          unit="cm"
          setValue={setValue}
        />
      </fieldset>

      {error && <p className="error">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'מעדכן פרופיל...' : 'עדכן פרופיל'}
        </button>
      </div>

      {successMessage && <p className="success">{successMessage}</p>}
    </form>
  );
}