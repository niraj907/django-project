import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";


const API_URL = "http://127.0.0.1:8000/api/user";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      message: null,
      email: null, // <-- add this in the store


           getAccessToken: async () => {
        const accessToken = localStorage.getItem("access_token");
        return accessToken;
      },


      // Register Function
 registerUser: async (email, name, password, password2) => {
  set({ isLoading: true, error: null });
  try {
    const response = await axios.post(
      `${API_URL}/register/`,
      { email, name, password, password2 },
      { withCredentials: true }
    );

    console.log("Register successful:", response.data);

    set({
      isAuthenticated: false,  // Not yet verified
      user: null,
      email: email, // Store email for OTP verification
      isLoading: false,
      message: "Registration successful",
    });
  } catch (error) {
    console.log(error)
    set({
      error: error.response?.data?.message || "Registration failed",
      isLoading: false,
    });
    throw error;
  }
},

          // Login function
 login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            `${API_URL}/login/`,
            { email, password }
          );
          console.log("Response Headers: ", response.headers);
          console.log("login successful:", response.data);

          // --- FIX START ---
          // The access token is nested inside the 'token' object in your API response.
          const accessToken = response.data.token.access;

          if (accessToken) {
            localStorage.setItem("access_token", accessToken);
            set({
              isAuthenticated: true,
              // Assuming the user data is not returned directly in login response
              // you might need another API call to fetch user profile using the token
              user: response.data.user || null,
              error: null,
              isLoading: false,
            });
            console.log("Access token stored:", accessToken);
          } else {
             throw new Error("Access token not found in response");
          }
          // --- FIX END ---

        } catch (error) {
          set({
            error: error.response?.data?.message || "Error logging in",
            isLoading: false,
          });
          throw error;
        }
      },
    


verifyEmail: async (code) => {
  set({ isLoading: true, error: null });
  try {
    const email = useAuthStore.getState().email;
    const response = await axios.post(`${API_URL}/verify-otp/`, {
      email,
      code,
    });

    set({
      user: response.data.user || null,
      isAuthenticated: true,
      isLoading: false,
    });

    return response.data;
  } catch (error) {
    set({
      error: error.response?.data?.message || "Error verifying email",
      isLoading: false,
    });
    throw error;
  }
},


      // Forgot password function
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/send-rest-password-email/`, { email });
          set({ message: response.data.message, isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Error sending reset password email",
          });
          throw error;
        }
      },
       
// Reset password function
resetPassword: async (uid, token, newPassword, confirmPassword) => {
  set({ isLoading: true, error: null });
  try {
    const response = await axios.post(
      
      `${API_URL}/reset-passwod/${uid}/${token}/`,
      {
        new_password: newPassword,
        confirm_password: confirmPassword
      }
    );
    set({ message: response.data.message, isLoading: false });
  } catch (error) {
    set({
      isLoading: false,
      error:
        error.response?.data?.message ||
        "Error resetting password",
    });
    throw error;
  }
}
,


updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    const accessToken = await useAuthStore.getState().getAccessToken();
    if (!accessToken) {
        const errorMsg = "Authentication Error: No access token found.";
        set({ isLoading: false, error: errorMsg });
        // It's better to throw an error here to be caught by the component
        throw new Error(errorMsg);
    }

    try {
        const formData = new FormData();
        for (const key in profileData) {
            if (profileData[key] !== undefined && profileData[key] !== null) {
                formData.append(key, profileData[key]);
            }
        }

        // ✅ Step 1: Capture the response from the API call
        const response = await axios.put(`${API_URL}/profile/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
        });

        // ✅ Step 2: Use the user data from the response to update the store
        // Your Postman response shows the user data is nested under a "user" key.
        if (response.data && response.data.user) {
            set({
                user: response.data.user, // Use the complete user object from the server
                isLoading: false,
                error: null,
            });
        }

        // ✅ Step 3: Return the successful response data
        return response.data;

    } catch (error) {
        console.log("Error updating profile:", error);
        set({
            error: error.response?.data || "Update failed",
            isLoading: false,
        });
        throw error;
    }
},


 changePassword: async (old_password, new_password, confirm_password) => {
    set({ isLoading: true, error: null, message: null });
        const accessToken = await useAuthStore.getState().getAccessToken();
    if (!accessToken) {
        const errorMsg = "Authentication Error: No access token found.";
        set({ isLoading: false, error: errorMsg });
        // It's better to throw an error here to be caught by the component
        throw new Error(errorMsg);
    }
    try {
      const response = await axios.post(
        `${API_URL}/changePassword/`,
        { old_password, new_password, confirm_password },
        {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true, }
      );

      set({ message: response.data.message, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data || "Error updating password",
        isLoading: false,
      });
      throw error;
    }
  },


// DeleteAccount : async () => {
//   set({ isLoading: true, error: null, message: null });

//   const accessToken = await useAuthStore.getState().getAccessToken();
//   if (!accessToken) {
//     const errorMsg = "Authentication Error: No access token found.";
//     set({ isLoading: false, error: errorMsg });
//     throw new Error(errorMsg);
//   }

//   try {
//     // Send DELETE request with authentication header
//     const response = await axios.delete(`${API_URL}/deleteAccount/`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       withCredentials: true,
//     });

//     // Clear store + remove token
//     localStorage.removeItem("access_token");

//     set({
//       user: null,
//       isAuthenticated: false,
//       message: response.data.message || "Account deleted successfully",
//       isLoading: false,
//     });

//     return { success: true, message: response.data.message };
//   } catch (error) {
//     set({
//       isLoading: false,
//       error: error.response?.data?.message || "Error deleting account",
//     });
//     return { success: false, message: "Error deleting account" };
//   }
// },



DeleteAccount: async () => {
  const accessToken = await useAuthStore.getState().getAccessToken();
  if (!accessToken) {
    throw new Error("Authentication Error: No access token found.");
  }

  try {
    const response = await axios.delete(`${API_URL}/deleteAccount/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });

    // Clear token and reset store
    localStorage.removeItem("access_token");
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      message: response.data.message || "Account deleted successfully",
    });

    return { success: true, message: response.data.message };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error deleting account");
  }
},




      logout: async () => {
        try {
          const accessToken = localStorage.getItem("access_token");
   
          const response = await axios.post(
            `${API_URL}/logout/`,
            null, 
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          console.log("Logout successful:", response.data);

          
          localStorage.removeItem("access_token");
       
          localStorage.removeItem("auth-store");

          set({
            user: null,
            isAuthenticated: false,
            message: "Logged out successfully", 
            error: null,
          });
        } catch (error) {
          console.error("Logout error:", error);
          set({
            error: error.response?.data?.detail || "Logout failed",
          });
        }
      },

    }),




    {
      name: "auth-store", // Key for localStorage
      getStorage: () => localStorage, // Persist data in localStorage
    }
  )
);