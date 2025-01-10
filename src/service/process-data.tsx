const processData = async (response: Record<string, any>) => {
  // Validate file extensions
  const getFileExtension = (file: File) => file.name.split(".").pop();
  const file1 = response.file1[0];
  const file2 = response.file2[0];

  if (!file1 || !file2) throw new Error("Both files are required.");
  const ext1 = getFileExtension(file1);
  const ext2 = getFileExtension(file2);

  if (ext1 !== ext2) throw new Error("File extensions must match.");

  // Convert files to Base64
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  const file1Base64 = await fileToBase64(file1);
  const file2Base64 = await fileToBase64(file2);

  // Construct the API payload
  const apiPayload = {
    file1: file1Base64,
    file2: file2Base64,
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
      email: emailObj.email
    })),
  };

  console.log("Payload: ", apiPayload);

  return apiPayload;
};

export default processData;