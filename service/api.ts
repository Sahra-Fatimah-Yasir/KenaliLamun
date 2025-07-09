
export const BACKEND ={
    BASE_URL: 'http://127.0.0.1:8000',
    headers:{
        accept: 'application/json',
    }
}

export const fetchGetAllJenisLamun = async () => {
  const endpoint = `${BACKEND.BASE_URL}/lamun/get-data`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: BACKEND.headers,
  });

  if (!response.ok) {
    
    throw new Error('Failed to fetch ');
  }

  const data = await response.json();

  return data;
};


export const uploadLamunImage = async (fileUri: string, fileName: string) => {
  const formData = new FormData();

  const photo: any = {
    uri: fileUri,
    name: fileName,
    type: 'image/jpeg',
  };

  formData.append('file', photo);

  const response = await fetch(`${BACKEND.BASE_URL}/lamun/detect?threshold=0.4`, {
    method: 'POST',
    body: formData,
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.message || 'Upload gagal');

  return {
    detections: json.detections,
    enhancedBase64: json.enhanced_image_base64,
  };
};
