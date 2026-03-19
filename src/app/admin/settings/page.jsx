// app/admin/settings/page.jsx
'use client';

import { 
  Settings,
  User,
  Lock,
  Bell,
  Mail,
  Shield,
  Database,
  Calendar,
  BookOpen,
  CreditCard,
  Globe,
  Save,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    instituteName: 'ABC University',
    instituteLogo: '',
    timezone: 'UTC+05:30',
    dateFormat: 'DD/MM/YYYY',
    enableNotifications: true,
    enableEmailAlerts: true,
    passwordPolicy: {
      minLength: 8,
      requireNumbers: true,
      requireSpecialChars: true
    },
    paymentSettings: {
      currency: 'USD',
      paymentMethods: ['Credit Card', 'Bank Transfer', 'PayPal']
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save settings logic here
    console.log('Settings saved:', formData);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center px-6 py-4">
          <Settings className="w-6 h-6 mr-2 text-indigo-600" />
          System Settings
        </h1>
        
        <nav className="flex px-6 -mb-px space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'general' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <User className="w-4 h-4 mr-2" />
            General
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'security' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <Lock className="w-4 h-4 mr-2" />
            Security
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'notifications' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'payment' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Payment
          </button>
          <button
            onClick={() => setActiveTab('academic')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'academic' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Academic
          </button>
        </nav>
      </div>

      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow overflow-hidden"
        >
          {activeTab === 'general' && (
            <div className="space-y-6 p-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-indigo-600" />
                  Institute Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">Basic details about your institution</p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="instituteName" className="block text-sm font-medium text-gray-700">
                    Institute Name
                  </label>
                  <input
                    type="text"
                    name="instituteName"
                    id="instituteName"
                    value={formData.instituteName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="instituteLogo" className="block text-sm font-medium text-gray-700">
                    Institute Logo
                  </label>
                  <div className="mt-1 flex items-center">
                    <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                      {formData.instituteLogo ? (
                        <img src={formData.instituteLogo} alt="Institute Logo" className="h-full w-full" />
                      ) : (
                        <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )}
                    </span>
                    <button
                      type="button"
                      className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  >
                    <option>UTC-12:00</option>
                    <option>UTC-05:00</option>
                    <option>UTC+00:00</option>
                    <option>UTC+05:30</option>
                    <option>UTC+08:00</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
                    Date Format
                  </label>
                  <select
                    id="dateFormat"
                    name="dateFormat"
                    value={formData.dateFormat}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  >
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 p-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                  Security Settings
                </h2>
                <p className="mt-1 text-sm text-gray-500">Configure system security policies</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900">Password Policy</h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="minLength" className="block text-sm font-medium text-gray-700">
                          Minimum Length
                        </label>
                        <p className="text-sm text-gray-500">Set the minimum password length</p>
                      </div>
                      <input
                        type="number"
                        id="minLength"
                        name="minLength"
                        min="6"
                        max="20"
                        value={formData.passwordPolicy.minLength}
                        onChange={(e) => handleNestedChange('passwordPolicy', 'minLength', e.target.value)}
                        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="relative flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="requireNumbers"
                          name="requireNumbers"
                          type="checkbox"
                          checked={formData.passwordPolicy.requireNumbers}
                          onChange={(e) => handleNestedChange('passwordPolicy', 'requireNumbers', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="requireNumbers" className="font-medium text-gray-700">
                          Require Numbers
                        </label>
                        <p className="text-gray-500">Passwords must contain at least one number</p>
                      </div>
                    </div>

                    <div className="relative flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="requireSpecialChars"
                          name="requireSpecialChars"
                          type="checkbox"
                          checked={formData.passwordPolicy.requireSpecialChars}
                          onChange={(e) => handleNestedChange('passwordPolicy', 'requireSpecialChars', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="requireSpecialChars" className="font-medium text-gray-700">
                          Require Special Characters
                        </label>
                        <p className="text-gray-500">Passwords must contain at least one special character</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900">Session Management</h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Session Timeout
                        </label>
                        <p className="text-sm text-gray-500">Set the idle time before automatic logout</p>
                      </div>
                      <select
                        className="w-40 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      >
                        <option>15 minutes</option>
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>2 hours</option>
                        <option>Never</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 p-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-indigo-600" />
                  Notification Settings
                </h2>
                <p className="mt-1 text-sm text-gray-500">Configure how you receive notifications</p>
              </div>

              <div className="space-y-4">
                <div className="relative flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="enableNotifications"
                      name="enableNotifications"
                      type="checkbox"
                      checked={formData.enableNotifications}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="enableNotifications" className="font-medium text-gray-700">
                      Enable System Notifications
                    </label>
                    <p className="text-gray-500">Get alerts for important system events</p>
                  </div>
                </div>

                <div className="relative flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="enableEmailAlerts"
                      name="enableEmailAlerts"
                      type="checkbox"
                      checked={formData.enableEmailAlerts}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="enableEmailAlerts" className="font-medium text-gray-700">
                      Enable Email Alerts
                    </label>
                    <p className="text-gray-500">Receive important notifications via email</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-md font-medium text-gray-900">Notification Preferences</h3>
                  <div className="mt-4 space-y-4">
                    <div className="relative flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="newAdmission"
                          name="newAdmission"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="newAdmission" className="font-medium text-gray-700">
                          New Admissions
                        </label>
                        <p className="text-gray-500">Notify when new students are admitted</p>
                      </div>
                    </div>

                    <div className="relative flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="paymentReceived"
                          name="paymentReceived"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="paymentReceived" className="font-medium text-gray-700">
                          Payment Received
                        </label>
                        <p className="text-gray-500">Notify when payments are received</p>
                      </div>
                    </div>

                    <div className="relative flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="systemUpdates"
                          name="systemUpdates"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="systemUpdates" className="font-medium text-gray-700">
                          System Updates
                        </label>
                        <p className="text-gray-500">Notify about important system updates</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6 p-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
                  Payment Settings
                </h2>
                <p className="mt-1 text-sm text-gray-500">Configure payment gateway and options</p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                    Default Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.paymentSettings.currency}
                    onChange={(e) => handleNestedChange('paymentSettings', 'currency', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  >
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                    <option>INR</option>
                    <option>AUD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Enabled Payment Methods
                  </label>
                  <fieldset className="mt-2">
                    <legend className="sr-only">Payment methods</legend>
                    <div className="space-y-2">
                      {['Credit Card', 'Bank Transfer', 'PayPal', 'Stripe', 'Cash'].map((method) => (
                        <div key={method} className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id={method}
                              name="paymentMethods"
                              type="checkbox"
                              checked={formData.paymentSettings.paymentMethods.includes(method)}
                              onChange={(e) => {
                                const newMethods = e.target.checked
                                  ? [...formData.paymentSettings.paymentMethods, method]
                                  : formData.paymentSettings.paymentMethods.filter(m => m !== method);
                                handleNestedChange('paymentSettings', 'paymentMethods', newMethods);
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor={method} className="font-medium text-gray-700">
                              {method}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-md font-medium text-gray-900">Payment Gateway Configuration</h3>
                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="gatewayName" className="block text-sm font-medium text-gray-700">
                      Gateway Name
                    </label>
                    <input
                      type="text"
                      name="gatewayName"
                      id="gatewayName"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                      API Key
                    </label>
                    <input
                      type="password"
                      name="apiKey"
                      id="apiKey"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="merchantId" className="block text-sm font-medium text-gray-700">
                      Merchant ID
                    </label>
                    <input
                      type="text"
                      name="merchantId"
                      id="merchantId"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="testMode" className="block text-sm font-medium text-gray-700">
                      Test Mode
                    </label>
                    <select
                      id="testMode"
                      name="testMode"
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                      <option>Enabled</option>
                      <option>Disabled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="space-y-6 p-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
                  Academic Settings
                </h2>
                <p className="mt-1 text-sm text-gray-500">Configure academic year, terms, and grading</p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700">
                    Current Academic Year
                  </label>
                  <input
                    type="text"
                    name="academicYear"
                    id="academicYear"
                    placeholder="2023-2024"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="gradingSystem" className="block text-sm font-medium text-gray-700">
                    Grading System
                  </label>
                  <select
                    id="gradingSystem"
                    name="gradingSystem"
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  >
                    <option>Letter Grades (A-F)</option>
                    <option>Percentage (0-100)</option>
                    <option>GPA (0-4)</option>
                    <option>Pass/Fail</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-md font-medium text-gray-900">Academic Terms</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Term Structure
                      </label>
                      <p className="text-sm text-gray-500">Define your academic terms</p>
                    </div>
                    <select
                      className="w-40 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                      <option>Semester System</option>
                      <option>Trimester System</option>
                      <option>Quarter System</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="term1"
                        name="terms"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="term1" className="ml-3 block text-sm font-medium text-gray-700">
                        Fall Semester (Aug-Dec)
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="term2"
                        name="terms"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="term2" className="ml-3 block text-sm font-medium text-gray-700">
                        Spring Semester (Jan-May)
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="term3"
                        name="terms"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="term3" className="ml-3 block text-sm font-medium text-gray-700">
                        Summer Term (Jun-Jul)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 px-6 py-3 flex justify-end border-t border-gray-200">
            <button
              type="submit"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}