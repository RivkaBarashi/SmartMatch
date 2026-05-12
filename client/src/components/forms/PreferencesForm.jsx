import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { completeRegistration } from '../../services/preference.service';
import {
  clearRegistrationDraft,
  getRegistrationDraft,
} from '../../utils/registrationDraft';
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
    document.addEventListener('touchcancel', handleDocumentEnd);
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
      </div>

      <div className="range-scale">
        {(ticks || [minLimit, maxLimit]).map((tick) => {
          const tickLeft = ((tick - minLimit) / range) * 100;

          return (
            <span key={tick} style={{ left: `${tickLeft}%` }}>
              {tick}
              {unit && tick === maxLimit ? ` ${unit}` : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function PreferencesForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationDraft] = useState(() => getRegistrationDraft());

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ageMin: 25,
      ageMax: 45,
      preferenceStyle: '',
      preferenceEthnicity: '',
      preferenceAppearance: '',
      heightMin: 170,
      heightMax: 180,
    },
  });

  useEffect(() => {
    if (!registrationDraft.data) {
      navigate('/register');
    }
  }, [navigate, registrationDraft.data]);

  const onSubmit = async (preferences) => {
    setError('');

    try {
      setLoading(true);
      const { resumePDF, profileImage } = registrationDraft.files;
      await completeRegistration(registrationDraft.data, preferences, { resumePDF, profileImage });
      clearRegistrationDraft();
      navigate('/login');
    } catch (err) {
      console.error(err);
      
      setError(err.response?.data?.message || err.message || 'שגיאה בשמירת הנתונים');
    } finally {
      setLoading(false);
    }
  };

  if (!registrationDraft.data) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="register-form preferences-form">
      <h2>פרטי הדרישות מבן הזוג</h2>

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
          defaultMin={25}
          defaultMax={45}
          ticks={[18, 25, 45, 60]}
          setValue={setValue}
        />

        <div className="form-group">
          <label htmlFor="preferenceStyle">סגנון</label>
          <select id="preferenceStyle" {...register('preferenceStyle')}>
            <option value="">בחרי סגנון</option>
            <option value="conservative">שמור</option>
            <option value="classic">קלאס</option>
            <option value="open">פתוח</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="preferenceEthnicity">עדה</label>
          <select id="preferenceEthnicity" {...register('preferenceEthnicity')}>
            <option value="">בחרי עדה</option>
            <option value="ashkenazi">אשכנזי</option>
            <option value="sephardic">ספרדי</option>
            <option value="yemenite">תימני</option>
            <option value="other">אחר</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="preferenceAppearance">מראה חיצוני</label>
          <select id="preferenceAppearance" {...register('preferenceAppearance')}>
            <option value="">בחרי מראה</option>
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
          defaultMin={170}
          defaultMax={180}
          ticks={[140, 165, 190, 210]}
          step={1}
          unit="cm"
          setValue={setValue}
        />
      </fieldset>

      {errors.ageMin && <p className="error">{errors.ageMin.message}</p>}
      {error && <p className="error">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={loading} className="preference-submit-button">
          {loading ? 'שומרת...' : 'שמרי דרישות וסיימי'}
        </button>
      </div>
    </form>
  );
}
