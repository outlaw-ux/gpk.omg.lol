import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { requestFormContent } from '../data/siteContent';
import { hasSupabaseConfig, supabase } from '../lib/supabase';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

type FormValues = {
  collectorName: string;
  email: string;
  whatnotHandle: string;
  requestType: string;
  setName: string;
  cardNumber: string;
  cardName: string;
  variation: string;
  conditionPreference: string;
  budgetNotes: string;
  requestDetails: string;
  company: string;
};

const initialValues: FormValues = {
  collectorName: '',
  email: '',
  whatnotHandle: '',
  requestType: requestFormContent.requestTypeOptions[0].value,
  setName: '',
  cardNumber: '',
  cardName: '',
  variation: '',
  conditionPreference: '',
  budgetNotes: '',
  requestDetails: '',
  company: ''
};

const trimOrNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export function RequestForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [statusMessage, setStatusMessage] = useState(
    hasSupabaseConfig ? '' : requestFormContent.configMessage
  );

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));

    if (submitState !== 'idle') {
      setSubmitState('idle');
      setStatusMessage(hasSupabaseConfig ? '' : requestFormContent.configMessage);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (values.company.trim()) {
      setValues(initialValues);
      setSubmitState('success');
      setStatusMessage(requestFormContent.successMessage);
      return;
    }

    if (!supabase) {
      setSubmitState('error');
      setStatusMessage(requestFormContent.configMessage);
      return;
    }

    setSubmitState('submitting');
    setStatusMessage(requestFormContent.submittingMessage);

    const { error } = await supabase.from('card_requests').insert({
      collector_name: values.collectorName.trim(),
      email: values.email.trim().toLowerCase(),
      whatnot_handle: trimOrNull(values.whatnotHandle),
      request_type: values.requestType,
      set_name: trimOrNull(values.setName),
      card_number: trimOrNull(values.cardNumber),
      card_name: trimOrNull(values.cardName),
      variation: trimOrNull(values.variation),
      condition_preference: trimOrNull(values.conditionPreference),
      budget_notes: trimOrNull(values.budgetNotes),
      request_details: values.requestDetails.trim(),
      source_page: window.location.href
    });

    if (error) {
      setSubmitState('error');
      setStatusMessage(requestFormContent.errorMessage);
      return;
    }

    setValues(initialValues);
    setSubmitState('success');
    setStatusMessage(requestFormContent.successMessage);
  };

  return (
    <form className="request-form" onSubmit={handleSubmit}>
      <div className="field-grid">
        <label className="field">
          <span>{requestFormContent.labels.collectorName}</span>
          <input
            name="collectorName"
            type="text"
            autoComplete="name"
            placeholder="Your collector name"
            required
            value={values.collectorName}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>{requestFormContent.labels.email}</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            required
            value={values.email}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>{requestFormContent.labels.whatnotHandle}</span>
          <input
            name="whatnotHandle"
            type="text"
            autoComplete="off"
            placeholder="@yourwhatnothandle"
            value={values.whatnotHandle}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>{requestFormContent.labels.requestType}</span>
          <select name="requestType" value={values.requestType} onChange={handleChange}>
            {requestFormContent.requestTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>{requestFormContent.labels.setName}</span>
          <input
            name="setName"
            type="text"
            autoComplete="off"
            placeholder="Example: Chrome 7, OS1, InterGoolactic, etc."
            value={values.setName}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>{requestFormContent.labels.cardNumber}</span>
          <input
            name="cardNumber"
            type="text"
            autoComplete="off"
            placeholder="Example: 1a, C-12, SP-3"
            value={values.cardNumber}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>{requestFormContent.labels.cardName}</span>
          <input
            name="cardName"
            type="text"
            autoComplete="off"
            placeholder="Example: Nasty Nick, Adam Bomb, wrapper, sketch"
            value={values.cardName}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>{requestFormContent.labels.variation}</span>
          <input
            name="variation"
            type="text"
            autoComplete="off"
            placeholder="Parallel color, artist, sketch theme, promo type, wrapper notes, etc."
            value={values.variation}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>{requestFormContent.labels.conditionPreference}</span>
          <select
            name="conditionPreference"
            value={values.conditionPreference}
            onChange={handleChange}
          >
            <option value="">No preference yet</option>
            {requestFormContent.conditionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>{requestFormContent.labels.budgetNotes}</span>
          <input
            name="budgetNotes"
            type="text"
            autoComplete="off"
            placeholder="Budget ceiling, trade range, or leave blank"
            value={values.budgetNotes}
            onChange={handleChange}
          />
        </label>

        <label className="field field--full">
          <span>{requestFormContent.labels.requestDetails}</span>
          <textarea
            name="requestDetails"
            rows={7}
            placeholder="Tell us what you want, how exact the match has to be, whether this is for display / grading / trade, and any gross little details that matter."
            required
            minLength={12}
            value={values.requestDetails}
            onChange={handleChange}
          />
        </label>

        <label className="field field--honeypot" aria-hidden="true" tabIndex={-1}>
          <span>Company</span>
          <input
            name="company"
            type="text"
            autoComplete="off"
            tabIndex={-1}
            value={values.company}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="form-footer">
        {statusMessage ? (
          <div className="status-block">
            <p className={`status-copy status-copy--${submitState}`} aria-live="polite">
              {statusMessage}
            </p>
          </div>
        ) : (
          <div />
        )}

        <button
          className="submit-button"
          type="submit"
          disabled={submitState === 'submitting' || !hasSupabaseConfig}
        >
          {submitState === 'submitting'
            ? requestFormContent.submitLabels.submitting
            : requestFormContent.submitLabels.idle}
        </button>
      </div>
    </form>
  );
}
