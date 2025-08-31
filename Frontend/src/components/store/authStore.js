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
  try {
    // Convert profileData to FormData if image is included
    const formData = new FormData();
    for (const key in profileData) {
      if (profileData[key] !== undefined && profileData[key] !== null) {
        formData.append(key, profileData[key]);
      }
    }

    const response = await axios.put(`${API_URL}/profile/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("access")}`, // if using JWT
      },
      withCredentials: true, // if using cookies
    });


    set({
      user: { ...useAuthStore.getState().user, ...response.data },
      isLoading: false,
      message: "Profile updated successfully",
    });

    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.log(error)
    set({
      error: error.response?.data || "Update failed",
      isLoading: false,
    });
    throw error;
  }
}




      
          }),

    {
      name: "auth-store", // Key for localStorage
      getStorage: () => localStorage, // Persist data in localStorage
    }
  )
);