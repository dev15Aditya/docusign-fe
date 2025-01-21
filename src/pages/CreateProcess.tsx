import { useForm, useFieldArray } from 'react-hook-form';
import './create-process.css';
import processData from '../service/process-data';
import axios from 'axios';
import { baseUrl } from '../service/url';
import { useState } from 'react';
import FullScreenSpinner from './FullScreenSpinner';

const CreateProcess = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { fields, append } = useFieldArray({ control, name: 'optionalEmails' });
  const [loading, setLoading] = useState(false);


  const onSubmit = async (data: Record<string, any>) => {
    try {
      setLoading(true);
      const body = await processData(data);
      console.log('body: ', body);
      const res = await axios.post(baseUrl + '/document/create', body, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 200) {
        window.alert('Process created successfully, check email');
      } else {
        window.alert('Error creating process');
      }
    } catch (err) {
      console.error(err);
      window.alert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      { loading && <FullScreenSpinner loading />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Requester Name</label>
          <input {...register('requesterName', { required: true })} />
          {errors.requesterName && <span>This field is required</span>}
        </div>
        <div>
          <label>Requester Email</label>
          <input
            type="email"
            {...register('requesterEmail', { required: true })}
          />
          {errors.requesterEmail && <span>This field is required</span>}
        </div>
        <div>
          <label>Target Name</label>
          <input {...register('targetName', { required: true })} />
          {errors.targetName && <span>This field is required</span>}
        </div>
        <div>
          <label>Target Email</label>
          <input
            type="email"
            {...register('targetEmail', { required: true })}
          />
          {errors.targetEmail && <span>This field is required</span>}
        </div>
        <div>
          <label>Add Contract</label>
          <input type="file" {...register('file1', { required: true })} />
          {errors.file1 && <span>This field is required</span>}
        </div>
        <div>
          <label>Title</label>
          <textarea {...register('concept', { required: true })} />
          {errors.concept && <span>This field is required</span>}
        </div>
        <div>
          <label>Description</label>
          <textarea {...register('description', { required: true })} />
          {errors.description && <span>This field is required</span>}
        </div>
        <div className="optional-emails">
          <label>Optional Participants</label>
          {fields.map((field, index) => (
            <div key={field.id}>
              <input
                type="email"
                {...register(`optionalEmails.${index}.email`)}
                placeholder={`Optional Email ${index + 1}`}
              />
              <input
                type="text"
                {...register(`optionalEmails.${index}.name`)}
                placeholder={`Optional Name ${index + 1}`}
                />
            </div>
          ))}
          <button
            className="add-email-btn"
            onClick={() => append({ email: '', name: '' })}
            type='button'
          >
            Add Participant
          </button>
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default CreateProcess;
