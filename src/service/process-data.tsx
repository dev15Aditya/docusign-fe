const processData = async (response: Record<string, any>) => {
  // Validate file extensions
  const getFileExtension = (file: File) => file.name.split(".").pop();
  const file1 = response.file1[0];

  if (!file1) throw new Error("Both files are required.");
  const ext1 = getFileExtension(file1);

  // Convert files to Base64
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  const file1Base64 = await fileToBase64(file1);

  // Construct the API payload
  const apiPayload = {
    file1: file1Base64,
    file_extension: `.${ext1}`,
    concept: response.concept,
    description: response.description,
    requester: {
      email: response.requesterEmail,
      name: response.requesterName,
    },
    target: {
      email: response.targetEmail,
      name: response.targetName,
    },
    other_authorizers: response.optionalEmails.map((emailObj: any) => ({
      email: emailObj.email,
      name: emailObj.name,
    })),
  };

  console.log("Payload: ", apiPayload);

  return apiPayload;
};

export default processData;