export async function fetchUsers() {
  const token = localStorage.getItem('token');

  const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}
