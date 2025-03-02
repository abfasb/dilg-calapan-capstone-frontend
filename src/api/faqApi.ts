const API_BASE_URL = import.meta.env.VITE_API_URL;

interface FAQ {
    _id?:string;
    question: string;
    answer: string;
}

interface Blogs {
    _id?:string;
    title: string;
    content: string;
    date: string,
    status: 'draft' | 'published';

}

export const fetchFAQs = async () : Promise<FAQ[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/faqs`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
};

export const fetchBlogs = async () : Promise<Blogs[]>=> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blogs`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Blogs:', error);
    return [];
  }
};

export const saveData = async (data : any, setIsDialogOpen: (open: boolean) => void) => {
  try {
    const isFAQ = 'answer' in data;
    const endpoint = isFAQ ? 'faqs' : 'blogs';
    const method = data._id ? 'PUT' : 'POST';
    const url = data._id ? `${API_BASE_URL}/api/${endpoint}/${data._id}` : `${API_BASE_URL}/api/${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      setIsDialogOpen(false);
      return isFAQ ? fetchFAQs() : fetchBlogs();
    }
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const deleteData = async (id: string, endpoint: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/${endpoint}/${id}`, { method: 'DELETE' });
      return endpoint === 'faqs' ? fetchFAQs() : fetchBlogs();
    } catch (error) {
      console.error('Error deleting:', error);
  }
};
