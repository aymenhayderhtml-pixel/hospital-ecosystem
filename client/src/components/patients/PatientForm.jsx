import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const BLOOD_TYPE_OPTIONS = [
  { value: 'A+', label: 'A+' }, { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' }, { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' }, { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' }, { value: 'O-', label: 'O-' },
  { value: 'unknown', label: 'Unknown' },
];

const InputField = ({ label, name, type = 'text', required = false, placeholder, error, value, onChange, loading }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={name} name={name} type={type} value={value} onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
      disabled={loading}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const SelectField = ({ label, name, options, required = false, error, value, onChange, loading }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={name} name={name} value={value} onChange={onChange}
      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
      disabled={loading}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const PatientForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const [formData, setFormData] = useState({
    first_name: '', last_name: '', date_of_birth: '', gender: '', phone: '',
    email: '', blood_type: '', address: '', emergency_contact_name: '', emergency_contact_phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    } else if (new Date(formData.date_of_birth) > new Date()) {
      newErrors.date_of_birth = 'Date of birth cannot be in the future';
    }
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.emergency_contact_phone && formData.emergency_contact_phone.replace(/\D/g, '').length < 10) {
      newErrors.emergency_contact_phone = 'Emergency contact phone must be at least 10 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await patientService.create(formData);
      navigate(`/patients/${response.data.data.patient.id}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to register patient. Please try again.';
      setApiError(message);
      if (error.response?.data?.errors) {
        const fieldErrors = {};
        error.response.data.errors.forEach((err) => { fieldErrors[err.field] = err.message; });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button onClick={() => navigate('/patients')} className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Patients
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Register New Patient</h1>
        <p className="text-gray-600 mt-2">Fill in the patient's information below</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          {apiError && (
            <div className="flex items-center p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200" role="alert">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              {apiError}
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="First Name" name="first_name" required placeholder="John" error={errors.first_name} value={formData.first_name} onChange={handleChange} loading={loading} />
              <InputField label="Last Name" name="last_name" required placeholder="Doe" error={errors.last_name} value={formData.last_name} onChange={handleChange} loading={loading} />
              <InputField label="Date of Birth" name="date_of_birth" type="date" required error={errors.date_of_birth} value={formData.date_of_birth} onChange={handleChange} loading={loading} />
              <SelectField label="Gender" name="gender" options={GENDER_OPTIONS} required error={errors.gender} value={formData.gender} onChange={handleChange} loading={loading} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Phone Number" name="phone" type="tel" required placeholder="+1 (555) 123-4567" error={errors.phone} value={formData.phone} onChange={handleChange} loading={loading} />
              <InputField label="Email Address" name="email" type="email" placeholder="john.doe@example.com" error={errors.email} value={formData.email} onChange={handleChange} loading={loading} />
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={3} placeholder="123 Main St, City, State, ZIP"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none" disabled={loading} />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Medical Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField label="Blood Type" name="blood_type" options={BLOOD_TYPE_OPTIONS} error={errors.blood_type} value={formData.blood_type} onChange={handleChange} loading={loading} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Emergency Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Contact Name" name="emergency_contact_name" placeholder="Jane Doe" error={errors.emergency_contact_name} value={formData.emergency_contact_name} onChange={handleChange} loading={loading} />
              <InputField label="Contact Phone" name="emergency_contact_phone" type="tel" placeholder="+1 (555) 987-6543" error={errors.emergency_contact_phone} value={formData.emergency_contact_phone} onChange={handleChange} loading={loading} />
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button type="button" onClick={() => navigate('/patients')} disabled={loading}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center">
              {loading ? (
                <><svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Registering...</>
              ) : 'Register Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
