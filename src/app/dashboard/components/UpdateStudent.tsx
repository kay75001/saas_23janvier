interface UpdateUserInput {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  // Make password optional if it's not always present
  password?: string;
}

async function updateUser(user: UpdateUserInput) {
  try {
    const response = await fetch("/api/user/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        password: user.password, // Only include if updating password
      }),
    });

    if (!response.ok) throw new Error("Failed to update user");

    return await response.json();
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}
