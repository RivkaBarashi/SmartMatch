import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveRegistrationDraft } from '../../utils/registrationDraft';
import './RegisterForm.css';

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      name: '',
      idNumber: '',
      email: '',
      password: '',
      gender: 'male',
      age: '',
      yeshiva: '',
      financialRequirement: '',
      seminar: '',
      occupation: '',
      financialCapabilities: '',
      style: '',
      city: '',
      ethnicity: '',
      appearance: '',
      height: '',
      description: '',
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resumePDF, setResumePDF] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

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
      saveRegistrationDraft(data, { resumePDF, profileImage });
      setSuccessMessage('הנתונים נשמרו זמנית');
      navigate('/preferences');
      return;

      /*
      const hasFiles = Boolean(resumePDF || profileImage);
      let payload = data;

      if (hasFiles) {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
          if (data[key] !== '' && data[key] !== undefined && data[key] !== null) {
            formData.append(key, data[key]);
          }
        });

        if (resumePDF) {
          formData.append('resumePDF', resumePDF);
        }
        if (profileImage) {
          formData.append('profileImage', profileImage);
        }

        payload = formData;
      }

      const res = await registerUser(payload);

      setSuccessMessage('פרטיך נשמרו בהצלחה');

      alert(`${data.name} נרשמת בהצלחה`);
      console.log(res.data);
      */
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'שגיאה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="register-form">
      <h2>טופס הרשמה</h2>

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

        <div className="form-group password-group">
          <label htmlFor="password">סיסמה *</label>
          <div className="password-input-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'סיסמה נדרשת',
                minLength: {
                  value: 8,
                  message: 'סיסמה חייבת להיות לפחות 8 תוים'
                },
                pattern: {
                  value: /[a-zA-Z]/,
                  message: 'סיסמה חייבת להכיל לפחות אות אנגלית אחת'
                }
              })}
              placeholder="סיסמה"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={toggleShowPassword}
            >
              {showPassword ? 'הסתר' : 'הצג'}
            </button>
          </div>
          {errors.password && <p className="error">{errors.password.message}</p>}
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

      {error && <p className="error">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={loading} className="submit-button">
          <span>{loading ? 'שומר נתונים...' : 'שמור נתונים'}</span>
        {loading ? 'שומר פרטים...' : 'שמירת פרטים'}
        </button>
      </div>

      {successMessage && <p className="success">{successMessage}</p>}
    </form>
  );
}
