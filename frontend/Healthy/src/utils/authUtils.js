export const isLabAuthenticated = () => {
  const token = localStorage.getItem('labToken');
  return !!token;
};

export const getLabToken = () => {
  return localStorage.getItem('labToken');
};

export const setLabToken = (token) => {
  localStorage.setItem('labToken', token);
};

export const removeLabToken = () => {
  localStorage.removeItem('labToken');
};

export const getAuthHeaders = () => {
  const token = getLabToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const getLabId = () => {
  try {
    const lab = JSON.parse(localStorage.getItem('lab'));
    return lab?.id || null;
  } catch (error) {
    console.error('Error getting lab ID:', error);
    return null;
  }
};

export const getLabData = () => {
  try {
    const labData = localStorage.getItem('lab');
    if (!labData) return null;
    
    const lab = JSON.parse(labData);
    return lab.type === 'lab' ? lab : null;
  } catch (error) {
    console.error('Error getting lab data:', error);
    return null;
  }
};

export const isValidLabUser = () => {
  const labData = getLabData();
  return !!(labData && labData.id && labData.type === 'lab');
};
