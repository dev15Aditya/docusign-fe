import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DocumentStatus from './DocumentStatus';
import { useForm } from 'react-hook-form';
import { baseUrl } from '../service/url';
import FullScreenSpinner from './FullScreenSpinner';

const ReviewSignDoc = () => {
  const [currentStatus, setCurrentStatus] = useState<any>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const { document_id, unique_hash } = useParams<{
    document_id: string;
    unique_hash: string;
  }>();

  useEffect(() => {
    async function getCurrentStatus() {
      try{
        setLoading(true);
      const res = await axios.get(
        `${baseUrl}/document/status/${document_id}/${unique_hash}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Response--->', res.data);
      setCurrentStatus(res.data);
      } catch (error){
        console.error(error);
        window.alert('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    getCurrentStatus();

  }, [document_id, unique_hash]);

  const handleDocuSign = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${baseUrl}/document/sign/${document_id}/${unique_hash}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Sign res: ', res);
      window.alert('Signed document successfully');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        window.alert(error.response.data.message);
      } else {
        window.alert('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  const onSubmit = async (data: Record<string, any>) => {
    try {
      setLoading(true);
      const getFileExtension = (file: File) => file.name.split('.').pop();
      const file = data.file[0];

      const ext = getFileExtension(file);

      const fileBase64 = await fileToBase64(file);
      console.log('Base 64', fileBase64);
      const body = {
        data: fileBase64,
        description: data.description,
        file_extension: `.${ext}`,
      };

      const res = await axios.post(
        `${baseUrl}/document/user/government/${document_id}/${unique_hash}`,
        body, {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.status === 200) {
        window.alert('File uploaded successfully! Go ahead and sign.');
      } else {
        window.alert('Something went wrong!');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        window.alert(error.response.data.message);
      } else {
        window.alert('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <FullScreenSpinner loading />}

      <DocumentStatus
        currentUser={currentStatus?.current_user || {}}
        files={currentStatus?.files || {}}
        participants={currentStatus?.participants || []}
        status={currentStatus?.status || ''}
        documentId={''}
      />

      {
        <div>
          {/* Upload */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>Upload document</label>
              <input type="file" {...register('file', { required: true })} />
              {errors.file1 && <span>This field is required</span>}
            </div>
            <div>
              <label>Description</label>
              <textarea {...register('description', { required: true })} />
              {errors.description && <span>This field is required</span>}
            </div>
            <button type="submit">Submit</button>
          </form>

          {/* sign */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              justifyContent: 'center',
            }}
          >
            <h2>Sign Document</h2>
            <button onClick={handleDocuSign}>Sign</button>
          </div>
        </div>
      }
    </div>
  );
};

export default ReviewSignDoc;
