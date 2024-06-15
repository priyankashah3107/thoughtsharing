const data = {
  fullName: "New Full Name",
  email: "newemail@example.com",
  username: "newusername",
  currentPassword: "currentPassword123",
  newPassword: "newPassword123",
  bio: "This is my updated bio.",
  link: "https://mynewlink.com",
  profileImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  coverImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
};

fetch("http://localhost:5000/api/users/update", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer your_jwt_token_here"
  },
  body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
